# SlotSwapper ⏱️  
A Peer-to-Peer Time Slot Swapping Platform

SlotSwapper allows users to **create calendar events, mark them as swappable, and exchange time slots with others**.  
Designed for teams, students, and workplaces where scheduling flexibility matters.

---

## 🚀 Live Demo

🔗 **Frontend (Vercel):**  
https://slot-swapper-8xdhoe6j9-akshats-projects-a071b71d.vercel.app

🔗 **Backend (Render):**  
https://slot-swapper-backend.onrender.com  

---

## 📌 Features

✅ User Authentication (Register/Login using JWT)  
✅ Create, update & delete calendar events  
✅ Mark event slots as `Swappable`  
✅ Explore marketplace to view swappable slots from others  
✅ Send & receive swap requests  
✅ Accept/Reject swap requests — updates both calendars  
✅ Fully responsive UI  

---

## 🛠️ Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React + Vite + Context API + Axios |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + bcrypt |
| Deployment | Frontend on Vercel, Backend on Render |

---

## 📁 Folder Structure

SlotSwapper/
├── backend/
│ ├── server.js
│ ├── package.json
│ └── .env
│
└── frontend/
├── src/
│ ├── components/
│ ├── contexts/
│ ├── config/api.js
│ ├── App.jsx
│ └── main.jsx
├── package.json
└── .env

---

## ⚙️ Environment Variables

### 👉 Backend (.env)

PORT=5000
MONGODB_URI=your_mongo_db_uri
JWT_SECRET=your_jwt_secret


### 👉 Frontend (.env)

VITE_API_URL=https://slot-swapper-backend.onrender.com


---

## 🔧 Installation & Setup (Local Development)

### 1️⃣ Clone the repository

```sh
git clone https://github.com/akshat0416/SlotSwapper.git
cd SlotSwapper



###2️⃣ Backend Setup

cd backend
npm install
npm start


Backend will run on:

http://localhost:5000



### 3️⃣ Frontend Setup

cd ../frontend
npm install
npm run dev



The app will be available at:

http://localhost:5173/


🤝 Contributing

Pull requests are welcome.

Steps to contribute:

1. Fork the repository

2. Create a feature branch

3. Commit your changes

4. Open a pull request


📄 License

This project is licensed under the MIT License.


✨ Developer

👤 Akshat Rana
🔗 GitHub: https://github.com/akshat0416