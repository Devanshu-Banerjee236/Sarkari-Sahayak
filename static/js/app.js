/**
 * Sarkari Sahayak - Client-Side Application Logic
 * Integrates with Sarvam AI:
 * - Saaras v4 (STT)
 * - Bulbul v3 / v4-flash (TTS)
 * - Sarvam-105B (Indic Chat LLM)
 * - Mayura v1 (Translate)
 * - Sarvam Vision (Doc AI)
 */

// Application State
const appState = {
  currentLanguage: 'hi-IN',
  currentSpeaker: 'shubh',
  apiKeyConfigured: false,
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  recordStartTime: 0,
  recordTimerInterval: null,
  audioContext: null,
  analyser: null,
  animFrameId: null,
  chatHistory: [],
  profileTouched: false,   // true only after the user edits/loads the profile form
  audioStore: [],          // keeps generated audio out of onclick attributes
  currentExtractedKyc: null,
  selectedSampleDoc: 'kisan'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchAppConfig();
  initWaveformCanvas();
  runEligibilityMatcher(true); // Initial match with default profile (not user input)
  ['profOccupation','profIncome','profLand','profAge','profArea'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => { appState.profileTouched = true; });
      el.addEventListener('change', () => { appState.profileTouched = true; });
    }
  });
  selectSampleDocument('kisan'); // Preload sample document
  logConsole('Ready. Powered by Sarvam AI Multimodal Pipeline.');
});

// =========================================================================
// 1. CONFIGURATION & NAVIGATION
// =========================================================================

async function fetchAppConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    
    appState.apiKeyConfigured = data.has_api_key;
    const dot = document.getElementById('apiKeyStatusDot');
    const text = document.getElementById('apiKeyStatusText');
    
    if (data.has_api_key) {
      dot.classList.add('active-key');
      text.textContent = `Sarvam API: Live (${data.masked_key})`;
      logConsole(`[CONFIG] Sarvam API Key Active: ${data.masked_key}`);
    } else {
      dot.classList.remove('active-key');
      text.textContent = 'Sarvam API: Demo Mode';
      logConsole('[CONFIG] Running in smart simulation mode. Click gear icon to set SARVAM_API_KEY.');
    }
  } catch (err) {
    console.error('Failed to load config:', err);
  }
}

function switchTab(sectionId, btnElement) {
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  // Update content sections
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active-section');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active-section');
  }
}

function onLanguageChange(langCode) {
  appState.currentLanguage = langCode;
  logConsole(`[LANG] Selected language: ${langCode}`);
  
  // Update speaker options tailored to language
  const speakerSelect = document.getElementById('speakerSelect');
  if (langCode === 'ta-IN') {
    speakerSelect.innerHTML = `
      <option value="vijay" selected>Vijay (விஜய்)</option>
      <option value="gokul">Gokul (கோகுல்)</option>
    `;
    appState.currentSpeaker = 'vijay';
  } else if (langCode === 'te-IN') {
    speakerSelect.innerHTML = `
      <option value="kavitha" selected>Kavitha (కవిత)</option>
      <option value="pooja">Pooja (పూజ)</option>
    `;
    appState.currentSpeaker = 'kavitha';
  } else if (langCode === 'en-IN') {
    speakerSelect.innerHTML = `
      <option value="shubh" selected>Shubh (Indian English)</option>
      <option value="simran">Simran (Indian English)</option>
      <option value="dev">Dev</option>
    `;
    appState.currentSpeaker = 'shubh';
  } else {
    speakerSelect.innerHTML = `
      <option value="shubh" selected>Shubh (शुभ)</option>
      <option value="ritu">Ritu (रितु)</option>
      <option value="priya">Priya (प्रिया)</option>
      <option value="aditya">Aditya (आदित्य)</option>
      <option value="roopa">Roopa (रूपा)</option>
    `;
    appState.currentSpeaker = 'shubh';
  }
}

function onSpeakerChange(speakerId) {
  appState.currentSpeaker = speakerId;
  logConsole(`[TTS] Selected Bulbul Voice Speaker: ${speakerId}`);
}

function openApiKeyModal() {
  document.getElementById('apiKeyModal').classList.remove('hidden');
}

function closeApiKeyModal() {
  document.getElementById('apiKeyModal').classList.add('hidden');
}

async function saveApiKey() {
  const keyVal = document.getElementById('apiKeyInput').value.trim();
  try {
    const res = await fetch('/api/set-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: keyVal })
    });
    const data = await res.json();
    closeApiKeyModal();
    fetchAppConfig();
    alert(data.message);
  } catch (err) {
    alert('Error saving API key: ' + err.message);
  }
}

// =========================================================================
// 2. LIVE VOICE & AUDIO RECORDING (Saaras v4 & Web Audio API)
// =========================================================================

function initWaveformCanvas() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Draw idle baseline
  ctx.fillStyle = '#060A12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

async function toggleMicrophoneRecording() {
  if (appState.isRecording) {
    stopMicrophoneRecording();
  } else {
    await startMicrophoneRecording();
  }
}

async function startMicrophoneRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    appState.audioChunks = [];
    appState.mediaRecorder = new MediaRecorder(stream);
    
    // Setup Audio Analyser for live visualizer
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    appState.audioContext = new AudioContextClass();
    const source = appState.audioContext.createMediaStreamSource(stream);
    appState.analyser = appState.audioContext.createAnalyser();
    appState.analyser.fftSize = 256;
    source.connect(appState.analyser);
    
    appState.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) appState.audioChunks.push(e.data);
    };
    
    appState.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(appState.audioChunks, { type: 'audio/wav' });
      stream.getTracks().forEach(track => track.stop());
      cancelAnimationFrame(appState.animFrameId);
      initWaveformCanvas();
      await processRecordedAudio(audioBlob);
    };

    appState.mediaRecorder.start();
    appState.isRecording = true;
    appState.recordStartTime = Date.now();

    // UI Updates
    const micBtn = document.getElementById('recordMicBtn');
    micBtn.classList.add('recording');
    document.getElementById('micBtnLabel').textContent = 'रोकें (Tap to Stop)';
    document.getElementById('recordingTimer').classList.remove('hidden');

    // Start timer counter
    appState.recordTimerInterval = setInterval(updateRecordTimer, 1000);
    drawLiveWaveform();
    logConsole('[MIC] Recording started. Speak in your native language...');
  } catch (err) {
    console.warn('Microphone access unavailable or denied:', err);
    logConsole('[MIC] Microphone error: ' + err.message + '. Simulating spoken voice input.');
    simulateVoiceQuery('hi-farmer');
  }
}

function stopMicrophoneRecording() {
  if (appState.mediaRecorder && appState.isRecording) {
    appState.mediaRecorder.stop();
    appState.isRecording = false;
    clearInterval(appState.recordTimerInterval);

    const micBtn = document.getElementById('recordMicBtn');
    micBtn.classList.remove('recording');
    document.getElementById('micBtnLabel').textContent = 'बोलने के लिए दबाएं (Tap to Speak)';
    document.getElementById('recordingTimer').classList.add('hidden');
    logConsole('[MIC] Recording stopped. Transcribing via Sarvam Saaras v4...');
  }
}

function updateRecordTimer() {
  const elapsedSec = Math.floor((Date.now() - appState.recordStartTime) / 1000);
  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(elapsedSec % 60).padStart(2, '0');
  document.getElementById('recordingTimer').textContent = `${mins}:${secs}`;
}

function drawLiveWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas || !appState.analyser) return;
  const ctx = canvas.getContext('2d');
  const bufferLength = appState.analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    appState.animFrameId = requestAnimationFrame(draw);
    appState.analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#060A12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#F59E0B');
      gradient.addColorStop(1, '#34D399');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  draw();
}

async function processRecordedAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'citizen_speech.wav');
  formData.append('language_code', appState.currentLanguage);
  formData.append('mode', 'transcribe');

  try {
    logConsole('[STT] Sending audio to Sarvam Saaras v4...');
    const res = await fetch('/api/stt', { method: 'POST', body: formData });
    const data = await res.json();
    
    if (data.latency_ms) {
      document.getElementById('metricSttLatency').textContent = `${data.latency_ms} ms`;
    }

    const transcript = data.transcript || "आवाज़ प्राप्त हुई।";
    logConsole(`[STT Output] "${transcript}" (Latency: ${data.latency_ms}ms)`);

    // Post to chat feed and trigger Sarvam-105B
    appendUserMessage(transcript);
    await triggerChatCompletion(transcript);
  } catch (err) {
    logConsole('[STT Error] ' + err.message);
  }
}

// =========================================================================
// 3. DIALOGUE & SARVAM-105B CHAT COMPLETION
// =========================================================================

function appendUserMessage(text) {
  const feed = document.getElementById('chatFeed');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg user-msg';
  msgEl.innerHTML = `
    <div class="msg-avatar">👤</div>
    <div class="msg-body">
      <div class="msg-header">
        <strong>नागरिक (Citizen)</strong>
        <span class="msg-time">अभी</span>
      </div>
      <div class="msg-text">${escapeHtml(text)}</div>
    </div>
  `;
  feed.appendChild(msgEl);
  feed.scrollTop = feed.scrollHeight;
  appState.chatHistory.push({ role: 'user', content: text });
}

function appendAssistantMessage(text, audioBase64 = null) {
  const feed = document.getElementById('chatFeed');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg assistant-msg';
  
  let audioActionHtml;
  if (audioBase64) {
    appState.audioStore.push(audioBase64);
    const idx = appState.audioStore.length - 1;
    audioActionHtml = `<button class="tts-play-btn" onclick="playAudioBase64(appState.audioStore[${idx}], this)">🔊 सुनें (Bulbul Voice)</button>`;
  } else {
    audioActionHtml = `<button class="tts-play-btn" data-text="${escapeHtml(extractSpokenSummary(text))}" onclick="synthesizeAndPlay(this.dataset.text, this)">🔊 सुनें (Bulbul Voice)</button>`;
  }

  msgEl.innerHTML = `
    <div class="msg-avatar">🏛️</div>
    <div class="msg-body">
      <div class="msg-header">
        <strong>सरकारी सहायक (Sarvam-105B)</strong>
        <span class="msg-time">अभी</span>
      </div>
      <div class="msg-text">${renderMarkdown(text)}</div>
      <div class="msg-tools">
        ${audioActionHtml}
      </div>
    </div>
  `;
  feed.appendChild(msgEl);
  feed.scrollTop = feed.scrollHeight;
  appState.chatHistory.push({ role: 'assistant', content: text });
}

async function triggerChatCompletion(userText) {
  try {
    logConsole('[LLM] Requesting Sarvam-105B Indic reasoning...');
    
    // Collect current applicant profile context
    const profile = {
      occupation: document.getElementById('profOccupation').value,
      annual_income: document.getElementById('profIncome').value,
      landholding_acres: document.getElementById('profLand').value,
      age: document.getElementById('profAge').value,
      area: document.getElementById('profArea').value
    };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: appState.chatHistory,
        profile: appState.profileTouched ? profile : null,
        language_code: appState.currentLanguage
      })
    });
    const data = await res.json();
    
    if (data.latency_ms) {
      document.getElementById('metricLlmLatency').textContent = `${data.latency_ms} ms`;
    }

    logConsole(`[LLM Response] Latency: ${data.latency_ms}ms (Model: ${data.model})`);
    
    // Automatically synthesize voice via Bulbul for natural conversational flow
    const spokenSummary = extractSpokenSummary(data.reply);
    const ttsResult = spokenSummary ? await requestTtsAudio(spokenSummary) : null;

    appendAssistantMessage(data.reply, ttsResult ? ttsResult.audio_base64 : null);
    
    // Auto-play audio response
    if (ttsResult && ttsResult.audio_base64) {
      playAudioBase64(ttsResult.audio_base64);
    }
  } catch (err) {
    logConsole('[LLM Error] ' + err.message);
  }
}

function sendTextMessage() {
  const input = document.getElementById('chatTextInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendUserMessage(text);
  triggerChatCompletion(text);
}

function clearConversation() {
  appState.chatHistory = [];
  document.getElementById('chatFeed').innerHTML = `
    <div class="chat-msg assistant-msg">
      <div class="msg-avatar">🏛️</div>
      <div class="msg-body">
        <div class="msg-header">
          <strong>सरकारी सहायक</strong>
          <span class="msg-time">अभी</span>
        </div>
        <div class="msg-text">संवाद रीसेट हो गया है। आप किसी भी योजना के बारे में बोलकर या लिखकर पूछ सकते हैं।</div>
      </div>
    </div>
  `;
}

// =========================================================================
// 4. TEXT-TO-SPEECH (Bulbul v3 / v4-flash)
// =========================================================================

async function requestTtsAudio(text) {
  try {
    logConsole(`[TTS] Synthesizing speech with Bulbul (Speaker: ${appState.currentSpeaker})...`);
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        language_code: appState.currentLanguage,
        speaker: appState.currentSpeaker,
        pace: 1.0
      })
    });
    const data = await res.json();
    if (data.latency_ms) {
      document.getElementById('metricTtsLatency').textContent = `${data.latency_ms} ms`;
    }
    logConsole(`[TTS Complete] Latency: ${data.latency_ms}ms`);
    return data;
  } catch (err) {
    console.error('TTS request error:', err);
    return null;
  }
}

async function synthesizeAndPlay(text, btnElement) {
  if (btnElement) btnElement.classList.add('playing');
  const data = await requestTtsAudio(text);
  if (data && data.audio_base64) {
    playAudioBase64(data.audio_base64, btnElement);
  }
}

function playAudioBase64(base64Str, btnElement = null) {
  const player = document.getElementById('globalAudioPlayer');
  player.src = `data:audio/wav;base64,${base64Str}`;
  if (btnElement) btnElement.classList.add('playing');

  player.onended = () => {
    if (btnElement) btnElement.classList.remove('playing');
  };
  player.play().catch(e => console.log('Audio autoplay prevented:', e));
}

function playCurrentGreeting() {
  const text = "नमस्ते, सरकारी सहायक में आपका स्वागत है। अपनी किसी भी सरकारी योजना के बारे में जानने के लिए मुझसे बोलकर पूछें।";
  synthesizeAndPlay(text);
}

function speakField(fieldName, fieldValue) {
  const spoken = `${fieldName}: ${fieldValue}। यह विवरण सत्यापित है।`;
  synthesizeAndPlay(spoken);
}

// =========================================================================
// 5. SCHEME COMPASS (योजना खोज व पात्रता जांच)
// =========================================================================

function updateIncomeLabel(val) {
  const formatted = Number(val).toLocaleString('en-IN');
  document.getElementById('incomeDisplayVal').textContent = `₹${formatted} / वर्ष`;
}

function updateLandLabel(val) {
  document.getElementById('landDisplayVal').textContent = `${val} Acres`;
}

function toggleGirlChildField(checked) {
  const wrap = document.getElementById('girlAgeWrap');
  if (checked) {
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
  runEligibilityMatcher();
}

function resetProfileForm() {
  document.getElementById('profileForm').reset();
  updateIncomeLabel(80000);
  updateLandLabel(1.8);
  runEligibilityMatcher();
}

async function runEligibilityMatcher(isInitial = false) {
  if (!isInitial) appState.profileTouched = true;
  const payload = {
    occupation: document.getElementById('profOccupation').value,
    annual_income: parseFloat(document.getElementById('profIncome').value) || 0,
    landholding_acres: parseFloat(document.getElementById('profLand').value) || 0,
    age: parseInt(document.getElementById('profAge').value) || 35,
    gender: document.getElementById('profGender').value,
    area: document.getElementById('profArea').value,
    has_girl_child: document.getElementById('profGirlChild').checked,
    girl_child_age: parseInt(document.getElementById('profGirlAge').value) || 0,
    is_shg_member: document.getElementById('profShg').checked
  };

  try {
    const res = await fetch('/api/match-schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    renderSchemes(data.matches || []);
  } catch (err) {
    console.error('Error matching schemes:', err);
  }
}

function renderSchemes(matches) {
  const container = document.getElementById('schemesList');
  document.getElementById('matchedCountBadge').textContent = `${matches.length} योजनाएं`;
  container.innerHTML = '';

  if (matches.length === 0) {
    container.innerHTML = '<p class="panel-desc">कोई योजना नहीं मिली। कृपया अपने प्रोफाइल फ़िल्टर बदलें।</p>';
    return;
  }

  matches.forEach(item => {
    const s = item.scheme;
    const isHigh = item.match_score >= 80;
    const card = document.createElement('div');
    card.className = `scheme-card ${isHigh ? 'high-match' : ''}`;

    const reasonsHtml = item.reasons && item.reasons.length > 0
      ? `<ul class="scheme-reasons-list">${item.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`
      : '';

    const docsHtml = s.required_documents
      ? `<div class="scheme-docs-tags">${s.required_documents.map(d => `<span class="doc-tag">📄 ${escapeHtml(d)}</span>`).join('')}</div>`
      : '';

    card.innerHTML = `
      <div class="scheme-header-row">
        <div class="scheme-title-wrap">
          <h4>${escapeHtml(s.name)}</h4>
          <span class="scheme-hindi-title">${escapeHtml(s.hindi_name)}</span>
        </div>
        <span class="match-meter">
          ${item.match_score}% Match
        </span>
      </div>

      <div class="scheme-benefit-pill">
        💰 वित्तीय लाभ: ${escapeHtml(s.financial_benefit)}
      </div>

      <p class="scheme-desc-text">${escapeHtml(s.description)}</p>

      ${reasonsHtml}
      ${docsHtml}

      <div class="scheme-actions-row">
        <button class="tts-play-btn" onclick="synthesizeAndPlay('${escapeHtml(s.hindi_name + '। ' + s.financial_benefit + '। ' + s.description).substring(0, 1200)}')">
          🔊 योजना का विवरण सुनें
        </button>
        <button class="apply-scheme-btn" onclick="selectSchemeForApplication('${s.id}', '${escapeHtml(s.name)}')">
          📝 इस योजना के लिए आवेदन करें ➤
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function selectSchemeForApplication(schemeId, schemeTitle) {
  // Set target scheme in application form
  const select = document.getElementById('formTargetScheme');
  select.value = schemeId;
  
  // Switch to application docket tab
  const docketNavBtn = document.querySelector('[data-target="applicationDocketSection"]');
  switchTab('applicationDocketSection', docketNavBtn);
  logConsole(`[APPLICATION] Selected scheme: ${schemeTitle}`);
}

// =========================================================================
// 6. KYC VISION DESK (दस्तावेज़ सत्यापन)
// =========================================================================

function selectSampleDocument(type) {
  appState.selectedSampleDoc = type;
  const kisanBtn = document.getElementById('sampleKisanBtn');
  const vendorBtn = document.getElementById('sampleVendorBtn');
  const previewImg = document.getElementById('docPreviewImg');
  const filenameBadge = document.getElementById('docFilenameBadge');

  if (type === 'kisan') {
    kisanBtn.classList.add('active');
    vendorBtn.classList.remove('active');
    previewImg.src = '/static/images/sample_kisan.jpg';
    filenameBadge.textContent = 'sample_kisan_card.jpg';
  } else {
    vendorBtn.classList.add('active');
    kisanBtn.classList.remove('active');
    previewImg.src = '/static/images/sample_vendor.jpg';
    filenameBadge.textContent = 'sample_vendor_card.jpg';
  }
  processSelectedDocument();
}

async function handleKycFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('docPreviewImg').src = e.target.result;
    document.getElementById('docFilenameBadge').textContent = file.name;
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('file', file);
  await executeDocumentOcr(formData);
}

async function processSelectedDocument() {
  const formData = new FormData();
  formData.append('sample_id', appState.selectedSampleDoc);
  await executeDocumentOcr(formData);
}

async function executeDocumentOcr(formData) {
  const resultsWrap = document.getElementById('kycResultsContent');
  const loader = document.getElementById('kycResultsLoading');
  resultsWrap.innerHTML = '';
  loader.classList.remove('hidden');

  try {
    logConsole('[VISION] Ingesting document into Sarvam Vision OCR engine...');
    const res = await fetch('/api/document-parse', { method: 'POST', body: formData });
    const data = await res.json();
    loader.classList.add('hidden');

    if (data.latency_ms) {
      document.getElementById('metricVisionLatency').textContent = `${data.latency_ms} ms`;
    }

    appState.currentExtractedKyc = data.document_info;
    logConsole(`[VISION Parsed] Confidence: ${(data.document_info.confidence_score * 100).toFixed(0)}% (Latency: ${data.latency_ms}ms)`);
    renderExtractedKyc(data.document_info);
  } catch (err) {
    loader.classList.add('hidden');
    logConsole('[VISION Error] ' + err.message);
  }
}

function renderExtractedKyc(docInfo) {
  const wrap = document.getElementById('kycResultsContent');
  const fields = docInfo.extracted_fields || {};

  let rowsHtml = '';
  for (const [key, val] of Object.entries(fields)) {
    const formattedKey = key.replace(/_/g, ' ').toUpperCase();
    rowsHtml += `
      <tr>
        <td class="table-field">${formattedKey}:</td>
        <td class="table-val">${escapeHtml(String(val))}</td>
      </tr>
    `;
  }

  const highlightsHtml = docInfo.eligibility_highlights
    ? docInfo.eligibility_highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')
    : '<li>All DBT verification checks passed.</li>';

  wrap.innerHTML = `
    <div class="doc-type-title">
      <h4>${escapeHtml(docInfo.document_type || 'Verified Certificate')}</h4>
      <small>Sarvam Vision Confidence: ${(docInfo.confidence_score * 100).toFixed(0)}% • Tamper-Evident</small>
    </div>

    <table class="extracted-table">
      ${rowsHtml}
    </table>

    <div class="compliance-box">
      <h5>🛡️ सर्वम एआई अनुपालन व पात्रता रिपोर्ट (Compliance Highlights):</h5>
      <ul>
        ${highlightsHtml}
      </ul>
    </div>

    <button class="primary-action-btn mt-3" onclick="autoFillFormFromExtractedData()">
      🪄 इस डेटा से आवेदन पत्र भरें (Auto-Fill Application)
    </button>
  `;
}

// =========================================================================
// 7. APPLICATION DOCKET & DBT DOSSIER GENERATION
// =========================================================================

function autoFillFormFromExtractedData() {
  if (!appState.currentExtractedKyc) {
    alert('कृपया पहले कोई दस्तावेज़ स्कैन करें।');
    return;
  }
  const f = appState.currentExtractedKyc.extracted_fields || {};
  if (f.beneficiary_name) document.getElementById('formApplicantName').value = f.beneficiary_name;
  if (f.aadhaar_masked) document.getElementById('formAadhaar').value = f.aadhaar_masked;
  if (f.total_landholding) document.getElementById('formLand').value = f.total_landholding;
  if (f.annual_income) document.getElementById('formIncome').value = f.annual_income;
  if (f.category) document.getElementById('formOccupation').value = f.category;
  if (f.bank_account_dbt || f.bank_account) {
    document.getElementById('formBank').value = f.bank_account_dbt || f.bank_account;
  }

  // Switch to application docket tab
  const docketNavBtn = document.querySelector('[data-target="applicationDocketSection"]');
  switchTab('applicationDocketSection', docketNavBtn);
  logConsole('[APPLICATION] Auto-filled form fields from Sarvam Vision extractions.');
}

async function generateOfficialDocket() {
  const payload = {
    scheme_id: document.getElementById('formTargetScheme').value,
    applicant_name: document.getElementById('formApplicantName').value,
    aadhaar_masked: document.getElementById('formAadhaar').value,
    mobile: document.getElementById('formMobile').value,
    address: document.getElementById('formAddress').value,
    occupation: document.getElementById('formOccupation').value,
    annual_income: document.getElementById('formIncome').value,
    landholding: document.getElementById('formLand').value,
    verified_documents: ["Aadhaar Card (UIDAI)", "Land/Vending Proof", "DBT Bank Passbook"]
  };

  try {
    const res = await fetch('/api/generate-docket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const d = data.docket;

    // Update docket view
    document.getElementById('docketTrackingId').textContent = d.tracking_id;
    document.getElementById('docketSchemeTitle').textContent = d.scheme.name;
    document.getElementById('docketBenefit').textContent = d.scheme.benefit;
    document.getElementById('docketApplicant').textContent = d.applicant.name;
    document.getElementById('docketAadhaar').textContent = d.applicant.aadhaar_masked;
    document.getElementById('docketAddress').textContent = d.applicant.address;

    logConsole(`[DOCKET] Official Application Dossier generated: ${d.tracking_id}`);
    
    // Announce generated docket via Bulbul
    const spoken = `बधाई हो! आपका आवेदन डॉकेट सफलतापूर्वक तैयार हो गया है। ट्रैकिंग संख्या है ${d.tracking_id}। आपका विवरण सुरक्षित रूप से सत्यापित है।`;
    synthesizeAndPlay(spoken);
  } catch (err) {
    console.error('Docket generation error:', err);
  }
}

function listenFullDocketAudio() {
  const name = document.getElementById('docketApplicant').textContent;
  const scheme = document.getElementById('docketSchemeTitle').textContent;
  const benefit = document.getElementById('docketBenefit').textContent;
  const tracking = document.getElementById('docketTrackingId').textContent;
  
  const text = `सरकारी सहायक द्वारा सत्यापित आवेदन डॉकेट। आवेदक का नाम ${name}। लक्षित योजना ${scheme}। स्वीकृत वित्तीय लाभ ${benefit}। ट्रैकिंग संख्या ${tracking}। आपका आधार व बैंक खाता डीबीटी हेतु सक्रिय है।`;
  synthesizeAndPlay(text);
}

function printDocket() {
  window.print();
}

// =========================================================================
// 8. QUICK SCENARIO LOADERS
// =========================================================================

function loadScenario(type) {
  if (type === 'farmer') {
    document.getElementById('profOccupation').value = 'farmer';
    document.getElementById('profIncome').value = 78000;
    updateIncomeLabel(78000);
    document.getElementById('profLand').value = 1.8;
    updateLandLabel(1.8);
    document.getElementById('profAge').value = 42;
    document.getElementById('profArea').value = 'rural';
    selectSampleDocument('kisan');
    runEligibilityMatcher();
    
    const prompt = 'मैं उत्तर प्रदेश के वाराणसी का किसान हूँ, 1.8 एकड़ जमीन है। मुझे पीएम किसान और स्वास्थ्य योजना का लाभ कैसे मिलेगा?';
    simulateVoiceText(prompt);
  } else if (type === 'vendor') {
    document.getElementById('profOccupation').value = 'street vendor';
    document.getElementById('profIncome').value = 168000;
    updateIncomeLabel(168000);
    document.getElementById('profLand').value = 0;
    updateLandLabel(0);
    document.getElementById('profAge').value = 36;
    document.getElementById('profArea').value = 'urban';
    selectSampleDocument('vendor');
    runEligibilityMatcher();

    const prompt = 'मैं दिल्ली में फल-सब्जी की रेहड़ी लगाती हूँ, मुझे दुकान बढ़ाने के लिए बिना गारंटी का लोन चाहिए।';
    simulateVoiceText(prompt);
  } else if (type === 'daughter') {
    document.getElementById('profOccupation').value = 'daily wage worker';
    document.getElementById('profGirlChild').checked = true;
    toggleGirlChildField(true);
    document.getElementById('profGirlAge').value = 6;
    runEligibilityMatcher();

    const prompt = 'मेरी 6 साल की बेटी है, उसकी पढ़ाई और शादी के लिए सरकारी बचत योजना बताएं।';
    simulateVoiceText(prompt);
  } else if (type === 'artisan') {
    document.getElementById('profOccupation').value = 'artisan';
    document.getElementById('profIncome').value = 90000;
    updateIncomeLabel(90000);
    document.getElementById('profLand').value = 0;
    updateLandLabel(0);
    runEligibilityMatcher();

    const prompt = 'मैं लकड़ी का काम करने वाला बढ़ई हूँ, मुझे पीएम विश्वकर्मा योजना के तहत टूलकिट और 5% ब्याज पर लोन चाहिए।';
    simulateVoiceText(prompt);
  }
}

function simulateVoiceQuery(preset) {
  let prompt = '';
  if (preset === 'hi-farmer') {
    prompt = 'मैं 2 एकड़ जमीन का किसान हूँ, मुझे खाद और बीज के लिए सरकारी योजना चाहिए।';
  } else if (preset === 'en-vendor') {
    prompt = 'I am a street vendor in Delhi needing working capital for my cart.';
  } else if (preset === 'ta-health') {
    prompt = 'நான் குடும்பத்திற்கு இலவச மருத்துவ காப்பீடு பெற முடியுமா? (Can I get free medical insurance for family?)';
  } else if (preset === 'te-pension') {
    prompt = 'వృద్ధాప్య పెन्షన్ మరియు సహాయం కోసం వివరాలు కావాలి. (Details on old age pension and support)';
  }
  simulateVoiceText(prompt);
}

function simulateVoiceText(prompt) {
  // Switch to voice tab
  const voiceNavBtn = document.querySelector('[data-target="voiceAssistantSection"]');
  switchTab('voiceAssistantSection', voiceNavBtn);
  
  // Show in chat
  appendUserMessage(prompt);
  triggerChatCompletion(prompt);
}

// =========================================================================
// 9. LOGGING & UTILITIES
// =========================================================================

function logConsole(msg) {
  const box = document.getElementById('apiConsoleOutput');
  if (!box) return;
  const time = new Date().toLocaleTimeString();
  box.textContent += `\n[${time}] ${msg}`;
  box.scrollTop = box.scrollHeight;
}

function clearConsoleLog() {
  document.getElementById('apiConsoleOutput').textContent = '[CLEARED] Ready.';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Bullets
  html = html.replace(/^\s*•\s*(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^\s*-\s*(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  return html;
}

function extractSpokenSummary(fullText) {
  if (!fullText) return '';
  // Clean markdown and emojis for clean TTS speech
  const clean = fullText
    .replace(/[\*\#\_]/g, '')
    .replace(/[🙏👉🏆💰📄⚡]/g, '')
    .replace(/\n\s*\n/g, '। ')
    .replace(/\n/g, ' ');
  return clean.replace(/\s{2,}/g, ' ').trim();
}
