# 🌍 Dulua – Travel App with YOLO-Based Trash Detection

**Dulua** is a smart travel companion crafted to enhance your Pokhara adventures while promoting clean and sustainable tourism. With real-time trash detection powered by YOLOv8, curated local recommendations, and guide booking features, Dulua blends travel planning with environmental responsibility.

---

## 🚀 Project Overview

**Dulua** is a web application built to:

- Showcase curated local attractions and experiences
- Enable AI-based trash detection from user-uploaded photos
- Support local guides through visibility and bookings
- Offer personalized roadmaps for efficient travel planning
- Encourage eco-conscious travel through real-time feedback

---

## 👤 Target Users

- Tourists exploring Pokhara
- Backpackers and nature enthusiasts
- Local guides seeking promotion
- Environmentally conscious travelers

---

## 🎯 Key Features

| Feature                         | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| 🔍 Place Discovery              | Find trending spots using maps and filters                        |
| 🤖 Trash Detection (YOLOv8)     | Detect litter in images and evaluate cleanliness levels           |
| ✍ User Reviews & Ratings       | Leave feedback with text and photos                               |
| 🗺️ Custom Roadmaps              | 1-day to 3-day curated tours with descriptions and time estimates |
| 🧑‍✈️ Guide Registration & Booking | Connect with verified local guides                                |
| 🌐 Interactive Maps             | Navigation with LeafletJS & OpenStreetMap                         |
| 📊 Admin Insights (Optional)    | Monitor cleanliness scores and user trends                        |

---

## 🧠 YOLO Trash Detection Flow

1. User uploads a photo
2. YOLOv8 model detects visible trash
3. Output shows:
   - ✅ **Clean Image**
   - ⚠ **Trash Detected**
4. Cleanliness insights are added to place profiles
5. Data helps users and city officials track litter hotspots

---

## 🛠 Tech Stack

| Component       | Technology                |
| --------------- | ------------------------- |
| Frontend        | Next.js                   |
| Backend         | FastAPI                   |
| Database        | PostgreSQL                |
| Detection       | YOLOv8 (Ultralytics)      |
| Map Integration | LeafletJS + OpenStreetMap |
| Auth            | Google, Facebook, Email   |
| Hosting         | AWS                       |

---

## 🧭 Roadmap Feature

Tourists can choose pre-built itineraries like:

- **1-Day Highlights Tour**
- **3-Day Nature & Hiking Retreat**
- **Local Food Discovery Walk**

Each includes:

- Optimized route & timing
- Place descriptions & travel tips
- Trash status per location

---

## 📚 Dataset

**TACO (Trash Annotations in Context)**
Used for YOLOv8 model training. Contains 1,500+ annotated images across various trash types.

---

## 👨‍💻 Team Dulua

- **Aadarsh Baral**
- **Pawan Dhoj Adhikari**
- **Sabin Poudel**

---

## 📜 License

**MIT License** – Free to use, improve, and expand.
