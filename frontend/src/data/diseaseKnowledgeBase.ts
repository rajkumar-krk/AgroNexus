// Local disease knowledge base for symptom-based diagnosis
// Covers common crop diseases for Rice, Wheat, Maize, Cotton, Tomato

export interface Disease {
    id: string
    name: string
    cropTypes: string[]
    symptoms: string[]
    description: string
    treatments: {
        primary: string
        organic: string
    }
    severity: 'low' | 'medium' | 'high'
    imageUrl: string
}

export const CROP_TYPES = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato'] as const

export const SYMPTOM_OPTIONS = [
    'Yellow leaves',
    'Brown spots',
    'Wilting',
    'White powder',
    'Stunted growth',
    'Root rot',
    'Leaf curl',
    'Blight',
    'Black lesions',
    'Mosaic pattern',
    'Stem rot',
    'Fruit rot',
] as const

export const diseases: Disease[] = [
    {
        id: 'd1',
        name: 'Rice Blast',
        cropTypes: ['Rice'],
        symptoms: ['Brown spots', 'Blight', 'Black lesions', 'Stunted growth'],
        description:
            'Caused by Magnaporthe oryzae fungus. Appears as diamond-shaped lesions on leaves. Can spread rapidly in humid conditions and destroy entire fields if untreated.',
        treatments: {
            primary: 'Apply Tricyclazole (0.6g/L) or Isoprothiolane spray at first signs. Ensure good field drainage.',
            organic: 'Use Pseudomonas fluorescens seed treatment. Maintain silicon-rich soil amendments.',
        },
        severity: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80',
    },
    {
        id: 'd2',
        name: 'Wheat Rust (Puccinia)',
        cropTypes: ['Wheat'],
        symptoms: ['Brown spots', 'Yellow leaves', 'Stunted growth'],
        description:
            'Fungal disease causing orange-brown pustules on leaves and stems. Stripe rust, stem rust, and leaf rust are the three main types affecting wheat yields.',
        treatments: {
            primary: 'Spray Propiconazole (0.1%) or Tebuconazole at early infection stage. Use resistant varieties.',
            organic: 'Apply neem-based biopesticide. Practice crop rotation with non-cereal crops.',
        },
        severity: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80',
    },
    {
        id: 'd3',
        name: 'Leaf Blight',
        cropTypes: ['Rice', 'Wheat', 'Maize'],
        symptoms: ['Blight', 'Brown spots', 'Yellow leaves', 'Wilting'],
        description:
            'Bacterial or fungal blight causing water-soaked lesions that turn brown. Spreads in warm, humid weather. Can reduce yield by 20-40%.',
        treatments: {
            primary: 'Spray Mancozeb (200g/100L) uniformly. Remove infected leaves. Avoid overhead irrigation.',
            organic: 'Neem oil spray (5ml/L) with soap solution. Improve air circulation between plants.',
        },
        severity: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80',
    },
    {
        id: 'd4',
        name: 'Powdery Mildew',
        cropTypes: ['Wheat', 'Cotton', 'Tomato'],
        symptoms: ['White powder', 'Yellow leaves', 'Stunted growth', 'Leaf curl'],
        description:
            'White fungal coating on leaf surfaces. Reduces photosynthesis and weakens plant. Common in dry, warm daytime and cool nighttime conditions.',
        treatments: {
            primary: 'Apply Sulfur dust or Karathane (0.05%). Ensure proper spacing for airflow.',
            organic: 'Baking soda spray (1 tbsp/gallon water). Milk spray (40% milk solution) weekly.',
        },
        severity: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80',
    },
    {
        id: 'd5',
        name: 'Cotton Bollworm',
        cropTypes: ['Cotton'],
        symptoms: ['Fruit rot', 'Stunted growth', 'Wilting'],
        description:
            'Helicoverpa armigera larvae bore into cotton bolls, causing fruit rot and boll shedding. Major pest in Indian cotton farming.',
        treatments: {
            primary: 'Spray Emamectin benzoate (0.2g/L) or Chlorantraniliprole. Use pheromone traps for monitoring.',
            organic: 'Release Trichogramma egg parasitoids. Use HaNPV bio-insecticide. Intercrop with marigold.',
        },
        severity: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80',
    },
    {
        id: 'd6',
        name: 'Tomato Early Blight',
        cropTypes: ['Tomato'],
        symptoms: ['Brown spots', 'Yellow leaves', 'Blight', 'Black lesions'],
        description:
            'Alternaria solani causes concentric ring lesions on lower leaves first, then spreads upward. Common in warm, moist conditions.',
        treatments: {
            primary: 'Apply Chlorothalonil or Mancozeb at 7-day intervals. Remove lower infected leaves.',
            organic: 'Copper-based fungicide (Bordeaux mixture). Mulch around plants to prevent splash.',
        },
        severity: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&q=80',
    },
    {
        id: 'd7',
        name: 'Tomato Leaf Curl Virus',
        cropTypes: ['Tomato'],
        symptoms: ['Leaf curl', 'Yellow leaves', 'Stunted growth'],
        description:
            'Transmitted by whiteflies (Bemisia tabaci). Causes severe upward curling, yellowing, and stunting. No cure — prevention is key.',
        treatments: {
            primary: 'Control whitefly vectors with Imidacloprid (0.5ml/L). Use virus-resistant varieties (Arka Rakshak).',
            organic: 'Yellow sticky traps for whiteflies. Neem oil sprays. Remove and destroy infected plants.',
        },
        severity: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&q=80',
    },
    {
        id: 'd8',
        name: 'Maize Stem Borer',
        cropTypes: ['Maize'],
        symptoms: ['Stem rot', 'Wilting', 'Stunted growth'],
        description:
            'Chilo partellus larvae bore into stems causing dead hearts in young plants and stem breakage in older plants. Major maize pest in India.',
        treatments: {
            primary: 'Apply Carbofuran granules in leaf whorls. Spray Fipronil (0.1%) at early infestation.',
            organic: 'Release Cotesia flavipes parasitoid. Push-pull strategy with Napier grass and Desmodium.',
        },
        severity: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1600271772470-bd5a2b3e08ff?auto=format&fit=crop&q=80',
    },
    {
        id: 'd9',
        name: 'Root Rot (Pythium/Fusarium)',
        cropTypes: ['Rice', 'Wheat', 'Cotton', 'Tomato'],
        symptoms: ['Root rot', 'Wilting', 'Yellow leaves', 'Stunted growth'],
        description:
            'Soil-borne fungi causing root decay. Plants wilt despite adequate water. Common in waterlogged, poorly drained soils.',
        treatments: {
            primary: 'Apply Metalaxyl or Carbendazim to soil. Improve drainage. Avoid overwatering.',
            organic: 'Trichoderma viride soil application. Add well-decomposed farmyard manure. Solarize soil before planting.',
        },
        severity: 'medium',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80',
    },
    {
        id: 'd10',
        name: 'Mosaic Virus',
        cropTypes: ['Maize', 'Tomato', 'Cotton'],
        symptoms: ['Mosaic pattern', 'Yellow leaves', 'Stunted growth', 'Leaf curl'],
        description:
            'Viral disease causing mottled yellow-green patterns on leaves. Transmitted by aphids and whiteflies. Reduces fruit quality and yield.',
        treatments: {
            primary: 'No chemical cure. Control insect vectors with Thiamethoxam. Remove infected plants immediately.',
            organic: 'Reflective mulches to repel aphids. Barrier crops. Roguing infected plants.',
        },
        severity: 'high',
        imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80',
    },
]

export interface DiagnosisResult extends Disease {
    confidence: number
    matchedSymptoms: string[]
}

export function diagnoseBySymptoms(cropType: string, symptoms: string[]): DiagnosisResult[] {
    // Filter diseases that affect this crop type
    const candidates = diseases.filter((d) => d.cropTypes.includes(cropType))

    // Score each disease by symptom overlap
    const scored = candidates.map((disease) => {
        const matched = disease.symptoms.filter((s) =>
            symptoms.some((input) => input.toLowerCase().includes(s.toLowerCase()))
        )
        const confidence = disease.symptoms.length > 0 ? matched.length / disease.symptoms.length : 0
        return { ...disease, confidence, matchedSymptoms: matched }
    })

    // Return top matches above 20% threshold, ranked by confidence
    return scored
        .filter((d) => d.confidence > 0.2)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)
}
