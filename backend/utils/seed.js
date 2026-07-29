// Seeds the JSON "database" with an admin account, categories, and products.
// Run with: npm run seed  (safe to re-run — it wipes and rebuilds the seed data,
// but leaves any orders/customers created after seeding untouched only if RESET=false)
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const db = require('../db');

const categories = [
  { id: uuid(), name: 'Face', slug: 'face', description: 'Serums, creams and treatments for the face' },
  { id: uuid(), name: 'Body', slug: 'body', description: 'Butters, oils and washes for the body' },
  { id: uuid(), name: 'Hair', slug: 'hair', description: 'Oils and masks for scalp and strands' },
  { id: uuid(), name: 'Lips', slug: 'lips', description: 'Balms and tints' },
  { id: uuid(), name: 'Sun Care', slug: 'sun-care', description: 'Broad-spectrum protection' }
];

const byName = (n) => categories.find((c) => c.name === n).id;

const products = [
  {
    name: 'Saffron & Rose Repair Serum',
    category: byName('Face'),
    price: 3450,
    stock: 24,
    batch: 'AS-24-011',
    ph: 5.2,
    volume: '30ml',
    description: 'A lightweight serum built around Kashmiri saffron and steam-distilled rose water, formulated to fade uneven tone and restore bounce to tired skin.',
    ingredients: [
      { name: 'Rosa Damascena Water', pct: 62 },
      { name: 'Niacinamide', pct: 10 },
      { name: 'Crocus Sativus (Saffron) Extract', pct: 4 },
      { name: 'Sodium Hyaluronate', pct: 2 },
      { name: 'Glycerin', pct: 8 },
      { name: 'Preservative System', pct: 0.8 }
    ],
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'],
    rating: 4.8,
    reviewsCount: 132
  },
  {
    name: 'Turmeric Clarity Cleanser',
    category: byName('Face'),
    price: 1850,
    stock: 40,
    batch: 'AS-24-004',
    ph: 5.8,
    volume: '120ml',
    description: 'A cream cleanser with cold-pressed turmeric and neem leaf, made to lift the day off without stripping the skin barrier.',
    ingredients: [
      { name: 'Aqua', pct: 70 },
      { name: 'Curcuma Longa (Turmeric) Extract', pct: 3 },
      { name: 'Azadirachta Indica (Neem) Leaf Extract', pct: 3 },
      { name: 'Coco-Glucoside', pct: 12 },
      { name: 'Glycerin', pct: 6 },
      { name: 'Preservative System', pct: 0.7 }
    ],
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
    rating: 4.6,
    reviewsCount: 98
  },
  {
    name: 'Sandalwood Overnight Recovery Cream',
    category: byName('Face'),
    price: 4200,
    stock: 18,
    batch: 'AS-24-019',
    ph: 5.5,
    volume: '50ml',
    description: 'A rich night cream with Mysore sandalwood and shea, designed to be applied as the last step before sleep.',
    ingredients: [
      { name: 'Butyrospermum Parkii (Shea) Butter', pct: 18 },
      { name: 'Santalum Album (Sandalwood) Oil', pct: 2 },
      { name: 'Squalane', pct: 10 },
      { name: 'Ceramide NP', pct: 1.5 },
      { name: 'Aqua', pct: 55 },
      { name: 'Preservative System', pct: 0.8 }
    ],
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800'],
    rating: 4.9,
    reviewsCount: 76
  },
  {
    name: 'Aloe & Cucumber Gel Moisturiser',
    category: byName('Face'),
    price: 1650,
    stock: 55,
    batch: 'AS-24-002',
    ph: 5.6,
    volume: '80ml',
    description: 'A water-light gel for humid Karachi afternoons, built on aloe leaf juice and cucumber extract.',
    ingredients: [
      { name: 'Aloe Barbadensis Leaf Juice', pct: 65 },
      { name: 'Cucumis Sativus Extract', pct: 8 },
      { name: 'Sodium Hyaluronate', pct: 1.5 },
      { name: 'Panthenol', pct: 2 },
      { name: 'Preservative System', pct: 0.7 }
    ],
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'],
    rating: 4.5,
    reviewsCount: 210
  },
  {
    name: 'Kokum Butter Body Balm',
    category: byName('Body'),
    price: 2350,
    stock: 33,
    batch: 'AS-24-013',
    ph: null,
    volume: '150g',
    description: 'A firm balm that melts on contact, pressed from kokum and cocoa butter for elbows, heels and everywhere the winter reaches first.',
    ingredients: [
      { name: 'Garcinia Indica (Kokum) Butter', pct: 40 },
      { name: 'Theobroma Cacao (Cocoa) Butter', pct: 30 },
      { name: 'Sweet Almond Oil', pct: 20 },
      { name: 'Vitamin E', pct: 1 },
      { name: 'Fragrance (Sandalwood Accord)', pct: 0.6 }
    ],
    images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800'],
    rating: 4.7,
    reviewsCount: 61
  },
  {
    name: 'Moringa & Sea Salt Body Scrub',
    category: byName('Body'),
    price: 1950,
    stock: 29,
    batch: 'AS-24-008',
    ph: null,
    volume: '250g',
    description: 'Fine sea salt suspended in moringa oil, formulated to buff without tearing at the skin.',
    ingredients: [
      { name: 'Sodium Chloride (Sea Salt)', pct: 55 },
      { name: 'Moringa Oleifera Seed Oil', pct: 35 },
      { name: 'Sunflower Oil', pct: 9 },
      { name: 'Fragrance', pct: 0.5 }
    ],
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'],
    rating: 4.4,
    reviewsCount: 44
  },
  {
    name: 'Amla & Bhringraj Hair Oil',
    category: byName('Hair'),
    price: 1450,
    stock: 60,
    batch: 'AS-24-006',
    ph: null,
    volume: '100ml',
    description: 'A slow-cooked oil infusion of amla and bhringraj, meant for a weekly scalp massage the night before wash day.',
    ingredients: [
      { name: 'Sesame Oil', pct: 60 },
      { name: 'Phyllanthus Emblica (Amla) Extract', pct: 15 },
      { name: 'Eclipta Alba (Bhringraj) Extract', pct: 15 },
      { name: 'Coconut Oil', pct: 9.5 },
      { name: 'Vitamin E', pct: 0.5 }
    ],
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
    rating: 4.8,
    reviewsCount: 154
  },
  {
    name: 'Hibiscus Strengthening Hair Mask',
    category: byName('Hair'),
    price: 2100,
    stock: 22,
    batch: 'AS-24-015',
    ph: 4.8,
    volume: '200g',
    description: 'A weekly rinse-out mask with hibiscus flower and yoghurt proteins for strands that have had a hard few months.',
    ingredients: [
      { name: 'Aqua', pct: 50 },
      { name: 'Hibiscus Rosa-Sinensis Extract', pct: 8 },
      { name: 'Hydrolyzed Milk Protein', pct: 4 },
      { name: 'Cetearyl Alcohol', pct: 10 },
      { name: 'Behentrimonium Chloride', pct: 3 },
      { name: 'Preservative System', pct: 0.8 }
    ],
    images: ['https://images.unsplash.com/photo-1732861612244-5704d12e9397?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    reviewsCount: 39
  },
  {
    name: 'Rose Lip Tint Balm — Terracotta',
    category: byName('Lips'),
    price: 950,
    stock: 70,
    batch: 'AS-24-021',
    ph: null,
    volume: '8g',
    description: 'A sheer wash of colour with a balm base, buildable from a hint to a full terracotta flush.',
    ingredients: [
      { name: 'Castor Seed Oil', pct: 40 },
      { name: 'Beeswax', pct: 20 },
      { name: 'Shea Butter', pct: 25 },
      { name: 'Iron Oxide Pigments', pct: 3 },
      { name: 'Vitamin E', pct: 1 }
    ],
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
    rating: 4.7,
    reviewsCount: 88
  },
  {
    name: 'Honey & Shea Lip Repair Balm',
    category: byName('Lips'),
    price: 750,
    stock: 90,
    batch: 'AS-24-003',
    ph: null,
    volume: '10g',
    description: 'An unscented, uncoloured balm for chapped lips, built on raw honey and shea alone.',
    ingredients: [
      { name: 'Shea Butter', pct: 45 },
      { name: 'Beeswax', pct: 25 },
      { name: 'Raw Honey', pct: 15 },
      { name: 'Jojoba Oil', pct: 14.5 },
      { name: 'Vitamin E', pct: 0.5 }
    ],
    images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800'],
    rating: 4.9,
    reviewsCount: 201
  },
  {
    name: 'Mineral Defence SPF 50 Fluid',
    category: byName('Sun Care'),
    price: 2650,
    stock: 45,
    batch: 'AS-24-017',
    ph: 6.0,
    volume: '40ml',
    description: 'A zinc-oxide fluid that sits under makeup without the white cast, rated for daily Karachi sun.',
    ingredients: [
      { name: 'Zinc Oxide (Non-Nano)', pct: 18 },
      { name: 'Aqua', pct: 55 },
      { name: 'Niacinamide', pct: 4 },
      { name: 'Squalane', pct: 6 },
      { name: 'Preservative System', pct: 0.8 }
    ],
    images: ['https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800'],
    rating: 4.5,
    reviewsCount: 67
  },
  {
    name: 'After-Sun Cucumber Mist',
    category: byName('Sun Care'),
    price: 1250,
    stock: 38,
    batch: 'AS-24-009',
    ph: 5.4,
    volume: '100ml',
    description: 'A fine mist of cucumber and aloe to cool skin after a day out, kept in the fridge by most of our customers.',
    ingredients: [
      { name: 'Aloe Barbadensis Leaf Juice', pct: 70 },
      { name: 'Cucumis Sativus Extract', pct: 15 },
      { name: 'Panthenol', pct: 3 },
      { name: 'Allantoin', pct: 1 },
      { name: 'Preservative System', pct: 0.6 }
    ],
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
    rating: 4.6,
    reviewsCount: 52
  }
];

async function seed() {
  await db.replaceCollection('categories', categories);

  const withIds = products.map((p) => ({
    id: uuid(),
    createdAt: new Date().toISOString(),
    ...p
  }));
  await db.replaceCollection('products', withIds);

  const existingAdmin = await db.findOneByField('users', 'email', 'admin@bloomora.pk');
  if (!existingAdmin) {
    await db.createDoc('users', uuid(), {
      id: uuid(),
      name: 'Bloomora Admin',
      email: 'admin@bloomora.pk',
      password: bcrypt.hashSync('Admin@123', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }

  console.log('Seed complete.');
  console.log('Admin login -> email: admin@bloomora.pk  password: Admin@123');
  console.log(`${categories.length} categories, ${withIds.length} products.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
