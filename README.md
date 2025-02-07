# **📅 Real-Time Event Management Platform**  

## **🚀 Overview**  
This is a **real-time event management platform** where users can join or leave events, and the attendee count updates live using **Socket.IO**.  

---

## **🛠 Tech Stack**  
### **Backend:**  
- **Node.js + Express.js** - Server and API  
- **MongoDB + Mongoose** - Database  
- **Socket.IO** - Real-time updates  

### **Frontend:**  
- **React.js** - User Interface  
- **Socket.IO Client** - Real-time data updates  
- **Axios** - API calls  

---

## **📂 Project Structure**  
```
📂 event-management/
│── 📂 backend/ (Node.js + Express)
│   │── 📜 server.js
│   │── 📂 config/
│   │   └── 📜 db.js
│   │── 📂 models/
│   │   ├── 📜 User.js
│   │   ├── 📜 Event.js
│   │── 📂 routes/
│   │   ├── 📜 eventRoutes.js
│   │── 📂 middleware/
│── 📂 frontend/ (React.js)
│   │── 📜 src/
│   │   ├── 📜 App.js
│   │   ├── 📜 index.js
│── 📜 .env
│── 📜 package.json
│── 📜 README.md
```

---

## **🛠 Setup Instructions**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/imchiranjit/EventManagement.git
cd EventManagement
```

---

## **🔹 Backend Setup**  
### **2️⃣ Install Dependencies**  
```sh
cd backend
npm install
```

### **3️⃣ Create `.env` File**  
```sh
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### **4️⃣ Start Backend Server**  
```sh
npm run dev
```

---

## **🔹 Frontend Setup**  
### **5️⃣ Install Dependencies**  
```sh
cd ../frontend
npm install
```

### **6️⃣ Start Frontend Server**  
```sh
npm run dev
```

---

## **🛠 API Endpoints**  

### **📌 Get All Events**  
```
GET /api/events
```
📤 **Response:**  
```json
[
  {
    "_id": "65a1f8c2ab1cd01234567890",
    "name": "Tech Conference",
    "attendees": 25
  }
]
```

### **📌 Join Event**  
```
POST /api/events/:eventId/join
```
📥 **Body:**  
```json
{
  "userId": "65a1f8c2ab1cd01234567890"
}
```

### **📌 Leave Event**  
```
POST /api/events/:eventId/leave
```
📥 **Body:**  
```json
{
  "userId": "65a1f8c2ab1cd01234567890"
}
```

---

## **🛠 Real-Time Updates with Socket.IO**  
- **When a user joins/leaves an event**, the attendee count **updates in real-time** across all connected clients.  
- **Socket Event:**  
```json
{
  "eventId": "65a1f8c2ab1cd01234567890",
  "attendees": 26
}
```

---

## **🚀 Features**  
✅ **User Registration & Login**
✅ **Real-time Attendee Count**  
✅ **Join & Leave Events Instantly**  
✅ **Fully Responsive UI**  

---

## **📜 License**  
This project is licensed under the **MIT License**.  

---

