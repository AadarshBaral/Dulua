# User Profile Router API Documentation

## get_user_profile()

**Method:** GET  
**Path:** `/userprofile/{user_profile_id}`  
**Authentication:** Not required

Fetches user profile details by profile ID.  
Includes contribution count, green points, and bookmarked places.  
Returns 404 if profile not found.

**Path Parameters:**
- `user_profile_id` (UUID) - User profile's unique identifier

**Returns:** Profile details with bookmarked place IDs

---

## get_user_profile_by_user_id()

**Method:** GET  
**Path:** `/{user_id}`  
**Authentication:** Not required

Fetches user profile details by user database ID.  
Includes handle, image, contributions, green points, and bookmarked places.  
Returns complete bookmarked place information with titles and descriptions.

**Path Parameters:**
- `user_id` (UUID) - User database ID

**Returns:** Complete profile with detailed bookmarked places information

---

## update_user_profile_image()

**Method:** PUT  
**Path:** `/{user_id}`  
**Authentication:** Not required

Updates user profile image.  
Saves uploaded image to local storage with user-specific filename.  
Stores public URL path for frontend access.

**Path Parameters:**
- `user_id` (UUID) - User database ID

**Form Parameters:**
- `image` (file, optional) - Profile image file

**Returns:** Updated user profile object

**Upload Directory:** `uploads/profile_images/`

---

## get_profile_image_by_user_id()

**Method:** GET  
**Path:** `/{user_id}/image`  
**Authentication:** Not required

Retrieves the profile image URL for a specific user.  
Returns 404 if profile or image not found.

**Path Parameters:**
- `user_id` (UUID) - User database ID

**Returns:** Profile image URL

**Note:** There's a typo in the return statement - `profile.iamge` should be `profile.image`