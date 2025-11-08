# City Router API Documentation

## add_city()

**Method:** POST  
**Path:** `/add_city`  
**Authentication:** Not required

Adds a new city along with its geolocation details.  
Checks for existing geolocation with same coordinates before creating.  
Creates both Geolocation and City records in a single operation.

**Request Body:**
- `name` (string) - City name
- `latitude` (float) - Latitude coordinate
- `longitude` (float) - Longitude coordinate
- `description` (string) - City description

**Returns:** Success message with geo_location_id and city_id

**Note:** TODO - Need to implement threshold checking for nearby geolocations

---

## all_cities()

**Method:** GET  
**Path:** `/all_cities`  
**Authentication:** Not required

Retrieves the first city from the database.  
Returns basic city information with name from associated geolocation.

**Returns:** City ID and name

**Note:** TODO - Add support for multiple cities when scaling (currently returns only Pokhara as first city)

---

## get_city()

**Method:** GET  
**Path:** `/{city_id}`  
**Authentication:** Not required  
**Response Model:** PublicCity

Fetches detailed information about a specific city by ID.  
Includes complete geolocation data (coordinates and description).  
Returns 400 if city not found.

**Path Parameters:**
- `city_id` (UUID) - City's unique identifier

**Returns:** Complete city details including latitude, longitude, and description