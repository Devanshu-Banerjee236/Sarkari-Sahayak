import requests, base64, wave, io, os

text = ("नमस्ते! पीएम किसान योजना के तहत पात्र किसानों को हर साल छह हज़ार रुपये मिलते हैं। "
        "यह राशि तीन किस्तों में सीधे बैंक खाते में भेजी जाती है। आवेदन के लिए आधार कार्ड, "
        "बैंक पासबुक और ज़मीन के कागज़ात चाहिए। ") * 6

r = requests.post("http://127.0.0.1:8001/api/tts",
                  json={"text": text, "language_code": "hi-IN", "speaker": "shubh"})
d = r.json()
raw = base64.b64decode(d["audio_base64"])
w = wave.open(io.BytesIO(raw))
print("source:", d.get("source"))
print("text chars sent:", len(text))
print("audio seconds:", round(w.getnframes() / w.getframerate(), 1))
open("test.wav", "wb").write(raw)
os.startfile("test.wav")