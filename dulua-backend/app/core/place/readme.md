# Place Router API Documentation

## add_place()

**Method:** POST  
**Path:** `/add_place`  
**Authentication:** Required (JWT token)  
**Role:** Admin only

Adds a new place with geolocation, categories, and featured images.  
Creates geolocation record and handles category creation if they don't exist.  
Validates image formats (jpg, jpeg, png only).

**Form Parameters:**
- `name` (string) - Place name
- `latitude` (float) - Latitude coordinate
- `longitude` (float) - Longitude coordinate
- `description` (string) - Place description
- `city_id` (UUID) - Associated city ID
- `category` (List[CategoryEnum]) - List of category names
- `featured` (boolean) - Whether place is featured (default: False)
- `featured_image_main` (file) - Main featured image (required)
- `featured_image_secondary` (file) - Secondary featured image (optional)

**Returns:** Place ID, image filenames, and newly created categories

---

## add_category()

**Method:** POST  
**Path:** `/add_category`  
**Authentication:** Required (JWT token)  
**Role:** Admin only

Adds a new category to the system.  
Returns 400 if category with same name already exists.

**Request Body:**
- `name` (string) - Category name

**Returns:** Success message with category details

---

## get_place()

**Method:** GET  
**Path:** `/get_place/{place_id}`  
**Authentication:** Not required  
**Response Model:** PublicPlace

Fetches detailed information about a specific place.  
Includes city, geolocation, categories, and aggregated review ratings.  
Calculates average cleanliness and place ratings from all reviews.

**Path Parameters:**
- `place_id` (UUID) - Place's unique identifier

**Returns:** Complete place details with average ratings and full image URLs

---

## add_review()

**Method:** POST  
**Path:** `/add_review`  
**Authentication:** Required (JWT token)

Adds a new review with optional images for a place.  
Performs trash detection on uploaded images using YOLO model.  
Awards green points (+1 per image) and tracks user contributions.  
Supports both image and video uploads.

**Form Parameters:**
- `place_id` (string) - Place UUID
- `rating` (integer) - Place rating (1-5)
- `cleanliness` (integer) - Cleanliness rating (1-5)
- `comment` (string) - Review text
- `timestamp` (string) - ISO 8601 timestamp
- `images` (list[file]) - Optional review images/videos

**Returns:** Review details, trash detection results, and updated user stats

**Supported Formats:** jpg, jpeg, png, mp4, mov, avi, mkv

---

## get_reviews()

**Method:** GET  
**Path:** `/get_reviews/{place_id}`  
**Authentication:** Not required  
**Response Model:** List[ReviewPublic]

Retrieves all reviews for a specific place.  
Includes user profile images, normal images, and trash detection data.  
Separates regular images from trash-detected images with class labels.

**Path Parameters:**
- `place_id` (UUID) - Place's unique identifier

**Returns:** List of reviews with images, trash flags, and detection metadata

---

## all_places()

**Method:** GET  
**Path:** `/all_places`  
**Authentication:** Not required  
**Response Model:** List[PublicPlace]

Retrieves all places in the system.  
Includes aggregated review ratings for each place.  
Returns complete place details with categories and images.

**Returns:** List of all places with average cleanliness and place ratings

---

## toggle_bookmark()

**Method:** POST  
**Path:** `/bookmark`  
**Authentication:** Required (JWT token)

Toggles bookmark status for a place.  
Adds bookmark if it doesn't exist, removes it if it does.

**Request Body:**
- `place_id` (UUID) - Place to bookmark/unbookmark

**Returns:** Status ("added" or "removed") with place_id

---

## is_bookmarked()

**Method:** GET  
**Path:** `/is_bookmarked/{place_id}`  
**Authentication:** Required (JWT token)

Checks if the current user has bookmarked a specific place.

**Path Parameters:**
- `place_id` (UUID) - Place to check

**Returns:** Boolean indicating bookmark status

---

## get_bookmarks()

**Method:** GET  
**Path:** `/bookmarks`  
**Authentication:** Required (JWT token)  
**Response Model:** List[PublicPlace]

Retrieves all bookmarked places for the current user.  
Returns complete place details including categories and images.  
Returns 404 if no bookmarks found.

**Returns:** List of bookmarked places with full details