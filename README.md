# SlotSwapper ⏱️  
A Peer-to-Peer Time Slot Swapping Platform

SlotSwapper allows users to **create calendar events, mark them as swappable, and exchange time slots with others**.  
Designed for teams, students, and workplaces where scheduling flexibility matters.

---

## 🚀 Live Demo

🔗 **Frontend (Vercel):**  
https://slot-swapper-8xdhoe6j9-akshats-projects-a071b71d.vercel.app

🔗 **Backend (Render):**  
https://slot-swapper-backend-kon5.onrender.com


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
📂 Project Folder Structure
```
SLOT_SWAPPER/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── render.yaml
│   ├── README.md
│   └── .gitignore
│
└── frontend/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── EventForm.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Marketplace.jsx
    │   │   ├── Register.jsx
    │   │   ├── SwapModal.jsx
    │   │   └── SwapRequests.jsx
    │   │
    │   ├── config/
    │   │   └── api.js
    │   │
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── vercel.json
    └── .gitignore

```

---

## ⚙️ Environment Variables

### 👉 Backend (.env)

PORT=5000
MONGODB_URI=your_mongo_db_uri
JWT_SECRET=your_jwt_secret


## 👉 Frontend (.env)

VITE_API_URL=https://slot-swapper-backend.onrender.com


---

🔧 Installation & Setup (Local Development)

1️⃣ Clone the repository

```sh
git clone https://github.com/akshat0416/SlotSwapper.git
cd SlotSwapper
```


2️⃣ Backend Setup
```
cd backend
npm install
npm start
```

Backend will run on:
```
http://localhost:5000
```


3️⃣ Frontend Setup
```
cd ../frontend
npm install
npm run dev
```


The app will be available at:
```
http://localhost:5173/
```

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
