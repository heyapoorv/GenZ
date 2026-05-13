const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./src/models/Product');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const products = [
  {
    name: 'CYBER-CORE COMPRESSION',
    price: 120.00,
    category: 'Compression',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBaiCLz7ELbOA8CaG5hRWAL64NEdwRsAuWVZHe6NRWsM39InxJA3tvgLqPdl6Tdlb5hRzoMFd6O4Jb5aeLOG3QJbDVnVhDXkkKBebn4Nj31VnU-RqJ51YXaeSJ7B4FnRq5djm16XrAuQDNgxMUfnm1kWPQ5uqDhUESmPpbZ9Z92Wpg3Ba7FBEm9cO8cd3oV06xu-iocYt3u8Drm0CMzzy-yYlnRakqERhL2N_Y8xqwtpASxgp_zyMXm5Z5MUN191zpT3a23pt7FVuaV'],
    description: 'Performance / Onyx Black'
  },
  {
    name: 'VANGUARD PILOT JERSEY',
    price: 95.00,
    category: 'Street-Spec',
    sizes: ['S', 'M', 'L'],
    stock: 25,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCd5qbBvtILuoXE4Gbhp-L4vzHvSeyhV1aMBb97v05mYloGakAac6OfUuK1dzodl0JVAtj3hS6vrgb2ZYGTGi--l3kDge5VtGn5ssTbYznU7I-kp4uE4m8JxfDT4lUAUJFkKpOY6T5RcmT-DN1ldOPFr7xvn_SWJxGMCReCrcGHygO7_FssEp3vtWaRpvkgzWwAkvBnLMh_-VKbb7PM5_RvLaUgoExPCMCPRAiD_yoEaF9xSrcv3k9I15h0NZolB3g2QoDyO5Xkpb_w'],
    description: 'Street-Spec / Glacial White'
  },
  {
    name: 'NEON-DRIVE PERFORMANCE',
    price: 145.00,
    category: 'Performance',
    sizes: ['M', 'L', 'XL'],
    stock: 10,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbEgvq2CUBBYiZSpgr1Sa915j9i0hupPBb0eKlS7oyn-w-9IZBQfeNfIur_H9QzYtio3r4WVtHGfwPuFt46qSnQAZP3Jr912E-fNqR2tJ9OiexAYC_fleQR6g-ni814O9O0-8cPhMpkF5LRQopaMMDFwlxbiuxlLYABp3tR9ddErP1qkW7sbCZBlc-YZ3SAxE_LLr4tdbRTosf-8B-sOn8fdQQV1IrhhY3j5USuKzigTViMzj8cWlkWaoLVWdlNDKJz_IFTirdTask'],
    description: 'Performance / Electric Blue'
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@zenith.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Kenji Sato',
    email: 'kenji@zenith.com',
    password: 'password123',
    role: 'user'
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    
    // Hash passwords manually for seeder since insertMany might bypass pre-save middleware depending on version
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(users.map(async u => ({
        ...u,
        password: await bcrypt.hash(u.password, salt)
    })));

    await User.insertMany(hashedUsers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
