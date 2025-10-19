import cloudinary
import cloudinary.uploader
# import os
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
    
    # cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    # api_key=os.getenv("CLOUDINARY_API_KEY"),
    # api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

async def upload_to_cloudinary(file_path: str):
    try:
        result = cloudinary.uploader.upload(file_path)
        return {"url": result["secure_url"], "public_id": result["public_id"]}
    except Exception as e:
        print("Error uploading to Cloudinary:", e)
        return {"url": "Error", "public_id": None}

async def delete_from_cloudinary(public_id: str):
    try:
        cloudinary.uploader.destroy(public_id)
        return True
    except Exception as e:
        print("Error deleting Cloudinary asset:", e)
        return False
