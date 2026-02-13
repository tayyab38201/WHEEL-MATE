WHEEL-MATE
# 🦽 WHEEL-MATE - Accessible Places Finder

A full-stack MERN application designed to help wheelchair users and people with mobility challenges discover, share, and review accessible locations. WHEEL-MATE combines modern web technologies with a user-friendly interface to create an inclusive community-driven platform for accessibility information.

## ✨ Key Features

- **🔐 User Authentication** - Secure JWT-based login and registration system
- **🗺️ Place Discovery** - Find wheelchair-accessible facilities with advanced search and filtering
- **📍 GPS Integration** - Real-time distance calculation and location-based recommendations
- **⭐ Rating & Review System** - Community-driven feedback with 5-star ratings and detailed reviews
- **❤️ Favorites** - Save and organize your preferred accessible locations
- **🚨 Emergency SOS** - Quick access to nearest hospitals and police stations
- **🌙 Dark Mode** - Eye-friendly theme with persistent settings
- **📱 Fully Responsive** - Seamless experience across mobile, tablet, and desktop devices
- **🏆 Gamification** - Earn points for contributions (adding places, reviews, photos, comments)
- **📊 User Dashboard** - Track your contributions, points, and community ranking
- **📸 Photo Gallery** - Visual documentation of accessibility features
- **💬 Comments System** - Engage with the community through discussions

## 🛠️ Tech Stack

**Frontend:** React 19, Tailwind CSS, Lucide Icons, Vite
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Authentication:** JWT, Bcrypt
**Deployment:** Vercel (Frontend), Render/Railway (Backend)

## 🎯 Purpose

WHEEL-MATE addresses the critical need for accessible location information by empowering users to crowdsource and share real-world accessibility data. The platform promotes inclusivity and independence for individuals with mobility challenges.

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Configure MongoDB connection in `.env`
4. Run `npm start` for backend and `npm run dev` for frontend
5. Access the application at `http://localhost:5173`

Detailed setup instructions are available in `COMPLETE-SETUP-GUIDE.md`.

## 📄 License

MIT License - Feel free to use this project for learning and development purposes.
A MERN (MongoDB, Express.js, React.js, Node.js) web application designed to provide real-time assistance to wheelchair users. The system features geolocation to find nearby accessible facilities, user-submitted ratings, login/registration, and a one-click emergency module.

This project was built as a mini-project to demonstrate a full-stack MERN application.

Core Features

User Authentication: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.

Find Facilities: Displays a list of nearby accessible facilities from a MongoDB database.

Geolocation (Mocked): Simulates finding a user's location to sort facilities by distance.

Add New Facilities: Logged-in users can contribute to the community by adding new accessible locations.

User Feedback: Users can leave a 1-5 star rating on any facility, which updates its average rating in real-time.

Emergency Module: A one-click page to quickly simulate calls to hospitals, police, or emergency contacts.

Fully Responsive UI: Built with Tailwind CSS, the application works on both desktop and mobile browsers.

🛠️ Tech Stack

Frontend:

React.js (with Vite): For a fast, modern user interface.

Tailwind CSS: For utility-first styling and responsiveness.

Lucide-React: For lightweight and clean icons.

Backend:

Node.js: JavaScript runtime for the server.

Express.js: Web framework for building the REST API.

Mongoose: Object Data Modeling (ODM) library for MongoDB.

Database:

MongoDB Atlas: A cloud-hosted NoSQL database.

Authentication:

JSON Web Tokens (JWT): For creating secure session tokens.

bcrypt.js: For hashing and comparing user passwords.

How to Run This Project Locally

To run this project on your local machine, you will need to run both the backend and frontend servers.

Prerequisites

Node.js (v18 or later)

Git

A MongoDB Atlas account (for the free cloud database)

1. Clone the Repository

2. Backend Setup

First, let's get the server and database running.

# 1. Navigate to the backend folder
cd wheel-mate-backend

# 2. Install all dependencies
npm install

# 3. Create your .env file
# (You can just rename the .env.example file)
# On Mac/Linux:
cp .env.example .env
# On Windows:
ren .env.example .env


4. Edit your .env file:

You must open the new .env file and add your secret keys. It should look like this:

PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/
JWT_SECRET=thisisareallybadsecretkeypleasereplaceme


MONGODB_URI: Get this from your MongoDB Atlas "Connect" dialog.

JWT_SECRET: Type any random, long string here.

5. Run the backend server:

npm run dev


The terminal should say:
MongoDB connected successfully.
Server running on http://localhost:5000

Leave this terminal running!

3. Frontend Setup

Now, let's run the React app.

Open a NEW terminal window.

# 1. Navigate to the frontend folder
# (From the root 'wheel-mate-project' folder)
cd wheel-mate-frontend

# 2. Install all dependencies
npm install

# 3. Create your .env file
# (This file just tells React where to find the backend)
# On Mac/Linux:
cp .env.example .env
# On Windows:
ren .env.example .env


The .env file for the frontend is simple and should already be correct:

VITE_API_URL=http://localhost:5000/api


4. Run the frontend app:

npm run dev


Your browser will automatically open to http://localhost:5173/ (or a similar port). You should see the Login Page.

You can now Register a new account, Log In, and use the full application!

Screenshots
Home page:
<img width="677" height="750" alt="Screenshot 2025-11-11 205010" src="https://github.com/user-attachments/assets/4483a609-9337-4a79-80ec-1ad2f4c6335e" />

Login page:
<img width="679" height="743" alt="Login-page png" src="https://github.com/user-attachments/assets/c69acdf1-2cd5-4769-89b3-a3ed16da40a6" />

Register page:
<img width="677" height="750" alt="Register-page png" src="https://github.com/user-attachments/assets/82135efc-462d-4d0e-912a-0a4a076f6676" />



