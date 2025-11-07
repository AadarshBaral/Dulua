# 📍 PlaceDetail Component

A dynamic Next.js page that displays detailed information about a selected place.

## ✨ Features
- Fetches place data via **`getPlace()`** using `params.place_detail`
- Generates **SEO metadata** dynamically
- Displays:
  - Place images and description (Markdown supported)
  - Nearby local guides with contact info
  - Interactive map showing location
  - Reviews section with user feedback
- Uses tab navigation for **Details**, **Map**, and **Reviews**

## 🧱 Built With
- **Next.js (App Router)**
- **React Markdown** + **remark-gfm**
- **Tailwind CSS**
- **React Icons** & **Next/Image**
- **Custom components**: `Tabs`, `PlaceImageCard`, `Review`, `MapLoader`
