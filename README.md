# Zenith Arcade: GenZ Edition

Engineered for the elite. Merging technical performance with the cinematic spirit of anime culture.

Zenith Arcade is a high-fidelity, production-grade e-commerce platform designed for high-performance athletes and streetwear enthusiasts. Built with a "Cinematic Cyberpunk" aesthetic, it offers a seamless shopping experience integrated with Razorpay for secure payments.

## 🚀 Features

- **High-Fidelity UI**: Premium glassmorphism, technical specs, and cinematic animations.
- **Advanced Filtering**: Granular search by keyword, category, price range, and size.
- **Per-Size Inventory**: Realistic stock management for each item size.
- **Secure Payments**: Full Razorpay integration with server-side signature verification.
- **Order Command Center**: Real-time order tracking and management for users and admins.
- **Dockerized Architecture**: Multi-stage Docker builds with Nginx proxy for production-grade performance.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Zustand (State Management).
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: JWT, Bcrypt, Helmet, Rate Limiting, MongoSanitize.
- **Infrastructure**: Docker, Nginx.

## 📦 Project Structure

```text
├── backend/            # Express API & MongoDB Models
├── frontend/           # React/Vite Application
├── docker-compose.yml  # Orchestration for Production
└── deployment_guide.md # Step-by-step AWS Deployment Guide
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Razorpay API Keys

### 1. Clone & Install
```bash
git clone https://github.com/heyapoorv/GenZ.git
cd GenZ
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MONGO_URI and RAZORPAY_KEYS
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker Deployment

To run the entire stack in production mode:
```bash
docker-compose up --build
```

## 📜 License
This project is for demonstration and production-grade development purposes.
