"""
Sarkari Sahayak - Comprehensive Indian Welfare Schemes Knowledge Base
Provides structured data, eligibility rules, benefits, and required documents
for major Central & State government schemes.
"""

from typing import List, Dict, Any

SCHEMES: List[Dict[str, Any]] = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "hindi_name": "प्रधानमंत्री किसान सम्मान निधि",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "Agriculture & Farmers",
        "description": "Direct income support of ₹6,000 per year in 3 equal installments of ₹2,000 directly transferred into the bank accounts of landholder farmer families.",
        "hindi_description": "किसानों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता, तीन समान किस्तों (₹2,000) में सीधे बैंक खाते में।",
        "financial_benefit": "₹6,000 / year (Direct Bank Transfer)",
        "frequency": "₹2,000 every 4 months",
        "target_audience": "All landholding farmer families with cultivable land",
        "eligibility": {
            "occupations": ["farmer", "agriculture", "kisan", "cultivator"],
            "max_landholding_acres": 100,  # All landholders now eligible
            "requires_land_record": True,
            "income_tax_payer_allowed": False,
            "institutional_landholder_allowed": False,
            "min_age": 18
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Land Ownership Record / Khasra-Khatauni (जमीन का खसरा/खतौनी)",
            "Bank Account Passbook linked with Aadhaar (डीबीटी बैंक पासबुक)",
            "Active Mobile Number (सक्रिय मोबाइल नंबर)"
        ],
        "official_url": "https://pmkisan.gov.in",
        "helpline": "155261 / 011-24300606",
        "tags": ["dbt", "kisan", "direct cash", "agriculture", "rural"]
    },
    {
        "id": "ayushman-bharat",
        "name": "Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
        "hindi_name": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
        "ministry": "National Health Authority, Ministry of Health & Family Welfare",
        "category": "Health & Healthcare",
        "description": "World's largest government-funded healthcare assurance scheme offering ₹5,00,000 cashless health cover per family per year for secondary and tertiary care hospitalization.",
        "hindi_description": "प्रति परिवार प्रति वर्ष ₹5,00,000 का निःशुल्क कैशलेस अस्पताल उपचार कवर। 27,000 से अधिक अस्पतालों में मान्य।",
        "financial_benefit": "₹5,00,000 / family / year (Cashless)",
        "frequency": "As needed during hospitalisation",
        "target_audience": "Low-income rural and urban households identified via SECC/ration card and all citizens aged 70+",
        "eligibility": {
            "occupations": ["farmer", "laborer", "street vendor", "daily wage", "artisan", "domestic worker", "unemployed", "all"],
            "max_annual_income": 300000,
            "bpl_or_ration_card": True,
            "senior_citizen_universal_eligibility": True,  # 70+ now automatically eligible under PM-JAY expansion
            "min_age": 0
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Ration Card or Family ID (राशन कार्ड या समग्र आईडी)",
            "Income Certificate or BPL Card (आय प्रमाण पत्र)",
            "Mobile Number for OTP (मोबाइल नंबर)"
        ],
        "official_url": "https://pmjay.gov.in",
        "helpline": "14555",
        "tags": ["health", "hospital", "cashless", "insurance", "ayushman card"]
    },
    {
        "id": "pm-svanidhi",
        "name": "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
        "hindi_name": "पीएम स्वनिधि (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)",
        "ministry": "Ministry of Housing and Urban Affairs",
        "category": "Urban Livelihoods & Microcredit",
        "description": "Special micro-credit facility providing affordable working capital loans of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and up to ₹50,000 (3rd tranche) with 7% interest subsidy on timely repayment.",
        "hindi_description": "रेहड़ी-पटरी और फेरीवालों को ₹10,000 से ₹50,000 तक का बिना किसी गारंटी का लोन, 7% ब्याज सब्सिडी और डिजिटल लेनदेन पर कैशबैक के साथ।",
        "financial_benefit": "₹10,000 - ₹50,000 Working Capital Loan (7% Interest Subsidy)",
        "frequency": "Graduated tranches",
        "target_audience": "Urban and peri-urban street vendors, hawkers, thelawalas, fruit/vegetable sellers",
        "eligibility": {
            "occupations": ["street vendor", "vendor", "hawker", "thelawala", "fruit seller", "vegetable vendor", "tea stall", "artisan"],
            "requires_vending_proof": True,
            "urban_area": True,
            "min_age": 18
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Certificate of Vending / Vending ID / Town Vending Recommendation (विक्रय प्रमाण पत्र)",
            "Bank Account Passbook (बैंक पासबुक)",
            "Mobile linked with Aadhaar (आधार लिंक मोबाइल)"
        ],
        "official_url": "https://pmsvanidhi.mohua.gov.in",
        "helpline": "1800-11-1979",
        "tags": ["loan", "street vendor", "microcredit", "interest subsidy", "urban"]
    },
    {
        "id": "pm-vishwakarma",
        "name": "PM Vishwakarma Scheme",
        "hindi_name": "पीएम विश्वकर्मा योजना",
        "ministry": "Ministry of Micro, Small and Medium Enterprises",
        "category": "Artisans & Traditional Crafts",
        "description": "Holistic support for traditional artisans and craftspeople: PM Vishwakarma Certificate & ID card, skill verification with ₹500/day stipend during training, ₹15,000 toolkit incentive, and collateral-free enterprise loans up to ₹3,00,000 at concessional 5% interest.",
        "hindi_description": "पारंपरिक कारीगरों और शिल्पकारों को मान्यता, ₹15,000 टूलकिट ग्रांट, ₹500 प्रतिदिन प्रशिक्षण वजीफा, और केवल 5% ब्याज पर ₹3 लाख तक का कोलैटरल-फ्री ऋण।",
        "financial_benefit": "₹15,000 Toolkit Grant + Up to ₹3,00,000 Loan at 5%",
        "frequency": "Training stipend + Grant + Credit",
        "target_audience": "18 traditional trades including carpenters, blacksmiths, potters, cobblers, tailors, weavers, barbers, washermen, masons",
        "eligibility": {
            "occupations": ["artisan", "carpenter", "blacksmith", "potter", "sculptor", "cobbler", "mason", "tailor", "barber", "washerman", "goldsmith", "boat builder"],
            "min_age": 18,
            "only_one_member_per_family": True,
            "no_govt_service": True
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Bank Passbook (बैंक पासबुक)",
            "Ration Card (राशन कार्ड)",
            "Self-Declaration of Trade & Skill (कारीगरी स्व-घोषणा)"
        ],
        "official_url": "https://pmvishwakarma.gov.in",
        "helpline": "1800-267-7777",
        "tags": ["artisan", "toolkit", "craftsman", "skill", "low interest loan"]
    },
    {
        "id": "sukanya-samriddhi",
        "name": "Sukanya Samriddhi Yojana (SSY)",
        "hindi_name": "सुकन्या समृद्धि योजना",
        "ministry": "Ministry of Finance / Ministry of Women & Child Development",
        "category": "Women & Girl Child",
        "description": "High-interest (currently 8.2% p.a.) government-backed savings scheme for girl children with complete tax exemption (EEE) under Section 80C. Can be opened from birth until age 10.",
        "hindi_description": "बालिकाओं के उज्ज्वल भविष्य के लिए 8.2% की उच्चतम ब्याज दर वाली बचत योजना। पूर्ण रूप से कर-मुक्त (EEE) और 21 वर्ष में परिपक्व।",
        "financial_benefit": "8.2% Compounded Annual Return + 100% Tax Exemption",
        "frequency": "Deposit ₹250 to ₹1.5 Lakh per financial year",
        "target_audience": "Parents/legal guardians of girl children aged 0 to 10 years",
        "eligibility": {
            "gender": "female",
            "max_child_age": 10,
            "max_girls_per_family": 2
        },
        "required_documents": [
            "Birth Certificate of Girl Child (बालिका का जन्म प्रमाण पत्र)",
            "Parent / Guardian Aadhaar & PAN Card (अभिभावक का आधार व पैन)",
            "Address Proof (निवास प्रमाण पत्र)",
            "Passport Size Photograph (पासपोर्ट आकार फोटो)"
        ],
        "official_url": "https://www.indiapost.gov.in",
        "helpline": "1800-266-6868",
        "tags": ["girl child", "savings", "tax free", "education", "daughter"]
    },
    {
        "id": "pm-awas-gramin",
        "name": "PMAY-G (Pradhan Mantri Awas Yojana - Gramin)",
        "hindi_name": "प्रधानमंत्री आवास योजना - ग्रामीण",
        "ministry": "Ministry of Rural Development",
        "category": "Housing & Shelter",
        "description": "Financial assistance of ₹1,20,000 (plain areas) and ₹1,30,000 (hilly/difficult areas) for the construction of a pucca house with basic amenities including sanitation toilet, piped drinking water, and clean cooking fuel.",
        "hindi_description": "ग्रामीण बेघर व कच्चे मकानों में रहने वाले परिवारों को पक्का मकान बनाने के लिए ₹1,20,000 से ₹1,30,000 की सीधी सहायता राशि।",
        "financial_benefit": "₹1,20,000 - ₹1,30,000 Grant for Pucca House Construction",
        "frequency": "3 construction installments based on geo-tagged progress",
        "target_audience": "Rural families who are houseless or living in kutcha/dilapidated houses",
        "eligibility": {
            "rural_resident": True,
            "owns_pucca_house": False,
            "secc_deprivation_priority": True,
            "max_annual_income": 250000
        },
        "required_documents": [
            "Aadhaar Card of all adult members (आधार कार्ड)",
            "Bank Passbook linked with Aadhaar & MGNREGA Job Card (बैंक खाता)",
            "MGNREGA Job Card Number (मनरेगा जॉब कार्ड)",
            "Land / Plot documents or Gram Sabha Certificate (भूखंड प्रमाण पत्र)"
        ],
        "official_url": "https://pmayg.nic.in",
        "helpline": "1800-11-6446",
        "tags": ["housing", "pucca house", "rural", "grant", "awas"]
    },
    {
        "id": "atal-pension",
        "name": "Atal Pension Yojana (APY)",
        "hindi_name": "अटल पेंशन योजना",
        "ministry": "Pension Fund Regulatory and Development Authority (PFRDA)",
        "category": "Social Security & Pension",
        "description": "Government-guaranteed monthly pension of ₹1,000 to ₹5,000 for workers in the unorganized sector starting at age 60, with life-long pension to spouse and return of pension corpus to nominee.",
        "hindi_description": "असंगठित क्षेत्र के श्रमिकों के लिए 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की निश्चित आजीवन पेंशन। जीवनसाथी और नॉमिनी को पूर्ण सुरक्षा।",
        "financial_benefit": "Guaranteed Monthly Pension of ₹1,000 - ₹5,000 for Life",
        "frequency": "Monthly from age 60",
        "target_audience": "All Indian citizens between 18 and 40 years working in unorganized sectors",
        "eligibility": {
            "min_age": 18,
            "max_age": 40,
            "is_income_tax_payer": False,
            "requires_bank_account": True
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Savings Bank Account Passbook (बचत बैंक खाता)",
            "Mobile Number for auto-debit SMS alerts (मोबाइल नंबर)"
        ],
        "official_url": "https://www.npscra.nsdl.co.in",
        "helpline": "1800-110-069",
        "tags": ["pension", "retirement", "social security", "guaranteed income"]
    },
    {
        "id": "lakhpati-didi",
        "name": "Lakhpati Didi Scheme",
        "hindi_name": "लखपति दीदी योजना",
        "ministry": "Ministry of Rural Development",
        "category": "Women Empowerment & Livelihoods",
        "description": "Empowering women Self-Help Group (SHG) members through digital and vocational skills, financial literacy, interest-free microcredit, and market linkages so that every woman member earns at least ₹1,00,000 per year.",
        "hindi_description": "स्वयं सहायता समूह (SHG) की दीदियों को व्यावसायिक प्रशिक्षण, ड्रोन दीदी कौशल, और शून्य ब्याज ऋण देकर उनकी वार्षिक आय ₹1 लाख से अधिक करने का मिशन।",
        "financial_benefit": "Zero-interest credit up to ₹5,00,000 + Skill Training & Market Access",
        "frequency": "Microcredit and continuous enterprise support",
        "target_audience": "Rural women members of Deendayal Antyodaya Yojana-NRLM Self-Help Groups",
        "eligibility": {
            "gender": "female",
            "shg_member": True,
            "rural_resident": True,
            "min_age": 18
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "SHG Membership ID / Passbook (स्वयं सहायता समूह पासबुक)",
            "Bank Account linked to Aadhaar (आधार लिंक बैंक खाता)",
            "Ration Card (राशन कार्ड)"
        ],
        "official_url": "https://nrlm.gov.in",
        "helpline": "1800-180-1551",
        "tags": ["women", "shg", "enterprise", "microcredit", "rural women"]
    },
    {
        "id": "pm-mudra",
        "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "hindi_name": "प्रधानमंत्री मुद्रा योजना",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "category": "Micro Enterprise & Business Loans",
        "description": "Collateral-free institutional credit up to ₹20,00,000 for non-corporate, non-farm small and micro enterprises across three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5,00,000), and Tarun (up to ₹20,00,000).",
        "hindi_description": "छोटे व्यवसायों, दुकानों, निर्माण और सेवा कार्यों के लिए बिना किसी गारंटी के ₹20 लाख तक का सुलभ बैंक ऋण। शिशु, किशोर और तरुण श्रेणियां।",
        "financial_benefit": "Collateral-free loan from ₹50,000 up to ₹20,00,000",
        "frequency": "One-time term loan or working capital CC limit",
        "target_audience": "Shopkeepers, artisans, small manufacturing units, food processors, service sector entrepreneurs",
        "eligibility": {
            "occupations": ["shopkeeper", "trader", "manufacturer", "artisan", "service provider", "small business", "entrepreneur"],
            "business_nature": "non-corporate, non-farm",
            "min_age": 18
        },
        "required_documents": [
            "Identity Proof - Aadhaar / Voter ID (पहचान पत्र)",
            "Business Address Proof / Shop License / Udyam Aadhar (व्यापार का प्रमाण)",
            "Bank Account Statement for last 6 months (बैंक स्टेटमेंट)",
            "Quotation of machinery/items to be purchased (कोटेशन/प्रोजेक्ट रिपोर्ट)"
        ],
        "official_url": "https://www.mudra.org.in",
        "helpline": "1800-180-1111",
        "tags": ["business loan", "shop", "mudra", "collateral free", "startup"]
    },
    {
        "id": "pm-kmy",
        "name": "PM Kisan Maandhan Yojana (PM-KMY)",
        "hindi_name": "प्रधानमंत्री किसान मानधन योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "Farmers & Pension",
        "description": "Old age pension scheme for small and marginal farmers (owning up to 2 hectares) providing guaranteed monthly pension of ₹3,000 after attaining 60 years of age, with 50% matching contribution by Central Government.",
        "hindi_description": "छोटे व सीमांत किसानों (2 हेक्टेयर तक भूमि) के लिए 60 वर्ष की आयु के बाद ₹3,000 प्रति माह की सुनिश्चित पेंशन। केंद्र सरकार का बराबर का योगदान।",
        "financial_benefit": "₹3,000 Monthly Pension from age 60",
        "frequency": "Monthly",
        "target_audience": "Small and marginal farmers aged 18 to 40 years holding cultivable land up to 2 hectares",
        "eligibility": {
            "occupations": ["farmer", "agriculture", "kisan"],
            "max_landholding_acres": 4.94,  # 2 hectares = ~4.94 acres
            "min_age": 18,
            "max_age": 40
        },
        "required_documents": [
            "Aadhaar Card (आधार कार्ड)",
            "Savings Bank Account Passbook with IFSC (बैंक पासबुक)",
            "Khasra/Khatauni Land Records (खसरा-खतौनी की प्रति)"
        ],
        "official_url": "https://maandhan.in",
        "helpline": "1800-267-6888",
        "tags": ["farmer pension", "kisan", "old age", "social security"]
    }
]


def match_schemes(user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Evaluates applicant profile against scheme criteria and returns scored matches.
    """
    results = []
    
    occupation = (user_profile.get("occupation") or "").lower().strip()
    income = float(user_profile.get("annual_income") or 0)
    landholding = float(user_profile.get("landholding_acres") or 0)
    age = int(user_profile.get("age") or 30)
    gender = (user_profile.get("gender") or "all").lower()
    area = (user_profile.get("area") or "rural").lower() # rural / urban
    has_girl_child = bool(user_profile.get("has_girl_child") or False)
    girl_child_age = int(user_profile.get("girl_child_age") or 0)
    is_shg_member = bool(user_profile.get("is_shg_member") or False)

    for scheme in SCHEMES:
        match_score = 0
        reasons = []
        missing_criteria = []
        is_eligible = True
        
        sid = scheme["id"]
        
        # 1. PM-KISAN
        if sid == "pm-kisan":
            if any(k in occupation for k in ["farmer", "kisan", "krishi", "agriculture", "cultivator"]) or landholding > 0:
                match_score += 60
                reasons.append("Farmer or agricultural background identified")
                if landholding > 0:
                    match_score += 35
                    reasons.append(f"Owns cultivable agricultural land ({landholding} acres)")
                else:
                    match_score += 20
                    reasons.append("Landholder criteria requires valid land records (Khasra)")
            else:
                is_eligible = False
                missing_criteria.append("Applicant must be a landholding farmer family")
                
        # 2. AYUSHMAN BHARAT PM-JAY
        elif sid == "ayushman-bharat":
            if age >= 70:
                match_score = 98
                reasons.append("Universal eligibility for all senior citizens aged 70+ under PM-JAY expansion")
            elif income <= 300000 or any(k in occupation for k in ["laborer", "worker", "vendor", "farmer", "daily wage", "artisan", "maid", "driver"]):
                match_score += 55
                reasons.append("Household falls within priority low-income / vulnerable occupational segment")
                if income > 0 and income <= 180000:
                    match_score += 35
                    reasons.append("Annual income within PM-JAY priority threshold")
                else:
                    match_score += 25
            else:
                match_score += 30
                reasons.append("Subject to SECC-2011 or NFSA ration card listing")

        # 3. PM SVANIDHI
        elif sid == "pm-svanidhi":
            if any(k in occupation for k in ["vendor", "street vendor", "hawker", "thelawala", "rehris", "shop", "fruit", "vegetable", "chaat", "tea stall"]):
                match_score += 85
                reasons.append("Urban street vendor / micro-hawker occupation verified")
                if area == "urban" or area == "peri-urban":
                    match_score += 15
                    reasons.append("Urban/peri-urban location matches municipal vending zone requirements")
            else:
                is_eligible = False
                missing_criteria.append("Targeted specifically at urban and peri-urban street vendors")

        # 4. PM VISHWAKARMA
        elif sid == "pm-vishwakarma":
            artisan_trades = ["artisan", "carpenter", "blacksmith", "potter", "sculptor", "cobbler", "mason", "tailor", "darzi", "barber", "washerman", "goldsmith", "boat builder", "weaver", "craft"]
            if any(k in occupation for k in artisan_trades):
                match_score += 95
                reasons.append(f"Recognized traditional craft / trade occupation: {occupation}")
            elif any(k in occupation for k in ["worker", "self-employed", "labour"]):
                match_score += 50
                reasons.append("May be eligible if practicing one of the 18 designated traditional artisan trades")
            else:
                is_eligible = False
                missing_criteria.append("Requires practicing one of the 18 recognized traditional artisan trades")

        # 5. SUKANYA SAMRIDDHI YOJANA
        elif sid == "sukanya-samriddhi":
            if has_girl_child and girl_child_age <= 10:
                match_score = 98
                reasons.append(f"Has girl child aged {girl_child_age} years (eligible under age 10 cutoff)")
            elif has_girl_child and girl_child_age > 10:
                is_eligible = False
                missing_criteria.append(f"Girl child age ({girl_child_age} yrs) exceeds 10-year opening limit")
            else:
                match_score = 40
                reasons.append("Eligible if family has a daughter under 10 years of age")

        # 6. PMAY-G (HOUSING)
        elif sid == "pm-awas-gramin":
            if area == "rural" and (income <= 250000 or any(k in occupation for k in ["laborer", "farmer", "worker", "artisan"])):
                match_score += 75
                reasons.append("Rural resident meeting housing deprivation income criteria")
                if income < 120000:
                    match_score += 20
                    reasons.append("High priority economic category for pucca shelter assistance")
            else:
                match_score = 45
                reasons.append("Evaluated against Gram Sabha housing deprivation waitlist")

        # 7. ATAL PENSION YOJANA
        elif sid == "atal-pension":
            if 18 <= age <= 40:
                match_score += 70
                reasons.append(f"Age {age} falls inside the prime 18-40 entry window")
                if income <= 250000:
                    match_score += 25
                    reasons.append("Unorganized sector non-taxpayer profile ideal for guaranteed pension")
            else:
                is_eligible = False
                missing_criteria.append(f"Age must be between 18 and 40 years (Current age: {age})")

        # 8. LAKHPATI DIDI
        elif sid == "lakhpati-didi":
            if gender == "female":
                match_score += 50
                reasons.append("Female applicant eligible for women empowerment initiatives")
                if is_shg_member:
                    match_score += 45
                    reasons.append("Active Self-Help Group (SHG) membership verified")
                else:
                    match_score += 20
                    reasons.append("Eligible upon enrolling in a village Deendayal Antyodaya SHG")
            else:
                is_eligible = False
                missing_criteria.append("Exclusively for women members of rural Self-Help Groups")

        # 9. PM MUDRA YOJANA
        elif sid == "pm-mudra":
            if any(k in occupation for k in ["shop", "shopkeeper", "business", "trader", "vendor", "entrepreneur", "tailor", "artisan", "self-employed", "driver", "transport"]):
                match_score += 85
                reasons.append("Small business / micro-enterprise activity eligible for collateral-free credit")
            else:
                match_score = 55
                reasons.append("Applicable for starting or expanding any non-farm micro business")

        # 10. PM KISAN MAANDHAN YOJANA
        elif sid == "pm-kmy":
            if (any(k in occupation for k in ["farmer", "kisan", "agriculture"]) or landholding > 0) and 18 <= age <= 40 and landholding <= 5.0:
                match_score += 90
                reasons.append(f"Small/marginal farmer with land {landholding} acres and age {age} in eligible window")
            else:
                is_eligible = False
                missing_criteria.append("Requires small/marginal farmer status (<= 2 hectares) aged 18-40")

        if match_score > 0:
            results.append({
                "scheme": scheme,
                "match_score": min(100, match_score),
                "is_eligible": is_eligible and match_score >= 50,
                "reasons": reasons,
                "missing_criteria": missing_criteria
            })
            
    # Sort by match score descending
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results
