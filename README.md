# 🧑‍💻 Social Meet — Jitsi Room Generator API

**Social Meet** is a Node.js backend that dynamically creates and manages Jitsi video conferencing rooms, tracks users, and supports room closure — perfect for building a lightweight meeting or collaboration platform.

> 💡 Originally forked. Now maintained and extended independently by [@hari2629-p](https://github.com/hari2629-p)

---

## 🚀 Features

- 🔐 Create and track users (email, name)
- 🎥 Generate secure Jitsi Meet video rooms
- 🧩 One-to-one and group call modes
- 📂 Store all data with MySQL using Sequelize ORM
- ⚙️ Built with modular Express + REST API structure

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL + Sequelize ORM
- **Auth/Notification Ready**: Firebase Admin SDK (optional)
- **Video Conferencing**: Jitsi Meet (public API)
- **Testing**: Thunder Client / Postman

---

## 📁 Folder Structure

social-meet/
├── app.js # Main entry point
├── .env # Environment config
├── configs/
│ └── db.js # Sequelize DB connection
├── controllers/ # Business logic
├── models/ # Sequelize models
├── routes/ # API route definitions
├── public/ # Static files (future frontend)
└── package.json


---

## 📦 Setup & Run Locally

1. **Clone the repo**:
   ```bash
   git clone https://github.com/hari2629-p/social-meet.git
   cd social-meet


2.Install dependencies:

npm install

3.Configure your environment (.env):

env
Copy
Edit
PORT=3000
DB_NAME=social_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306


4.Start the server:

bash
Copy
Edit
node app.js

📡 API Endpoints
Method	Route	Description
POST	/api/users	Create a new user
GET	/api/users	List all users
POST	/api/rooms	Create a Jitsi room
GET	/api/rooms	List active rooms
PATCH	/api/rooms/close/:room_id	Close a room


👨‍💻 Maintainer
Harigovind P Nair

📧 Email: www.hariatl10@gmail.com

📜 License
MIT License — free to use, extend, or contribute. Attribution appreciated!
