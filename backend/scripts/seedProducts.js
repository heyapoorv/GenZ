const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../src/models/Product');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zenith_clothing');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const products = [
  // ANIME DOMAIN (10 items)
  {
    name: 'Neo-Tokyo Oversized Tee',
    price: 1299,
    category: 'Anime',
    sizeStock: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 2 }
    ],
    images: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800'],
    description: 'Cyberpunk inspired oversized tee featuring Neo-Tokyo aesthetics.'
  },
  {
    name: 'Shinobi Stealth Hoodie',
    price: 2499,
    category: 'Anime',
    sizeStock: [
      { size: 'M', stock: 2 },
      { size: 'L', stock: 1 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1554844453-7ea2a562a6c8?q=80&w=800'],
    description: 'Blacked-out techwear hoodie for the modern ninja.'
  },
  {
    name: 'Mecha-Unit Pilot Jacket',
    price: 4500,
    category: 'Anime',
    sizeStock: [
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'],
    description: 'Heavy duty flight jacket inspired by legendary mecha units.'
  },
  {
    name: 'Spirit World Kimono Shirt',
    price: 1899,
    category: 'Anime',
    sizeStock: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 5 }
    ],
    images: ['https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=800'],
    description: 'Flowy kimono shirt with traditional folklore prints.'
  },
  {
    name: 'Cyber-Ghost Graphics Tee',
    price: 999,
    category: 'Anime',
    sizeStock: [
      { size: 'S', stock: 1 },
      { size: 'M', stock: 1 },
      { size: 'L', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800'],
    description: 'Glitch art inspired graphic tee.'
  },
  {
    name: 'Demon Slayer Haori Blouson',
    price: 3200,
    category: 'Anime',
    sizeStock: [
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 }
    ],
    images: ['https://images.unsplash.com/photo-1620743139157-1d203fe05061?q=80&w=800'],
    description: 'Modern take on the traditional haori jacket.'
  },
  {
    name: 'Akiira Speedline Jersey',
    price: 1599,
    category: 'Anime',
    sizeStock: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 }
    ],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
    description: 'Motorcycle culture meets anime aesthetics.'
  },
  {
    name: 'Lunar Princess Silver Skirt',
    price: 2100,
    category: 'Anime',
    sizeStock: [
      { size: 'XS', stock: 1 },
      { size: 'S', stock: 2 },
      { size: 'M', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800'],
    description: 'Iridescent skirt for the magical girl in you.'
  },
  {
    name: 'Z-Fighter Training Tank',
    price: 899,
    category: 'Anime',
    sizeStock: [
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    images: ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800'],
    description: 'High performance tank top for intense gravity training.'
  },
  {
    name: 'Vaporwave Samurai Cap',
    price: 599,
    category: 'Anime',
    sizeStock: [
      { size: 'One Size', stock: 10 }
    ],
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800'],
    description: 'Retro-future cap with kanji embroidery.'
  },

  // GYM DOMAIN (10 items)
  {
    name: 'Iron Will Compression Tee',
    price: 1100,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 }
    ],
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'],
    description: 'Stay tight and focused with our signature compression gear.'
  },
  {
    name: 'Titanium Strength Joggers',
    price: 1899,
    category: 'Gym',
    sizeStock: [
      { size: 'M', stock: 1 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1506629082925-639197a5a53b?q=80&w=800'],
    description: 'Tapered fit joggers designed for maximum range of motion.'
  },
  {
    name: 'Alpha Lift Weightlifting Belt',
    price: 3500,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800'],
    description: 'Premium leather belt for heavy duty lifting.'
  },
  {
    name: 'Vortex Mesh Performance Shorts',
    price: 999,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 }
    ],
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800'],
    description: 'Breathable mesh shorts for high-intensity training.'
  },
  {
    name: 'Pulse Racerback Stringer',
    price: 799,
    category: 'Gym',
    sizeStock: [
      { size: 'M', stock: 2 },
      { size: 'L', stock: 1 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'],
    description: 'Minimalist stringer to showcase your gains.'
  },
  {
    name: 'Core Stability Knee Sleeves',
    price: 1499,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    images: ['https://images.unsplash.com/photo-1517438322351-ef3899f8295c?q=80&w=800'],
    description: '7mm neoprene sleeves for ultimate knee support.'
  },
  {
    name: 'Quantum Grip Gym Gloves',
    price: 699,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 }
    ],
    images: ['https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800'],
    description: 'Enhanced grip and palm protection for your heaviest sets.'
  },
  {
    name: 'Endurance Tech-Fleece Jacket',
    price: 2999,
    category: 'Gym',
    sizeStock: [
      { size: 'S', stock: 2 },
      { size: 'M', stock: 1 },
      { size: 'L', stock: 1 }
    ],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
    description: 'Warmth without the weight. Perfect for outdoor training.'
  },
  {
    name: 'Zenith Performance Socks',
    price: 399,
    category: 'Gym',
    sizeStock: [
      { size: 'One Size', stock: 50 }
    ],
    images: ['https://images.unsplash.com/photo-1582965107903-0d6bdaae4457?q=80&w=800'],
    description: 'Cushioned performance socks for all-day comfort.'
  },
  {
    name: 'Omega Training Duffle Bag',
    price: 2499,
    category: 'Gym',
    sizeStock: [
      { size: 'One Size', stock: 8 }
    ],
    images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800'],
    description: 'Spacious duffle bag with dedicated shoe compartment.'
  },

  // SPORTS DOMAIN (10 items)
  {
    name: 'Grand Slam Tennis Polo',
    price: 1599,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 5 }
    ],
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800'],
    description: 'Classic polo design with moisture-wicking technology.'
  },
  {
    name: 'Court King Basketball Jersey',
    price: 1299,
    category: 'Sports',
    sizeStock: [
      { size: 'M', stock: 1 },
      { size: 'L', stock: 1 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1515444744559-7be63e1600de?q=80&w=800'],
    description: 'Authentic mesh jersey for the street ballers.'
  },
  {
    name: 'Elite Pitcher Baseball Shirt',
    price: 1399,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1508341591423-4447a5f722b9?q=80&w=800'],
    description: 'Retro inspired baseball shirt with modern performance fabrics.'
  },
  {
    name: 'Goal Getter Soccer Kit',
    price: 2100,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 4 }
    ],
    images: ['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800'],
    description: 'Complete kit including jersey and shorts for the pitch.'
  },
  {
    name: 'Sprint Line Running Singlet',
    price: 899,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 2 },
      { size: 'M', stock: 1 },
      { size: 'L', stock: 1 }
    ],
    images: ['https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800'],
    description: 'Ultra-light singlet for your fastest runs.'
  },
  {
    name: 'Fairway Master Golf Shorts',
    price: 1999,
    category: 'Sports',
    sizeStock: [
      { size: '30', stock: 5 },
      { size: '32', stock: 3 },
      { size: '34', stock: 2 }
    ],
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800'],
    description: 'Sophisticated design meets athletic performance on the green.'
  },
  {
    name: 'Velodrome Cycling Jersey',
    price: 2800,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 }
    ],
    images: ['https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?q=80&w=800'],
    description: 'Aerodynamic fit with rear pockets for long rides.'
  },
  {
    name: 'Hydro-Speed Swim Trunks',
    price: 1100,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 1 },
      { size: 'M', stock: 1 },
      { size: 'L', stock: 1 }
    ],
    images: ['https://images.unsplash.com/photo-1533727937480-da3a97967e95?q=80&w=800'],
    description: 'Quick-dry fabric with bold geometric prints.'
  },
  {
    name: 'All-Star Varsity Jacket',
    price: 4999,
    category: 'Sports',
    sizeStock: [
      { size: 'M', stock: 1 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 }
    ],
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800'],
    description: 'Premium wool and leather varsity jacket. A true classic.'
  },
  {
    name: 'Peak Performance Trail Vest',
    price: 2500,
    category: 'Sports',
    sizeStock: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 }
    ],
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800'],
    description: 'Lightweight hydration vest for long distance trail running.'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany();
    console.log('Existing products cleared.');

    // Insert new products
    // We need to use create() to trigger the pre-save hook for totalStock
    for (const p of products) {
      await Product.create(p);
    }
    console.log(`${products.length} Products Seeded Successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
