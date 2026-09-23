import bcrypt from 'bcryptjs';

export const getHashedPassword = async (pwd: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
};

export const sampleCategories = [
  {
    _id: 'cat-1',
    name: 'Tempered Glass',
    description: 'High-clarity 9H hardness tempered glass with oleophobic anti-fingerprint coating.'
  },
  {
    _id: 'cat-2',
    name: 'Privacy Screen Protector',
    description: '28-degree anti-spy micro-louver technology keeps your screen hidden from side angles.'
  },
  {
    _id: 'cat-3',
    name: 'Matte Gaming Glass',
    description: 'Ultra-smooth anti-glare micro-frosted finish designed for esports and gaming precision.'
  },
  {
    _id: 'cat-4',
    name: 'UV Curved Tempered Glass',
    description: 'Optically clear liquid adhesive and UV-cured glass for 3D curved edge flagship displays.'
  },
  {
    _id: 'cat-5',
    name: 'Camera Lens Armor',
    description: 'Individual sapphire-coated aluminum alloy rings protecting your camera lenses against direct impacts.'
  }
];

export const sampleProducts = [
  {
    _id: 'prod-1',
    name: 'REROK Shield Pro 9H Tempered Glass',
    description: 'Ultra-clear 0.33mm Japanese Asahi tempered glass with 9H surface hardness, electroplated oleophobic coating, and edge-to-edge laser precision fit. Includes auto-align installation tray for zero-bubble installation.',
    price: 399,
    originalPrice: 799,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Apple',
    compatibleModels: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 45,
    rating: 4.9,
    reviews: 184,
    featured: true,
    features: [
      '9H surface hardness against deep scratches',
      'Japanese Asahi Glass with 99.9% optical transparency',
      'Electroplated oleophobic anti-fingerprint coating',
      'Auto-align applicator frame included for bubble-free fit',
      'Case-friendly 2.5D micro-curved edges'
    ]
  },
  {
    _id: 'prod-2',
    name: 'REROK UltraGuard 9H Heavy Duty Shield',
    description: 'Military-grade dual-tempered glass engineered to absorb high-impact drops. Features reinforced shatterproof edges and responsive touch sensitivity.',
    price: 349,
    originalPrice: 699,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Samsung',
    compatibleModels: ['Galaxy S24', 'Galaxy S24 Ultra', 'Galaxy S23', 'Galaxy A55'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 38,
    rating: 4.8,
    reviews: 142,
    featured: true,
    features: [
      'Reinforced perimeter shock absorption buffer',
      'Sonic fingerprint unlock compatible',
      '9H diamond-grade scratch resistance',
      'Case-friendly precision bevel'
    ]
  },
  {
    _id: 'prod-3',
    name: 'REROK EdgeSafe Screen Protector',
    description: 'Full-coverage edge-to-edge tempered glass specially tuned for high refresh rate AMOLED displays. Delivers native touch latency and seamless curved aesthetics.',
    price: 299,
    originalPrice: 599,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'OnePlus',
    compatibleModels: ['OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'Nord 3'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 24,
    rating: 4.7,
    reviews: 98,
    featured: true,
    features: [
      'Edge-to-edge black border seamless integration',
      'Optimized for 120Hz touch polling rate',
      'Hydrophobic oil-repellent coating',
      'Shatter-proof safety matrix'
    ]
  },
  {
    _id: 'prod-4',
    name: 'REROK CrystalShield Pure Clarity',
    description: 'Crystal-clear tempered glass delivering lifelike color reproduction with zero graininess. Perfect everyday impact protection.',
    price: 249,
    originalPrice: 499,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Xiaomi',
    compatibleModels: ['Redmi Note 13 Pro', 'Redmi Note 13', 'Xiaomi 14'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 50,
    rating: 4.6,
    reviews: 76,
    featured: false,
    features: [
      'Zero-distortion high-definition clarity',
      'Easy self-adhering electrostatic layer',
      'Scratch & scuff defense for active daily use'
    ]
  },
  {
    _id: 'prod-5',
    name: 'REROK StealthPrivacy 28° Anti-Spy Glass',
    description: 'Confidentiality anywhere. Features high-density optical micro-louvers that block screen visibility at angles greater than 28 degrees. Direct viewers experience crystal clarity while onlookers see a pitch-black screen.',
    price: 499,
    originalPrice: 999,
    discount: 50,
    category: 'Privacy Screen Protector',
    brand: 'Apple',
    compatibleModels: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14', 'iPhone 13'],
    image: '/src/assets/images/product_privacy_glass_1790140285952.jpg',
    stock: 29,
    rating: 4.9,
    reviews: 210,
    featured: true,
    features: [
      'True 28-degree two-way privacy filter',
      'Anti-spy protection on metro, flights & cafes',
      'Full FaceID & Dynamic Island cutout accuracy',
      'Maintains sharp straight-on display brightness'
    ]
  },
  {
    _id: 'prod-6',
    name: 'REROK PrivacyGuard Ultra',
    description: 'Premium privacy protector designed for Samsung Galaxy devices with ultrasonic fingerprint compatibility and private view protection.',
    price: 449,
    originalPrice: 899,
    discount: 50,
    category: 'Privacy Screen Protector',
    brand: 'Samsung',
    compatibleModels: ['Galaxy S24', 'Galaxy S24 Ultra', 'Galaxy S23'],
    image: '/src/assets/images/product_privacy_glass_1790140285952.jpg',
    stock: 22,
    rating: 4.7,
    reviews: 119,
    featured: false,
    features: [
      'Micro-louver dark privacy shielding',
      'Fingerprint scanner optimization layer',
      'Anti-reflective matte surface'
    ]
  },
  {
    _id: 'prod-7',
    name: 'REROK ApexLens Sapphire Camera Armor',
    description: 'Individual aerospace-grade aluminum alloy bezel rings fitted with scratch-proof 9H optical sapphire glass. Protects protruded multi-lens assemblies against drops, keys, and pavement grit without affecting flash or night mode.',
    price: 299,
    originalPrice: 599,
    discount: 50,
    category: 'Camera Lens Armor',
    brand: 'Apple',
    compatibleModels: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14'],
    image: '/src/assets/images/product_camera_armor_1790140302763.jpg',
    stock: 60,
    rating: 4.8,
    reviews: 167,
    featured: true,
    features: [
      'Precision CNC aluminum frame matching phone finish',
      'AR anti-reflective coated sapphire glass',
      'Night-circle anti-glare gasket prevents flash bloom',
      'Zero loss in 4K video and RAW photo sharpness'
    ]
  },
  {
    _id: 'prod-8',
    name: 'REROK LensShield Matrix',
    description: 'High-impact camera defense for Samsung camera bumps. Precision engineered with anti-fingerprint coating.',
    price: 279,
    originalPrice: 549,
    discount: 49,
    category: 'Camera Lens Armor',
    brand: 'Samsung',
    compatibleModels: ['Galaxy S24', 'Galaxy S24 Ultra', 'Galaxy S23'],
    image: '/src/assets/images/product_camera_armor_1790140302763.jpg',
    stock: 40,
    rating: 4.8,
    reviews: 89,
    featured: false,
    features: [
      'Individual ring protectors for clean look',
      'Anti-fog moisture resistant vacuum seal',
      'Full protection against pocket scratches'
    ]
  },
  {
    _id: 'prod-9',
    name: 'REROK FragMatte Gaming Shield',
    description: 'Etched silky-smooth matte surface engineered specifically for mobile gamers. Eliminates sweaty finger friction, screen smudges, and harsh glare during outdoor and competitive play.',
    price: 379,
    originalPrice: 749,
    discount: 49,
    category: 'Matte Gaming Glass',
    brand: 'OnePlus',
    compatibleModels: ['OnePlus 12', 'OnePlus 12R', 'OnePlus 11'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 18,
    rating: 4.8,
    reviews: 130,
    featured: false,
    features: [
      'Micro-frosted anti-glare finish',
      'Zero drag coefficient for flick shots & swiping',
      'Anti-sweat and anti-oil formulation',
      'Full touch sampling sensitivity preserved'
    ]
  },
  {
    _id: 'prod-10',
    name: 'REROK LiquidUV 3D Curved Glass',
    description: 'Optically clear liquid adhesive with UV curing station for 3D curved smartphone displays. Eliminates edge lift, rainbow effects, and air gaps completely.',
    price: 549,
    originalPrice: 1099,
    discount: 50,
    category: 'UV Curved Tempered Glass',
    brand: 'Google',
    compatibleModels: ['Pixel 8', 'Pixel 8 Pro', 'Pixel 7a'],
    image: '/src/assets/images/hero_phone_shield_1790140255700.jpg',
    stock: 15,
    rating: 4.9,
    reviews: 94,
    featured: true,
    features: [
      'Liquid optical clear adhesive (LOCA) technology',
      'Fills microscopic screen scratches beneath adhesive',
      'Perfect 3D curved curvature hugging',
      'Mini USB UV lamp included in retail pack'
    ]
  },
  {
    _id: 'prod-11',
    name: 'REROK ArmorGlass Impact Plus',
    description: 'Dual-strengthened ion-exchange tempered glass built for rugged protection without added bulk.',
    price: 399,
    originalPrice: 799,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Apple',
    compatibleModels: ['iPhone 14', 'iPhone 13', 'iPhone 15'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 35,
    rating: 4.7,
    reviews: 112,
    featured: false,
    features: [
      'Ion-exchange toughened glass structure',
      'Reinforced bezel against corner cracks',
      'Includes easy applicator tray'
    ]
  },
  {
    _id: 'prod-12',
    name: 'REROK ClearView Flex 9H',
    description: 'High-clarity everyday tempered glass protector with reinforced edges, smooth glide feel, and full compatibility with thick cases.',
    price: 299,
    originalPrice: 599,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Samsung',
    compatibleModels: ['Galaxy A55', 'Galaxy S24', 'Galaxy S23'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 48,
    rating: 4.6,
    reviews: 65,
    featured: false,
    features: [
      'Optically pure tempered silica glass',
      'Clean cutouts for selfie camera and speaker grill',
      'Fast self-expelling bubble absorption'
    ]
  },
  {
    _id: 'prod-13',
    name: 'REROK CyberMatte Anti-Reflective Shield',
    description: 'Anti-glare frosted glass protector crafted for iPhone users who work outdoors or play heavy games in bright sunlight.',
    price: 389,
    originalPrice: 799,
    discount: 51,
    category: 'Matte Gaming Glass',
    brand: 'Apple',
    compatibleModels: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14'],
    image: '/src/assets/images/product_privacy_glass_1790140285952.jpg',
    stock: 31,
    rating: 4.8,
    reviews: 147,
    featured: false,
    features: [
      'Chemical-etched matte finish reduces 95% reflections',
      'Silky smooth finger glide for continuous gaming',
      'Oleophobic nano-coating repels grease'
    ]
  },
  {
    _id: 'prod-14',
    name: 'REROK RealShield Max Tough',
    description: 'Heavy duty front protection designed for Realme devices with full display boundary coverage and high impact resistance.',
    price: 269,
    originalPrice: 549,
    discount: 51,
    category: 'Tempered Glass',
    brand: 'Realme',
    compatibleModels: ['Realme 12 Pro', 'GT 6'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 27,
    rating: 4.5,
    reviews: 58,
    featured: false,
    features: [
      '9H surface scratch defense',
      'Case-friendly 0.5mm edge clearance',
      'High responsiveness for touch gestures'
    ]
  },
  {
    _id: 'prod-15',
    name: 'REROK MotoGuard Edge 9H',
    description: 'Precision curved edge screen protector tailored for Motorola Edge and G series devices.',
    price: 289,
    originalPrice: 599,
    discount: 52,
    category: 'Tempered Glass',
    brand: 'Motorola',
    compatibleModels: ['Edge 50 Pro', 'G84'],
    image: '/src/assets/images/hero_phone_shield_1790140255700.jpg',
    stock: 19,
    rating: 4.6,
    reviews: 44,
    featured: false,
    features: [
      'Full curved glass edge contour',
      'Clear adhesive layer for zero display hue shift',
      'Easy dry application'
    ]
  },
  {
    _id: 'prod-16',
    name: 'REROK VivoShield Diamond Armor',
    description: 'Curved and flat glass shield with diamond hardness coating, engineered for Vivo camera-centric smartphones.',
    price: 299,
    originalPrice: 599,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Vivo',
    compatibleModels: ['V30 Pro', 'X100'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 25,
    rating: 4.7,
    reviews: 52,
    featured: false,
    features: [
      'Optically enhanced for vibrant colors',
      'Full adhesive edge-to-edge attachment',
      'Fingerprint resistant top coat'
    ]
  },
  {
    _id: 'prod-17',
    name: 'REROK PixelShield 9H Pure',
    description: 'Tailored for Google Pixel devices with flawless ultrasonic under-display fingerprint unlock compatibility.',
    price: 349,
    originalPrice: 699,
    discount: 50,
    category: 'Tempered Glass',
    brand: 'Google',
    compatibleModels: ['Pixel 8', 'Pixel 8 Pro', 'Pixel 7a'],
    image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
    stock: 33,
    rating: 4.8,
    reviews: 91,
    featured: false,
    features: [
      'Engineered specifically for Google Pixel sensors',
      'Zero tactile resistance on screen edge swipes',
      'High-grade anti-scratch hardness'
    ]
  },
  {
    _id: 'prod-18',
    name: 'REROK LensArmor Pro Pixel Edition',
    description: 'Sapphire glass visor protector shielding the distinctive Pixel camera bar against scratches and table drops.',
    price: 249,
    originalPrice: 499,
    discount: 50,
    category: 'Camera Lens Armor',
    brand: 'Google',
    compatibleModels: ['Pixel 8', 'Pixel 8 Pro'],
    image: '/src/assets/images/product_camera_armor_1790140302763.jpg',
    stock: 42,
    rating: 4.8,
    reviews: 73,
    featured: false,
    features: [
      'Full camera bar precision cutout',
      'Ultra-thin 0.2mm profile',
      'AR anti-reflective clear transmission'
    ]
  }
];

export const sampleUsers = [
  {
    _id: 'user-admin-1',
    name: 'REROK Admin',
    email: 'admin@rerok.com',
    passwordRaw: 'Admin@123',
    phone: '+91 98765 43210',
    role: 'admin',
    createdAt: new Date('2026-01-10T10:00:00Z')
  },
  {
    _id: 'user-customer-1',
    name: 'Rahul Sharma',
    email: 'user@rerok.com',
    passwordRaw: 'User@123',
    phone: '+91 91234 56789',
    role: 'customer',
    createdAt: new Date('2026-02-15T14:30:00Z')
  },
  {
    _id: 'user-customer-2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    passwordRaw: 'User@123',
    phone: '+91 99887 76655',
    role: 'customer',
    createdAt: new Date('2026-03-01T09:15:00Z')
  }
];

export const sampleOrders = [
  {
    _id: 'ord-1',
    orderId: 'REROK-2026-00125',
    user: 'user-customer-1',
    items: [
      {
        product: 'prod-1',
        name: 'REROK Shield Pro 9H Tempered Glass',
        price: 399,
        image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
        quantity: 2,
        selectedModel: 'iPhone 15'
      },
      {
        product: 'prod-7',
        name: 'REROK ApexLens Sapphire Camera Armor',
        price: 299,
        image: '/src/assets/images/product_camera_armor_1790140302763.jpg',
        quantity: 1,
        selectedModel: 'iPhone 15'
      }
    ],
    shippingAddress: {
      fullName: 'Rahul Sharma',
      email: 'user@rerok.com',
      phone: '+91 91234 56789',
      address: 'Flat 402, Green Glen Apartments, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    paymentMethod: 'Online',
    paymentStatus: 'Completed',
    orderStatus: 'Shipped',
    totalAmount: 1097,
    createdAt: new Date('2026-09-18T11:20:00Z')
  },
  {
    _id: 'ord-2',
    orderId: 'REROK-2026-00124',
    user: 'user-customer-1',
    items: [
      {
        product: 'prod-5',
        name: 'REROK StealthPrivacy 28° Anti-Spy Glass',
        price: 499,
        image: '/src/assets/images/product_privacy_glass_1790140285952.jpg',
        quantity: 1,
        selectedModel: 'iPhone 15 Pro'
      }
    ],
    shippingAddress: {
      fullName: 'Rahul Sharma',
      email: 'user@rerok.com',
      phone: '+91 91234 56789',
      address: 'Flat 402, Green Glen Apartments, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Delivered',
    totalAmount: 499,
    createdAt: new Date('2026-09-02T16:45:00Z')
  },
  {
    _id: 'ord-3',
    orderId: 'REROK-2026-00123',
    user: 'user-customer-2',
    items: [
      {
        product: 'prod-2',
        name: 'REROK UltraGuard 9H Heavy Duty Shield',
        price: 349,
        image: '/src/assets/images/product_shield_pro_1790140269001.jpg',
        quantity: 1,
        selectedModel: 'Galaxy S24'
      }
    ],
    shippingAddress: {
      fullName: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 99887 76655',
      address: '74 Sunrise Villa, SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054'
    },
    paymentMethod: 'Online',
    paymentStatus: 'Completed',
    orderStatus: 'Processing',
    totalAmount: 349,
    createdAt: new Date('2026-09-21T08:10:00Z')
  }
];

export const phoneBrandsAndModels: Record<string, string[]> = {
  Apple: ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 14', 'iPhone 13'],
  Samsung: ['Galaxy S24', 'Galaxy S24 Ultra', 'Galaxy S23', 'Galaxy A55'],
  OnePlus: ['OnePlus 12', 'OnePlus 12R', 'OnePlus 11', 'Nord 3'],
  Xiaomi: ['Redmi Note 13 Pro', 'Redmi Note 13', 'Xiaomi 14'],
  Realme: ['Realme 12 Pro', 'GT 6'],
  Google: ['Pixel 8', 'Pixel 8 Pro', 'Pixel 7a'],
  Motorola: ['Edge 50 Pro', 'G84'],
  Vivo: ['V30 Pro', 'X100']
};
