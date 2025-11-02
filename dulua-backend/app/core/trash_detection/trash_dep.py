from pathlib import Path
import uuid
from fastapi import UploadFile, File, APIRouter
from typing import Annotated
import numpy as np
import cv2
from ultralytics import YOLO  # type: ignore
import os
from app.config import UPLOAD_DIR
router = APIRouter()
# Model loading

BASE_DIR = Path(__file__).resolve().parent
model_path = BASE_DIR / "best.pt"
model = YOLO(model_path)

# ✅ Create /trash subfolder under the main reviews upload folder
TRASH_DIR = UPLOAD_DIR / "trash"
TRASH_DIR.mkdir(parents=True, exist_ok=True)


async def detect_trash(image_name: str, image_bytes: bytes):
    # Convert bytes to numpy array
    np_arr = np.frombuffer(image_bytes, np.uint8)

    # Decode to OpenCV format
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Run detection
    results = model(img)

    # Visualize detection results
    annotated = results[0].plot()

    # ✅ Build a safe, unique file name based on original image
    original_name, ext = os.path.splitext(image_name)
    safe_name = "".join(
        c for c in original_name if c.isalnum() or c in ("-", "_"))
    unique_name = f"{safe_name}_annotated_{uuid.uuid4().hex[:8]}{ext}"

    output_path = TRASH_DIR / unique_name
    cv2.imwrite(str(output_path), annotated)

    # ✅ Collect detected classes
    detected_class = set()
    for box in results[0].boxes:
        class_id = int(box.cls)
        detected_class.add(results[0].names[class_id])

    return {
        "message": "Detection complete",
        "saved_path": str(output_path.name),
        "detected_class": list(detected_class)
    }
