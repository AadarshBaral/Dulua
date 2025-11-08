from pathlib import Path
import uuid
from fastapi import UploadFile, File, APIRouter, HTTPException
from typing import Annotated
import numpy as np
import cv2
from ultralytics import YOLO  # type: ignore
import os
from app.config import UPLOAD_DIR

router = APIRouter()

# Model loading
BASE_DIR = Path(__file__).resolve().parent
model_path = BASE_DIR / "best3.pt"
model = YOLO(model_path)

# ✅ /trash subfolder for annotated results
TRASH_DIR = UPLOAD_DIR / "trash"
TRASH_DIR.mkdir(parents=True, exist_ok=True)


async def detect_trash(file_name: str, file_bytes: bytes):
    """
    Runs YOLO trash detection on images or videos.
    Automatically distinguishes based on file extension and content type.
    Returns annotated file path and detected classes (if any).
    """

    # Get extension and sanitize name
    original_name, ext = os.path.splitext(file_name)
    safe_name = "".join(
        c for c in original_name if c.isalnum() or c in ("-", "_"))
    unique_suffix = uuid.uuid4().hex[:8]
    ext = ext.lower()
    unique_name = f"{safe_name}_annotated_{unique_suffix}{ext}"

    output_path = TRASH_DIR / unique_name
    detected_class = set()

    # --------------------------------------------------
    # 🖼️ IMAGE processing
    # --------------------------------------------------
    if ext in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        results = model(img)
        annotated = results[0].plot()
        cv2.imwrite(str(output_path), annotated)

        # Extract class names
        for box in results[0].boxes:
            class_id = int(box.cls)
            detected_class.add(results[0].names[class_id])

        return {
            "message": "Image detection complete",
            "type": "image",
            "saved_path": str(output_path.name),
            "detected_class": list(detected_class),
        }

    # --------------------------------------------------
    # 🎥 VIDEO processing
    # --------------------------------------------------
    elif ext in [".mp4", ".mov", ".avi", ".mkv", ".wmv"]:
        # Save temporarily for YOLO to read
        temp_path = TRASH_DIR / f"temp_{uuid.uuid4().hex[:8]}{ext}"
        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        # Run YOLO prediction on video file
        results = model.predict(source=str(temp_path), save=True)

        # YOLO automatically stores annotated video in runs/detect/predict*
        run_dir = Path(results[0].save_dir)
        annotated_videos = list(run_dir.glob("*.mp4"))
        if not annotated_videos:
            raise HTTPException(
                status_code=500, detail="YOLO did not produce annotated video")

        annotated_path = annotated_videos[0]
        final_path = output_path.with_suffix(".mp4")
        os.rename(annotated_path, final_path)

        # Collect detected classes across all frames
        for r in results:
            for box in r.boxes:
                class_id = int(box.cls)
                detected_class.add(r.names[class_id])

        # Cleanup temp file
        temp_path.unlink(missing_ok=True)

        return {
            "message": "Video detection complete",
            "type": "video",
            "saved_path": str(final_path.name),
            "detected_class": list(detected_class),
        }

    # --------------------------------------------------
    # ❌ Unsupported type
    # --------------------------------------------------
    else:
        raise HTTPException(
            status_code=400, detail=f"Unsupported file type: {ext}")
