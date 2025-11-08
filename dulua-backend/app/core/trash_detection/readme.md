# Trash Detection Router API Documentation

## detect_trash()

**Method:** POST  
**Path:** `/`  
**Authentication:** Not required  
**Tags:** detect_trash

Performs real-time trash detection on uploaded images using a pre-trained YOLO (You Only Look Once) object detection model. The endpoint processes the image, identifies trash objects, generates an annotated visualization with bounding boxes, and returns detection results along with the saved annotated image path.

**File Parameter:**
- `image` (UploadFile) - Input image file for trash detection analysis

**Processing Pipeline:**

1. **Image Reception & Conversion**
   - Reads uploaded image as byte stream
   - Converts bytes to numpy array using `np.frombuffer()`
   - Decodes byte array into OpenCV-compatible BGR image format

2. **YOLO Model Inference**
   - Runs YOLO object detection model on the processed image
   - Identifies trash objects and their bounding box coordinates
   - Extracts class IDs and confidence scores for detected objects

3. **Result Visualization**
   - Generates annotated image with bounding boxes around detected trash
   - Adds class labels and confidence scores to visualization
   - Uses YOLO's built-in `plot()` method for annotation

4. **Image Storage**
   - Sanitizes original filename (keeps only alphanumeric, hyphens, and underscores)
   - Generates unique filename using 8-character UUID hex to prevent collisions
   - Saves annotated image to the model's base directory using OpenCV's `imwrite()`

5. **Class Extraction**
   - Iterates through all detected bounding boxes
   - Extracts class IDs and maps them to human-readable class names
   - Uses `set()` to remove duplicate class names across multiple detections

**Returns:**
- `message` (string) - Confirmation message: "Detection complete"
- `saved_path` (string) - Absolute file path to the saved annotated image
- `detected_class` (list[string]) - Unique list of detected trash category names (e.g., ["plastic_bottle", "food_wrapper"])

**Model Details:**
- **Model Type:** YOLO (Ultralytics)
- **Model File:** `best3.pt` (located in the same directory as the router)
- **Model Loading:** Loaded once at module initialization for efficiency

**Output Filename Format:**  
`{sanitized_original_name}_{8_char_uuid}{original_extension}`

**Example:** `photo_abc12345.jpg` → `photo_a1b2c3d4.jpg`

**Storage Location:** Annotated images are saved in the same directory as the YOLO model file (`BASE_DIR`)

**Supported Image Formats:** Any format supported by OpenCV (jpg, jpeg, png, bmp, tiff, etc.)

**Use Cases:**
- Environmental monitoring and cleanliness assessment
- Automated trash detection in review images
- Real-time waste identification for sustainability tracking
- Integration with place review systems to flag littered locations

**Performance Notes:**
- Image processing is asynchronous for better performance
- Model inference runs synchronously (YOLO limitation)
- Unique filenames prevent file overwrites in concurrent requests