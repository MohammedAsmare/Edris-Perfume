import {
  Product,
  Category,
  Brand,
  Order,
  PaymentMethod,
  BankAccount,
  PaymentTransaction,
  AdvertisingCampaign,
  CustomerLoyalty,
  SupportTicket,
  MerchantProfile,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  DeliveryPartner,
  DeliveryAssignment,
  OrderStatusHistory,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Initial Seed Data for Instant Realistic Full-Stack Operation
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Edris Royale Extrait',
    slug: 'edris-royale-extrait',
    shortDescription: 'Majestic blend of rare Tigray frankincense, saffron, bourbon vanilla, and golden amber.',
    fullDescription: 'Edris Royale Extrait is our crown jewel fragrance. Sourced from the ancient mountain resin groves of Ethiopia and combined with refined French perfumery, this extrait delivers exceptional longevity exceeding 24 hours with a regal sillage.',
    fragranceFamily: 'Oriental',
    volumeMl: 100,
    concentration: 'Extrait de Parfum',
    topNotes: 'Saffron, Bergamot, Pink Pepper',
    heartNotes: 'Ethiopian Frankincense, Jasmine, Damask Rose',
    baseNotes: 'Bourbon Vanilla, Agarwood, Ambergris, Sandalwood',
    price: 14500,
    compareAtPrice: 16800,
    sku: 'EDR-ROY-100',
    stockQuantity: 45,
    lowStockThreshold: 5,
    isFeatured: true,
    isActive: true,
    ratingAvg: 5.0,
    reviewCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    brandName: 'Edris Signature',
    categoryName: 'Extrait de Parfum',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
  {
    id: 2,
    name: 'Addis Nights Oud',
    slug: 'addis-nights-oud',
    shortDescription: 'Deep smoky oud infused with spiced cardamom, dark roasted coffee blossom, and tobacco leaf.',
    fullDescription: 'Inspired by the vibrant, cool starlit evenings of Addis Ababa. Rich woody tones meet the warmth of traditional spiced coffee ceremonies, wrapped in velvet suede.',
    fragranceFamily: 'Woody & Smoky',
    volumeMl: 100,
    concentration: 'Eau de Parfum',
    topNotes: 'Cardamom, Cinnamon, Bitter Orange',
    heartNotes: 'Coffee Blossom, Birch Tar, Nutmeg',
    baseNotes: 'Cambodian Oud, Cedarwood, Leather, Benzoin',
    price: 12800,
    compareAtPrice: 14000,
    sku: 'EDR-ADD-100',
    stockQuantity: 30,
    lowStockThreshold: 5,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    brandName: 'Edris Signature',
    categoryName: 'Oriental & Oud',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
  {
    id: 3,
    name: 'Lalibela Golden Rose',
    slug: 'lalibela-golden-rose',
    shortDescription: 'A divine celestial bouquet of honeyed roses, white myrrh, and warm cashmeran.',
    fullDescription: 'A spiritual tribute to the rock-hewn majesty of Lalibela. Sun-drenched roses kissed by sweet dew and consecrated myrrh create an ethereal, angelic presence.',
    fragranceFamily: 'Floral & Romantic',
    volumeMl: 100,
    concentration: 'Eau de Parfum',
    topNotes: 'Lychee, Mandarin, Morning Dew',
    heartNotes: 'Taif Rose, Red Bulgarian Rose, Peony',
    baseNotes: 'White Myrrh, Cashmere Wood, White Musk',
    price: 11200,
    compareAtPrice: undefined,
    sku: 'EDR-LAL-100',
    stockQuantity: 25,
    lowStockThreshold: 4,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.8,
    reviewCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
    brandName: 'Edris Signature',
    categoryName: 'Floral & Romantic',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
  {
    id: 4,
    name: 'Amouage Interlude Black Iris',
    slug: 'amouage-interlude-black-iris',
    shortDescription: 'A complex palette of bergamot, rosemary, violet leaves with iris, amber, and frankincense.',
    fullDescription: 'Interlude Black Iris evokes an air of disorder while maintaining a sense of balance and tranquility through the inventive use of orris, frankincense, and myrrh.',
    fragranceFamily: 'Oriental',
    volumeMl: 100,
    concentration: 'Eau de Parfum',
    topNotes: 'Bergamot, Rosemary, Violet Leaves',
    heartNotes: 'Orris, Amber, Frankincense, Cistus',
    baseNotes: 'Leather, Agarwood Smoke, Patchouli, Sandalwood',
    price: 24500,
    compareAtPrice: 27000,
    sku: 'AMU-INT-100',
    stockQuantity: 12,
    lowStockThreshold: 3,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.95,
    reviewCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    brandName: 'Amouage',
    categoryName: 'Eau de Parfum',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
  {
    id: 5,
    name: 'Xerjoff Naxos 1861',
    slug: 'xerjoff-naxos-1861',
    shortDescription: 'Sun-drenched Mediterranean citrus with sweet honey, lavender, and sensual tobacco.',
    fullDescription: 'Celebrates the deep and sensual heart of Sicily with a joyful Mediterranean character. Honeyed warmth harmonizes with aristocratic tobacco notes.',
    fragranceFamily: 'Gourmand Oriental',
    volumeMl: 100,
    concentration: 'Eau de Parfum',
    topNotes: 'Bergamot, Lemon, Lavender',
    heartNotes: 'Honey, Cinnamon, Cashmeran, Jasmine Sambac',
    baseNotes: 'Tobacco Leaf, Tonka Bean, Vanilla',
    price: 21800,
    compareAtPrice: 23500,
    sku: 'XRJ-NAX-100',
    stockQuantity: 18,
    lowStockThreshold: 4,
    isFeatured: true,
    isActive: true,
    ratingAvg: 5.0,
    reviewCount: 51,
    imageUrl: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800',
    brandName: 'Xerjoff',
    categoryName: 'Extrait de Parfum',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
  {
    id: 6,
    name: 'Baccarat Rouge 540 Extrait',
    slug: 'baccarat-rouge-540-extrait',
    shortDescription: 'Luminous grandiflorum jasmine, saffron, bitter almond, and ambergris cedar accord.',
    fullDescription: 'The pinnacle of French perfumery by Francis Kurkdjian. Highly condensed intensity that radiates like crystal spun into gold under candlelight.',
    fragranceFamily: 'Amber Floral',
    volumeMl: 70,
    concentration: 'Extrait de Parfum',
    topNotes: 'Bitter Almond, Saffron',
    heartNotes: 'Egyptian Jasmine Grandiflorum, Cedar',
    baseNotes: 'Ambergris, Woody Musk',
    price: 28500,
    compareAtPrice: undefined,
    sku: 'MFK-BR540-70',
    stockQuantity: 8,
    lowStockThreshold: 2,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.98,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&q=80&w=800',
    brandName: 'Maison Francis Kurkdjian',
    categoryName: 'Extrait de Parfum',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
  },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Extrait de Parfum', slug: 'extrait-de-parfum', description: 'Pure luxury oil concentration with majestic 24hr longevity' },
  { id: 2, name: 'Eau de Parfum', slug: 'eau-de-parfum', description: 'Sophisticated daily sillage and balanced radiance' },
  { id: 3, name: 'Oriental & Oud', slug: 'oriental-oud', description: 'Rare frankincense, amber, and authentic woods' },
  { id: 4, name: 'Floral & Romantic', slug: 'floral-romantic', description: 'Velvety Damascena rose and royal jasmine' },
  { id: 5, name: 'Woody & Smoky', slug: 'woody-smoky', description: 'Smoky vetiver, cedar, and sacred Ethiopian resins' },
];

const INITIAL_BRANDS: Brand[] = [
  { id: 1, name: 'Edris Signature', slug: 'edris-signature', isFeatured: true },
  { id: 2, name: 'Amouage', slug: 'amouage', isFeatured: true },
  { id: 3, name: 'Xerjoff', slug: 'xerjoff', isFeatured: true },
  { id: 4, name: 'Maison Francis Kurkdjian', slug: 'maison-francis-kurkdjian', isFeatured: true },
];

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    code: 'TELEBIRR',
    name: 'Telebirr SuperApp',
    description: 'Instant automated mobile payment via Ethio Telecom Telebirr. Instant order confirmation.',
    providerType: 'TELEBIRR',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    code: 'CBE_BIRR',
    name: 'CBE Birr',
    description: 'Direct payment using your Commercial Bank of Ethiopia CBE Birr mobile wallet.',
    providerType: 'TELEBIRR',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    code: 'BANK_TRANSFER_CBE',
    name: 'Commercial Bank of Ethiopia (CBE)',
    description: 'Direct transfer to our official CBE corporate account via CBE Mobile or branch deposit.',
    providerType: 'BANK_TRANSFER',
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    code: 'BANK_TRANSFER_AWASH',
    name: 'Awash Bank / Awash Birr',
    description: 'Transfer via Awash Online Banking or Awash Birr mobile app.',
    providerType: 'BANK_TRANSFER',
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 5,
    code: 'BANK_TRANSFER_DASHEN',
    name: 'Dashen Bank / Amole',
    description: 'Transfer via Amole Mobile or Dashen Bank account.',
    providerType: 'BANK_TRANSFER',
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 6,
    code: 'BANK_TRANSFER_BOA',
    name: 'Bank of Abyssinia / Apollo',
    description: 'Transfer via Apollo mobile banking or Bank of Abyssinia branch deposit.',
    providerType: 'BANK_TRANSFER',
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 7,
    code: 'CASH_ON_DELIVERY',
    name: 'Cash on Delivery (Addis Ababa)',
    description: 'Pay cash or local mobile transfer upon doorstep delivery by our white-glove courier.',
    providerType: 'CASH',
    isActive: true,
    displayOrder: 7,
  },
];

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 1,
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000284910291',
    accountHolderName: 'EDRIS PERFUME TRADING PLC',
    branch: 'Finfine Branch, Addis Ababa',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=1000284910291',
    instructions: 'Please enter your Order Number (e.g. EDR-...) in the transfer remark/reason field. After completing payment, submit your transaction reference number or receipt screenshot below.',
  },
  {
    id: 2,
    bankName: 'Awash Bank',
    accountNumber: '01304859182000',
    accountHolderName: 'EDRIS PERFUME TRADING PLC',
    branch: 'Bole Medhanialem Branch, Addis Ababa',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=01304859182000',
    instructions: 'Transfer via Awash Online or Awash Birr. Quote your unique Order ID in the payment description.',
  },
  {
    id: 3,
    bankName: 'Dashen Bank',
    accountNumber: '5082910394851',
    accountHolderName: 'EDRIS PERFUME TRADING PLC',
    branch: 'Kazanchis Branch, Addis Ababa',
    instructions: 'Send money to account 5082910394851 via Amole or Dashen Mobile. Submit reference ID for verification.',
  },
  {
    id: 4,
    bankName: 'Bank of Abyssinia',
    accountNumber: '78491029384',
    accountHolderName: 'EDRIS PERFUME TRADING PLC',
    branch: 'Meskel Square Branch, Addis Ababa',
    instructions: 'Deposit via Apollo app or branch teller. Orders are confirmed once verified by our finance desk.',
  },
];

const INITIAL_CAMPAIGNS: AdvertisingCampaign[] = [
  {
    id: 1,
    title: 'Elegance in Every Drop',
    subtitle: 'Discover the Royal Extrait Collection, handcrafted with the finest Ethiopian mountain frankincense and Grasse florals.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Shop The Collection',
    ctaLink: '/shop',
    placement: 'HERO_CAROUSEL',
  },
  {
    id: 2,
    title: 'Addis Nights Oud Edition',
    subtitle: 'A sensory voyage through midnight velvet and warm ceremonial amber. Fast same-day delivery in Addis Ababa.',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Explore Oud Blends',
    ctaLink: '/shop?category=oriental-oud',
    placement: 'HERO_CAROUSEL',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'EDR-2026-88192',
    customerId: 3,
    customerName: 'Selamawit Tadesse',
    customerEmail: 'customer@edrisperfume.et',
    subtotal: 14500,
    discountAmount: 0,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 14650,
    currency: 'ETB',
    orderStatus: 'CONFIRMED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'PACKED',
    shippingFullName: 'Selamawit Tadesse',
    shippingPhone: '+251933445566',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Bole',
    shippingAddressLine: 'House 42, Near Edna Mall',
    trackingNumber: 'ET-DISP-9921',
    paymentMethod: 'Telebirr SuperApp',
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Edris Royale Extrait',
        sku: 'EDR-ROY-100',
        unitPrice: 14500,
        quantity: 1,
        subtotal: 14500,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 2,
    orderNumber: 'EDR-2026-90412',
    customerId: 3,
    customerName: 'Selamawit Tadesse',
    customerEmail: 'customer@edrisperfume.et',
    subtotal: 12800,
    discountAmount: 1000,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 11950,
    currency: 'ETB',
    orderStatus: 'PENDING_PAYMENT',
    paymentStatus: 'AWAITING_CUSTOMER_ACTION',
    fulfillmentStatus: 'UNFULFILLED',
    shippingFullName: 'Selamawit Tadesse',
    shippingPhone: '+251933445566',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Kirkos',
    shippingAddressLine: 'Kazanchis Supermarket area',
    trackingNumber: 'ET-DISP-9988',
    paymentMethod: 'Commercial Bank of Ethiopia (CBE)',
    items: [
      {
        id: 2,
        productId: 2,
        productName: 'Addis Nights Oud',
        sku: 'EDR-ADD-100',
        unitPrice: 12800,
        quantity: 1,
        subtotal: 12800,
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    orderNumber: 'EDR-2026-91024',
    customerId: 4,
    customerName: 'Abebe Bekele',
    customerEmail: 'abebe.b@example.et',
    subtotal: 11200,
    discountAmount: 0,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 11350,
    currency: 'ETB',
    orderStatus: 'CONFIRMED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'UNFULFILLED',
    shippingFullName: 'Abebe Bekele',
    shippingPhone: '+251911998877',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Bole',
    shippingAddressLine: 'Atlas Hotel area, Cape Verde Street, Villa 14',
    shippingNotes: 'Call before arriving. Please leave with receptionist if unavailable.',
    trackingNumber: 'ET-DISP-4401',
    paymentMethod: 'Telebirr SuperApp',
    items: [
      {
        id: 3,
        productId: 3,
        productName: 'Lalibela Golden Rose',
        sku: 'EDR-LAL-100',
        unitPrice: 11200,
        quantity: 1,
        subtotal: 11200,
        imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    orderNumber: 'EDR-2026-91550',
    customerId: 5,
    customerName: 'Rahel Assefa',
    customerEmail: 'rahel.a@example.et',
    subtotal: 14500,
    discountAmount: 500,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 14150,
    currency: 'ETB',
    orderStatus: 'CONFIRMED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'PICKING',
    shippingFullName: 'Rahel Assefa',
    shippingPhone: '+251922556677',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Yeka',
    shippingAddressLine: 'Megenagna Commercial Center, Floor 3',
    shippingNotes: 'Fragile luxury bottle - handle with gold box ribbon intact.',
    trackingNumber: 'ET-DISP-7812',
    paymentMethod: 'CBE Birr',
    acceptedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    items: [
      {
        id: 4,
        productId: 1,
        productName: 'Edris Royale Extrait',
        sku: 'EDR-ROY-100',
        unitPrice: 14500,
        quantity: 1,
        subtotal: 14500,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    orderNumber: 'EDR-2026-92010',
    customerId: 6,
    customerName: 'Yared Teshome',
    customerEmail: 'yared.t@example.et',
    subtotal: 25600,
    discountAmount: 1600,
    deliveryFee: 0,
    taxAmount: 0,
    totalAmount: 24000,
    currency: 'ETB',
    orderStatus: 'SHIPPED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'DISPATCHED',
    shippingFullName: 'Yared Teshome',
    shippingPhone: '+251944112233',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Kirkos',
    shippingAddressLine: 'Meskel Flower area, near Dreamliner Hotel',
    shippingNotes: 'Gate passcode is 4022. Security guard will direct you.',
    trackingNumber: 'ET-DISP-8830',
    paymentMethod: 'Bank of Abyssinia / Apollo',
    deliveryOtp: '839214',
    acceptedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    readyPickupAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    items: [
      {
        id: 5,
        productId: 2,
        productName: 'Addis Nights Oud',
        sku: 'EDR-ADD-100',
        unitPrice: 12800,
        quantity: 2,
        subtotal: 25600,
        imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    orderNumber: 'EDR-2026-92400',
    customerId: 7,
    customerName: 'Tigist Hailu',
    customerEmail: 'tigist.h@example.et',
    subtotal: 14500,
    discountAmount: 0,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 14650,
    currency: 'ETB',
    orderStatus: 'SHIPPED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'DELIVERED',
    shippingFullName: 'Tigist Hailu',
    shippingPhone: '+251955667788',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Bole',
    shippingAddressLine: 'Rwanda Embassy street, Residence #5',
    shippingNotes: 'VIP customer. White glove delivery requested.',
    trackingNumber: 'ET-DISP-9905',
    paymentMethod: 'Telebirr SuperApp',
    deliveryOtp: '517409',
    acceptedAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    readyPickupAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    items: [
      {
        id: 6,
        productId: 1,
        productName: 'Edris Royale Extrait',
        sku: 'EDR-ROY-100',
        unitPrice: 14500,
        quantity: 1,
        subtotal: 14500,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 400 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    orderNumber: 'EDR-2026-87110',
    customerId: 8,
    customerName: 'Mulugeta Zewde',
    customerEmail: 'mulugeta.z@example.et',
    subtotal: 11200,
    discountAmount: 0,
    deliveryFee: 150,
    taxAmount: 0,
    totalAmount: 11350,
    currency: 'ETB',
    orderStatus: 'DELIVERED',
    paymentStatus: 'SUCCEEDED',
    fulfillmentStatus: 'DELIVERED',
    shippingFullName: 'Mulugeta Zewde',
    shippingPhone: '+251911334455',
    shippingCity: 'Addis Ababa',
    shippingSubcity: 'Bole',
    shippingAddressLine: 'Japan Embassy area',
    trackingNumber: 'ET-DISP-7720',
    paymentMethod: 'Commercial Bank of Ethiopia (CBE)',
    deliveryOtp: '629143',
    acceptedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    readyPickupAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    closedByUserId: 2,
    items: [
      {
        id: 7,
        productId: 3,
        productName: 'Lalibela Golden Rose',
        sku: 'EDR-LAL-100',
        unitPrice: 11200,
        quantity: 1,
        subtotal: 11200,
        imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
      },
    ],
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 1,
    userId: 5,
    partnerName: 'Dawit Haile',
    vehicleType: 'Toyota Vitz Sedan (White)',
    licensePlate: 'AA-2-A12345',
    phoneNumber: '+251911223344',
    status: 'ACTIVE',
    rating: 4.9,
    activeDeliveriesCount: 1,
  },
  {
    id: 2,
    userId: 6,
    partnerName: 'Yonas Tsegaye',
    vehicleType: 'TVS King Deluxe Motorcycle',
    licensePlate: 'AA-3-B98765',
    phoneNumber: '+251922334455',
    status: 'ACTIVE',
    rating: 4.8,
    activeDeliveriesCount: 0,
  },
  {
    id: 3,
    userId: 7,
    partnerName: 'Bethlehem Kebede',
    vehicleType: 'Hyundai Grand i10 (Silver)',
    licensePlate: 'AA-2-C34567',
    phoneNumber: '+251933445566',
    status: 'ACTIVE',
    rating: 5.0,
    activeDeliveriesCount: 0,
  },
];

const INITIAL_DELIVERY_ASSIGNMENTS: DeliveryAssignment[] = [
  {
    id: 1,
    orderId: 5,
    orderNumber: 'EDR-2026-92010',
    deliveryPartnerId: 1,
    partnerName: 'Dawit Haile',
    vehicleType: 'Toyota Vitz Sedan (White)',
    licensePlate: 'AA-2-A12345',
    partnerPhone: '+251911223344',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
    status: 'IN_TRANSIT',
    pickupAddress: 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa',
    deliveryAddress: 'Meskel Flower area, near Dreamliner Hotel, Kirkos, Addis Ababa',
    deliveryOtp: '839214',
    otpAttempts: 0,
    maxOtpAttempts: 5,
    recipientName: 'Yared Teshome',
    recipientPhone: '+251944112233',
    recipientNotes: 'Gate passcode is 4022. Security guard will direct you.',
    pickupConfirmedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    orderId: 6,
    orderNumber: 'EDR-2026-92400',
    deliveryPartnerId: 1,
    partnerName: 'Dawit Haile',
    vehicleType: 'Toyota Vitz Sedan (White)',
    licensePlate: 'AA-2-A12345',
    partnerPhone: '+251911223344',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
    status: 'DELIVERED',
    pickupAddress: 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa',
    deliveryAddress: 'Rwanda Embassy street, Residence #5, Bole, Addis Ababa',
    deliveryOtp: '517409',
    otpAttempts: 1,
    maxOtpAttempts: 5,
    recipientName: 'Tigist Hailu (Handed to Customer)',
    recipientPhone: '+251955667788',
    recipientNotes: 'White glove delivery completed with signature and verification PIN.',
    proofCode: 'POD-517409-92400',
    pickupConfirmedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    orderId: 7,
    orderNumber: 'EDR-2026-87110',
    deliveryPartnerId: 2,
    partnerName: 'Yonas Tsegaye',
    vehicleType: 'TVS King Deluxe Motorcycle',
    licensePlate: 'AA-3-B98765',
    partnerPhone: '+251922334455',
    merchantId: 1,
    merchantName: 'Addis Luxury Scents Boutique',
    status: 'DELIVERED',
    pickupAddress: 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa',
    deliveryAddress: 'Japan Embassy area, Bole, Addis Ababa',
    deliveryOtp: '629143',
    otpAttempts: 1,
    maxOtpAttempts: 5,
    recipientName: 'Mulugeta Zewde',
    recipientPhone: '+251911334455',
    proofCode: 'POD-629143-87110',
    pickupConfirmedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_ORDER_TIMELINES: OrderStatusHistory[] = [
  {
    id: 1,
    orderId: 5,
    fromOrderStatus: 'PENDING_PAYMENT',
    toOrderStatus: 'CONFIRMED',
    fromFulfillmentStatus: 'UNFULFILLED',
    toFulfillmentStatus: 'UNFULFILLED',
    action: 'ORDER_PLACED',
    performedByRole: 'CUSTOMER',
    performedByName: 'Yared Teshome',
    notes: 'Order placed with Apollo mobile banking.',
    timestamp: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    orderId: 5,
    fromOrderStatus: 'CONFIRMED',
    toOrderStatus: 'CONFIRMED',
    fromFulfillmentStatus: 'UNFULFILLED',
    toFulfillmentStatus: 'PICKING',
    action: 'MERCHANT_ACCEPTED',
    performedByRole: 'MERCHANT',
    performedByName: 'Addis Luxury Scents Boutique',
    notes: 'Fragrances pulled from climate vault for boutique gift packaging.',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    orderId: 5,
    fromOrderStatus: 'CONFIRMED',
    toOrderStatus: 'CONFIRMED',
    fromFulfillmentStatus: 'PICKING',
    toFulfillmentStatus: 'PACKED',
    action: 'READY_FOR_PICKUP',
    performedByRole: 'MERCHANT',
    performedByName: 'Addis Luxury Scents Boutique',
    notes: 'Sealed with gold wax seal, safety bubble wrapped.',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    orderId: 5,
    fromOrderStatus: 'CONFIRMED',
    toOrderStatus: 'CONFIRMED',
    fromFulfillmentStatus: 'PACKED',
    toFulfillmentStatus: 'PACKED',
    action: 'DELIVERY_ASSIGNED',
    performedByRole: 'MERCHANT',
    performedByName: 'Addis Luxury Scents Boutique',
    notes: 'Assigned to courier Dawit Haile. 6-digit recipient PIN generated.',
    timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    orderId: 5,
    fromOrderStatus: 'CONFIRMED',
    toOrderStatus: 'CONFIRMED',
    fromFulfillmentStatus: 'PACKED',
    toFulfillmentStatus: 'PICKED_UP',
    action: 'PACKAGE_PICKUP_CONFIRMED',
    performedByRole: 'DELIVERY_PARTNER',
    performedByName: 'Dawit Haile',
    notes: 'Courier arrived at boutique and received luxury package #EDR-2026-92010.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    orderId: 5,
    fromOrderStatus: 'CONFIRMED',
    toOrderStatus: 'SHIPPED',
    fromFulfillmentStatus: 'PICKED_UP',
    toFulfillmentStatus: 'DISPATCHED',
    action: 'START_DELIVERY_IN_TRANSIT',
    performedByRole: 'DELIVERY_PARTNER',
    performedByName: 'Dawit Haile',
    notes: 'Courier departing towards Kirkos delivery address.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

const INITIAL_MERCHANTS: MerchantProfile[] = [
  {
    id: 1,
    userId: 2,
    businessName: 'Addis Luxury Scents Boutique',
    tinNumber: '0012345678',
    tradeLicenseNumber: 'TL-AA-2024-9881',
    contactPhone: '+251922334455',
    address: 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa',
    bankName: 'Commercial Bank of Ethiopia',
    bankAccountNumber: '1000123456789',
    bankAccountName: 'Addis Luxury Scents LLC',
    approvalStatus: 'APPROVED',
    commissionRate: 10,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    userId: 4,
    businessName: 'Red Sea Oud Importers',
    tinNumber: '0098765432',
    tradeLicenseNumber: 'TL-AA-2026-1120',
    contactPhone: '+251911887766',
    address: 'Piassa Churchill Avenue, Addis Ababa',
    bankName: 'Awash Bank',
    bankAccountNumber: '01309988776655',
    bankAccountName: 'Red Sea Trading PLC',
    approvalStatus: 'PENDING',
    commissionRate: 12,
    createdAt: '2026-10-20T14:30:00Z',
  },
];

// Helper to get / set state in localStorage for persistent client state
const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`edris_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`edris_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(err);
  }
};

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    return getStorage('products', INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug || String(p.id) === slug);
  },

  async getCategories(): Promise<Category[]> {
    return INITIAL_CATEGORIES;
  },

  async getBrands(): Promise<Brand[]> {
    return INITIAL_BRANDS;
  },

  async getCampaigns(): Promise<AdvertisingCampaign[]> {
    return INITIAL_CAMPAIGNS;
  },

  // Payment Methods & Bank Accounts
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return INITIAL_PAYMENT_METHODS;
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    return INITIAL_BANK_ACCOUNTS;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return getStorage('orders', INITIAL_ORDERS);
  },

  async getOrderById(id: number | string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === Number(id) || o.orderNumber === id);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const orders = await this.getOrders();
    const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const orderNumber = `EDR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: newId,
      orderNumber,
      customerId: orderData.customerId || 3,
      customerName: orderData.shippingFullName || 'Valued Customer',
      customerEmail: 'customer@edrisperfume.et',
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      deliveryFee: orderData.deliveryFee || 150,
      taxAmount: 0,
      totalAmount: (orderData.subtotal || 0) - (orderData.discountAmount || 0) + (orderData.deliveryFee || 150),
      currency: 'ETB',
      orderStatus: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'UNFULFILLED',
      shippingFullName: orderData.shippingFullName || '',
      shippingPhone: orderData.shippingPhone || '',
      shippingCity: orderData.shippingCity || 'Addis Ababa',
      shippingSubcity: orderData.shippingSubcity || '',
      shippingAddressLine: orderData.shippingAddressLine || '',
      shippingNotes: orderData.shippingNotes,
      trackingNumber: `ET-DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: orderData.paymentMethod || 'Telebirr SuperApp',
      items: orderData.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setStorage('orders', orders);
    return newOrder;
  },

  // Payment Initialization
  async initiatePayment(orderId: number, paymentMethodCode: string): Promise<{
    transactionReference: string;
    checkoutUrl?: string;
    qrCodeData?: string;
    instructions?: string;
    expiresAt: string;
    status: PaymentStatus;
  }> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = orders[orderIndex];
    const txnRef = `TXN-EDR-${Math.floor(100000 + Math.random() * 900000)}`;

    if (paymentMethodCode === 'TELEBIRR' || paymentMethodCode === 'CBE_BIRR') {
      // Telebirr payment initiation
      order.paymentStatus = 'INITIATED';
      orders[orderIndex] = order;
      setStorage('orders', orders);

      return {
        transactionReference: txnRef,
        checkoutUrl: `https://telebirr.et/pay?outTradeNo=${txnRef}&amount=${order.totalAmount}`,
        qrCodeData: `telebirr://pay?order=${order.orderNumber}&amt=${order.totalAmount}&ref=${txnRef}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        status: 'INITIATED',
      };
    } else if (paymentMethodCode.startsWith('BANK_TRANSFER')) {
      // Authorized Bank Transfer initiation
      order.paymentStatus = 'AWAITING_CUSTOMER_ACTION';
      orders[orderIndex] = order;
      setStorage('orders', orders);

      return {
        transactionReference: txnRef,
        instructions: 'Please transfer to our designated bank account and enter your transfer reference ID.',
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        status: 'AWAITING_CUSTOMER_ACTION',
      };
    } else {
      // Cash on delivery
      order.paymentStatus = 'PENDING';
      order.orderStatus = 'CONFIRMED';
      order.fulfillmentStatus = 'PICKING';
      orders[orderIndex] = order;
      setStorage('orders', orders);

      return {
        transactionReference: txnRef,
        instructions: 'Cash on delivery enabled. Payment will be collected upon arrival.',
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        status: 'PENDING',
      };
    }
  },

  // Submit unverified bank transfer reference/proof
  async submitBankProof(orderId: number, reference: string, notes?: string): Promise<Order> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = orders[orderIndex];
    order.paymentStatus = 'PROCESSING';
    order.paymentTransaction = {
      id: Math.floor(Math.random() * 10000),
      transactionReference: `BNK-CLAIM-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: order.id,
      customerId: order.customerId,
      paymentMethodId: 3,
      paymentMethodName: order.paymentMethod || 'Bank Transfer',
      provider: 'BANK_TRANSFER',
      merchantOrderRef: order.orderNumber,
      expectedAmount: order.totalAmount,
      currency: 'ETB',
      paymentStatus: 'PROCESSING',
      transferProofReference: reference,
      customerNotes: notes,
      createdAt: new Date().toISOString(),
    };

    orders[orderIndex] = order;
    setStorage('orders', orders);
    return order;
  },

  // Telebirr simulation (for testing)
  async simulateTelebirrCallback(orderId: number, success: boolean): Promise<Order> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = orders[orderIndex];
    if (success) {
      order.paymentStatus = 'SUCCEEDED';
      order.orderStatus = 'CONFIRMED';
      order.fulfillmentStatus = 'PICKING';
    } else {
      order.paymentStatus = 'FAILED';
    }
    orders[orderIndex] = order;
    setStorage('orders', orders);
    return order;
  },

  // Admin: Reconcile Bank Payment
  async reconcilePayment(orderId: number, approved: boolean, reason?: string): Promise<Order> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = orders[orderIndex];
    if (approved) {
      order.paymentStatus = 'SUCCEEDED';
      order.orderStatus = 'CONFIRMED';
      order.fulfillmentStatus = 'PICKING';
      if (order.paymentTransaction) {
        order.paymentTransaction.paymentStatus = 'SUCCEEDED';
        order.paymentTransaction.verifiedAmount = order.totalAmount;
        order.paymentTransaction.verifiedAt = new Date().toISOString();
        order.paymentTransaction.adminReconciliationNotes = reason || 'Verified against bank statement';
      }
    } else {
      order.paymentStatus = 'FAILED';
      if (order.paymentTransaction) {
        order.paymentTransaction.paymentStatus = 'FAILED';
        order.paymentTransaction.adminReconciliationNotes = reason || 'Rejected: Reference not found in statement';
      }
    }

    orders[orderIndex] = order;
    setStorage('orders', orders);
    return order;
  },

  // Update Fulfillment Status (Merchant / Admin)
  async updateFulfillmentStatus(orderId: number, status: FulfillmentStatus): Promise<Order> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');

    const order = orders[orderIndex];
    order.fulfillmentStatus = status;
    if (status === 'DISPATCHED') {
      order.orderStatus = 'SHIPPED';
    } else if (status === 'DELIVERED') {
      order.orderStatus = 'DELIVERED';
    }

    orders[orderIndex] = order;
    setStorage('orders', orders);
    return order;
  },

  // Merchants Management
  async getMerchants(): Promise<MerchantProfile[]> {
    return getStorage('merchants', INITIAL_MERCHANTS);
  },

  async updateMerchantStatus(merchantId: number, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED', reason?: string): Promise<MerchantProfile> {
    const merchants = await this.getMerchants();
    const idx = merchants.findIndex((m) => m.id === merchantId);
    if (idx === -1) throw new Error('Merchant not found');

    merchants[idx].approvalStatus = status;
    if (reason) merchants[idx].rejectionReason = reason;

    setStorage('merchants', merchants);
    return merchants[idx];
  },

  // Products Management (Merchant / Admin)
  async saveProduct(productData: Partial<Product>): Promise<Product> {
    const products = await this.getProducts();
    let product: Product;

    if (productData.id) {
      const idx = products.findIndex((p) => p.id === productData.id);
      if (idx === -1) throw new Error('Product not found');
      product = { ...products[idx], ...productData } as Product;
      products[idx] = product;
    } else {
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      product = {
        id: newId,
        name: productData.name || 'New Fragrance',
        slug: productData.slug || `fragrance-${newId}`,
        shortDescription: productData.shortDescription || '',
        fullDescription: productData.fullDescription || '',
        fragranceFamily: productData.fragranceFamily || 'Oriental',
        volumeMl: productData.volumeMl || 100,
        concentration: productData.concentration || 'Eau de Parfum',
        topNotes: productData.topNotes || '',
        heartNotes: productData.heartNotes || '',
        baseNotes: productData.baseNotes || '',
        price: productData.price || 5000,
        sku: productData.sku || `SKU-${newId}`,
        stockQuantity: productData.stockQuantity || 10,
        lowStockThreshold: 3,
        isFeatured: false,
        isActive: true,
        ratingAvg: 5.0,
        reviewCount: 0,
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
        brandName: productData.brandName || 'Edris Signature',
        categoryName: productData.categoryName || 'Eau de Parfum',
        merchantId: 1,
        merchantName: 'Addis Luxury Scents Boutique',
      };
      products.unshift(product);
    }

    setStorage('products', products);
    return product;
  },

  // Loyalty Rewards
  async getLoyalty(customerId: number): Promise<CustomerLoyalty> {
    return {
      pointsBalance: 245,
      lifetimePoints: 245,
      tier: 'SILVER',
    };
  },

  // --------------------------------------------------------------------------
  // ORDER TAKING, DISPATCH & DELIVERY MANAGEMENT
  // --------------------------------------------------------------------------

  // Delivery Partners
  async getDeliveryPartners(): Promise<DeliveryPartner[]> {
    return getStorage('delivery_partners', INITIAL_DELIVERY_PARTNERS);
  },

  // Delivery Assignments
  async getDeliveryAssignments(partnerId?: number): Promise<DeliveryAssignment[]> {
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const orders = await this.getOrders();

    // Enrich assignments with fresh order objects
    const enriched = assignments.map((a) => {
      const ord = orders.find((o) => o.id === a.orderId);
      return { ...a, order: ord };
    });

    if (partnerId !== undefined) {
      return enriched.filter((a) => a.deliveryPartnerId === partnerId);
    }
    return enriched;
  },

  async getDeliveryAssignmentById(assignmentId: number): Promise<DeliveryAssignment | undefined> {
    const assignments = await this.getDeliveryAssignments();
    return assignments.find((a) => a.id === assignmentId);
  },

  // Order Timeline / Status History
  async getOrderTimeline(orderId: number): Promise<OrderStatusHistory[]> {
    const timelines = getStorage<OrderStatusHistory[]>('order_timelines', INITIAL_ORDER_TIMELINES);
    return timelines
      .filter((t) => t.orderId === orderId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  // Helper to append timeline event
  async appendTimelineEvent(
    orderId: number,
    action: string,
    fromOrderStatus: string | undefined,
    toOrderStatus: string,
    fromFulfillmentStatus: string | undefined,
    toFulfillmentStatus: string,
    role: string,
    actorName: string,
    notes?: string
  ): Promise<void> {
    const timelines = getStorage<OrderStatusHistory[]>('order_timelines', INITIAL_ORDER_TIMELINES);
    const newId = timelines.length > 0 ? Math.max(...timelines.map((t) => t.id)) + 1 : 1;
    timelines.push({
      id: newId,
      orderId,
      fromOrderStatus,
      toOrderStatus,
      fromFulfillmentStatus,
      toFulfillmentStatus,
      action,
      performedByRole: role,
      performedByName: actorName,
      notes,
      timestamp: new Date().toISOString(),
    });
    setStorage('order_timelines', timelines);
  },

  // Merchant: Accept Order
  async merchantAcceptOrder(orderId: number, notes?: string): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const prevFulfillment = order.fulfillmentStatus;

    order.fulfillmentStatus = 'PICKING';
    order.acceptedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    orders[idx] = order;
    setStorage('orders', orders);

    await this.appendTimelineEvent(
      order.id,
      'MERCHANT_ACCEPTED',
      order.orderStatus,
      order.orderStatus,
      prevFulfillment,
      'PICKING',
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      notes || 'Order accepted and sent to packing vault'
    );

    return order;
  },

  // Merchant: Ready for Pickup
  async merchantReadyForPickup(orderId: number): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const prevFulfillment = order.fulfillmentStatus;

    order.fulfillmentStatus = 'PACKED';
    order.readyPickupAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    orders[idx] = order;
    setStorage('orders', orders);

    await this.appendTimelineEvent(
      order.id,
      'READY_FOR_PICKUP',
      order.orderStatus,
      order.orderStatus,
      prevFulfillment,
      'PACKED',
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      'Package luxury wrapped, sealed, and staged at boutique dispatch counter'
    );

    return order;
  },

  // Merchant: Assign Delivery Partner
  async merchantAssignDelivery(
    orderId: number,
    partnerId: number,
    instructions?: string
  ): Promise<{ order: Order; assignment: DeliveryAssignment }> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const partners = await this.getDeliveryPartners();
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) throw new Error('Authorized delivery partner not found');

    // Generate secure 6-digit delivery OTP if not present
    const otp = order.deliveryOtp || String(Math.floor(100000 + Math.random() * 900000));
    order.deliveryOtp = otp;
    order.updatedAt = new Date().toISOString();

    // Create or update assignment
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    let assignment = assignments.find((a) => a.orderId === orderId);

    if (assignment) {
      assignment.deliveryPartnerId = partner.id;
      assignment.partnerName = partner.partnerName;
      assignment.partnerPhone = partner.phoneNumber;
      assignment.vehicleType = partner.vehicleType;
      assignment.licensePlate = partner.licensePlate;
      assignment.status = 'ASSIGNED';
      assignment.deliveryOtp = otp;
      if (instructions) assignment.recipientNotes = instructions;
    } else {
      const newAssignId = assignments.length > 0 ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
      assignment = {
        id: newAssignId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        deliveryPartnerId: partner.id,
        partnerName: partner.partnerName,
        partnerPhone: partner.phoneNumber,
        vehicleType: partner.vehicleType,
        licensePlate: partner.licensePlate,
        merchantId: 1,
        merchantName: 'Addis Luxury Scents Boutique',
        status: 'ASSIGNED',
        pickupAddress: 'Bole Medhanialem Mall, 2nd Floor, Addis Ababa',
        deliveryAddress: `${order.shippingAddressLine}, ${order.shippingSubcity || ''}, ${order.shippingCity}`,
        deliveryOtp: otp,
        otpAttempts: 0,
        maxOtpAttempts: 5,
        recipientName: order.shippingFullName,
        recipientPhone: order.shippingPhone,
        recipientNotes: instructions || order.shippingNotes,
        createdAt: new Date().toISOString(),
      };
      assignments.unshift(assignment);
    }

    order.deliveryAssignment = assignment;
    orders[idx] = order;
    setStorage('orders', orders);
    setStorage('delivery_assignments', assignments);

    await this.appendTimelineEvent(
      order.id,
      'DELIVERY_ASSIGNED',
      order.orderStatus,
      order.orderStatus,
      order.fulfillmentStatus,
      order.fulfillmentStatus,
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      `Assigned to courier ${partner.partnerName} (${partner.vehicleType}). Secure OTP generated.`
    );

    return { order, assignment };
  },

  // Merchant: Package Handover to Courier
  async merchantHandover(orderId: number): Promise<{ order: Order; assignment: DeliveryAssignment }> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const assignmentIdx = assignments.findIndex((a) => a.orderId === orderId);
    if (assignmentIdx === -1) throw new Error('No delivery assignment found for this order');

    const assignment = assignments[assignmentIdx];
    assignment.status = 'PICKED_UP';
    assignment.pickupConfirmedAt = new Date().toISOString();

    const prevFulfillment = order.fulfillmentStatus;
    order.fulfillmentStatus = 'PICKED_UP';
    order.updatedAt = new Date().toISOString();

    orders[idx] = order;
    assignments[assignmentIdx] = assignment;

    setStorage('orders', orders);
    setStorage('delivery_assignments', assignments);

    await this.appendTimelineEvent(
      order.id,
      'MERCHANT_PACKAGE_HANDOVER',
      order.orderStatus,
      order.orderStatus,
      prevFulfillment,
      'PICKED_UP',
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      `Package officially handed over to courier ${assignment.partnerName}`
    );

    return { order, assignment };
  },

  // Merchant: Close Order (Only allowed if fulfillmentStatus is DELIVERED)
  async merchantCloseOrder(orderId: number, notes?: string): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];

    // Business rule #8 & #12: Order can only be closed after successful delivery confirmation
    if (order.fulfillmentStatus !== 'DELIVERED') {
      throw new Error('Order cannot be closed until delivery confirmation and proof are completed.');
    }

    const prevOrderStatus = order.orderStatus;
    order.orderStatus = 'DELIVERED';
    order.closedAt = new Date().toISOString();
    order.closedByUserId = 2; // Authenticated merchant ID
    order.updatedAt = new Date().toISOString();

    orders[idx] = order;
    setStorage('orders', orders);

    await this.appendTimelineEvent(
      order.id,
      'MERCHANT_ORDER_CLOSED',
      prevOrderStatus,
      'DELIVERED',
      order.fulfillmentStatus,
      'DELIVERED',
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      notes || 'Delivery confirmation reviewed and approved. Order closed successfully.'
    );

    return order;
  },

  // Merchant: Cancel Order with reason
  async merchantCancelOrder(orderId: number, reason: string): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    if (order.orderStatus === 'DELIVERED') {
      throw new Error('Cannot cancel a closed order');
    }

    const prevOrderStatus = order.orderStatus;
    const prevFulfillment = order.fulfillmentStatus;

    order.orderStatus = 'CANCELLED';
    order.fulfillmentStatus = 'RETURNED';
    order.updatedAt = new Date().toISOString();

    // Also cancel any assignment
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const assignIdx = assignments.findIndex((a) => a.orderId === orderId);
    if (assignIdx !== -1) {
      assignments[assignIdx].status = 'CANCELLED';
      setStorage('delivery_assignments', assignments);
    }

    orders[idx] = order;
    setStorage('orders', orders);

    await this.appendTimelineEvent(
      order.id,
      'ORDER_CANCELLED',
      prevOrderStatus,
      'CANCELLED',
      prevFulfillment,
      'RETURNED',
      'MERCHANT',
      'Addis Luxury Scents Boutique',
      `Cancellation: ${reason}`
    );

    return order;
  },

  // --------------------------------------------------------------------------
  // DELIVERY PARTNER ACTIONS
  // --------------------------------------------------------------------------

  // Delivery Partner: Confirm Pickup
  async courierConfirmPickup(assignmentId: number): Promise<DeliveryAssignment> {
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const idx = assignments.findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Delivery assignment not found');

    const assignment = assignments[idx];
    assignment.status = 'PICKED_UP';
    assignment.pickupConfirmedAt = new Date().toISOString();
    assignments[idx] = assignment;
    setStorage('delivery_assignments', assignments);

    // Update order
    const orders = await this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === assignment.orderId);
    if (orderIdx !== -1) {
      const order = orders[orderIdx];
      const prev = order.fulfillmentStatus;
      order.fulfillmentStatus = 'PICKED_UP';
      orders[orderIdx] = order;
      setStorage('orders', orders);

      await this.appendTimelineEvent(
        order.id,
        'COURIER_PICKUP_CONFIRMED',
        order.orderStatus,
        order.orderStatus,
        prev,
        'PICKED_UP',
        'DELIVERY_PARTNER',
        assignment.partnerName || 'Delivery Partner',
        'Courier physically received and verified the luxury sealed parcel at boutique'
      );
    }

    return assignment;
  },

  // Delivery Partner: Start Delivery (In Transit)
  async courierStartDelivery(assignmentId: number): Promise<DeliveryAssignment> {
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const idx = assignments.findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Delivery assignment not found');

    const assignment = assignments[idx];
    assignment.status = 'IN_TRANSIT';
    assignment.startedAt = new Date().toISOString();
    assignments[idx] = assignment;
    setStorage('delivery_assignments', assignments);

    // Update order
    const orders = await this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === assignment.orderId);
    if (orderIdx !== -1) {
      const order = orders[orderIdx];
      const prev = order.fulfillmentStatus;
      order.fulfillmentStatus = 'DISPATCHED';
      order.orderStatus = 'SHIPPED';
      orders[orderIdx] = order;
      setStorage('orders', orders);

      await this.appendTimelineEvent(
        order.id,
        'START_DELIVERY_IN_TRANSIT',
        'CONFIRMED',
        'SHIPPED',
        prev,
        'DISPATCHED',
        'DELIVERY_PARTNER',
        assignment.partnerName || 'Delivery Partner',
        'Courier is en route to recipient address with white-glove packaging'
      );
    }

    return assignment;
  },

  // Delivery Partner: Confirm Delivery with Recipient OTP
  async courierConfirmDelivery(
    assignmentId: number,
    otpCode: string,
    recipientName?: string,
    notes?: string
  ): Promise<DeliveryAssignment> {
    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const idx = assignments.findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Delivery assignment not found');

    const assignment = assignments[idx];

    // Brute force protection
    if (assignment.otpAttempts >= assignment.maxOtpAttempts) {
      throw new Error('Maximum OTP verification attempts exceeded. Please contact merchant support.');
    }

    const cleanInputOtp = otpCode.trim();
    const expectedOtp = (assignment.deliveryOtp || '').trim();

    if (cleanInputOtp !== expectedOtp) {
      assignment.otpAttempts = (assignment.otpAttempts || 0) + 1;
      assignments[idx] = assignment;
      setStorage('delivery_assignments', assignments);
      const remaining = assignment.maxOtpAttempts - assignment.otpAttempts;
      throw new Error(`Invalid recipient verification PIN. ${remaining} attempts remaining.`);
    }

    // OTP Verified successfully!
    const proofCode = `POD-${cleanInputOtp}-${assignment.orderNumber || assignment.orderId}`;
    assignment.status = 'DELIVERED';
    assignment.proofCode = proofCode;
    assignment.deliveredAt = new Date().toISOString();
    if (recipientName) assignment.recipientName = recipientName;
    if (notes) assignment.recipientNotes = notes;
    assignments[idx] = assignment;
    setStorage('delivery_assignments', assignments);

    // Update order fulfillment to DELIVERED (Order itself awaits merchant review & closure)
    const orders = await this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === assignment.orderId);
    if (orderIdx !== -1) {
      const order = orders[orderIdx];
      const prev = order.fulfillmentStatus;
      order.fulfillmentStatus = 'DELIVERED';
      order.updatedAt = new Date().toISOString();
      orders[orderIdx] = order;
      setStorage('orders', orders);

      await this.appendTimelineEvent(
        order.id,
        'DELIVERY_CONFIRMED_BY_COURIER',
        order.orderStatus,
        order.orderStatus,
        prev,
        'DELIVERED',
        'DELIVERY_PARTNER',
        assignment.partnerName || 'Delivery Partner',
        `Doorstep delivery confirmed with recipient PIN. Proof generated: ${proofCode}. Awaiting merchant closure.`
      );
    }

    return assignment;
  },

  // Delivery Partner: Mark Failed Delivery with mandatory reason
  async courierFailDelivery(assignmentId: number, reason: string, notes?: string): Promise<DeliveryAssignment> {
    if (!reason || !reason.trim()) {
      throw new Error('A valid reason for delivery failure is strictly required.');
    }

    const assignments = getStorage<DeliveryAssignment[]>('delivery_assignments', INITIAL_DELIVERY_ASSIGNMENTS);
    const idx = assignments.findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Delivery assignment not found');

    const assignment = assignments[idx];
    assignment.status = 'FAILED';
    assignment.failureReason = `${reason}${notes ? ` - ${notes}` : ''}`;
    assignment.failedAt = new Date().toISOString();
    assignments[idx] = assignment;
    setStorage('delivery_assignments', assignments);

    // Update order
    const orders = await this.getOrders();
    const orderIdx = orders.findIndex((o) => o.id === assignment.orderId);
    if (orderIdx !== -1) {
      const order = orders[orderIdx];
      const prev = order.fulfillmentStatus;
      order.fulfillmentStatus = 'DELIVERY_FAILED';
      order.updatedAt = new Date().toISOString();
      orders[orderIdx] = order;
      setStorage('orders', orders);

      await this.appendTimelineEvent(
        order.id,
        'DELIVERY_FAILED',
        order.orderStatus,
        order.orderStatus,
        prev,
        'DELIVERY_FAILED',
        'DELIVERY_PARTNER',
        assignment.partnerName || 'Delivery Partner',
        `Delivery attempted and failed: ${reason}. Package being returned or rescheduled.`
      );
    }

    return assignment;
  },
};

