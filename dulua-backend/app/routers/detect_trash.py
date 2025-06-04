from fastapi import UploadFile, File, APIRouter
from typing import Annotated
import numpy as np
import cv2
from ultralytics import YOLO
import os

router = APIRouter()

# Model loading
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "best.pt")
model = YOLO(model_path)


@router.post("/", tags=["detect_trash"])
async def detect_trash(image: Annotated[UploadFile, File(description="Input image for detection")]):

    # read the stream of bytes
    contents = await image.read()

    # convert the bytes to a numpy array
    np_arr = np.frombuffer(contents, np.uint8)

    # convert the byte array into a proper OpenCV image (Numpy format) so it can be processed by yolo
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    results = model(img)

    # Visualize the results
    annotated = results[0].plot()

    # saving
    output_path = os.path.join(BASE_DIR, "annotated_image.jpg")
    cv2.imwrite(output_path, annotated)

    detected_class = set()

    for box in results[0].boxes:
        class_id = int(box.cls)  # Get class ID
        detected_class.add(results[0].names[class_id])

    return {
        "message": "Detection complete",
        "saved_path": output_path,
        "detected_class": list(detected_class)
    }
