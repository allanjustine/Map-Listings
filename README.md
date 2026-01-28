# 📍 Map Coordinate Listings

A modern React + Laravel Inertia application for saving, viewing, and managing map coordinates using **Leaflet.js**.

This app allows users to:
- Name the map
- Click on a map to add markers
- Save marker coordinates with a title
- Upload a custom marker icon (image)
- View all saved markers on the map
- Delete markers with confirmation
- Display toast notifications for success/error

---

## 🌟 Features

✅ **Name the Map**  
Users can set a title and description for the map.

✅ **Add Marker by Clicking on Map**  
Click anywhere on the map to add a new marker.

✅ **Save Marker with Title & Custom Icon**  
Each marker can have a name and optional custom icon image.

✅ **Upload Custom Marker Icon (2MB Limit)**  
Upload a marker icon image (PNG/JPG/JPEG) with max size **2MB**.

✅ **List All Coordinates on Map**  
Markers are loaded from the database and displayed on the map.

✅ **Delete Marker with Confirmation Dialog**  
Delete markers with a confirmation modal.

✅ **Flash Notifications using Sonner**  
Displays success and error toast notifications.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel |
| Frontend | React (Inertia) |
| Map | Leaflet.js |
| Notifications | Sonner |
| UI | Shadcn UI |

---

## 🚀 Installation

### 1. Clone repository
```bash
git clone https://github.com/allanjustine/Coordinate-Listings.git
cd Coordinate-Listings
composer install
php artisan key:generate
php artisan migrate
php artisan storage:link
composer run dev
