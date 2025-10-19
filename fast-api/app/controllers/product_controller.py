from fastapi import UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.products import Product
from app.models.user import User
from app.utils.cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary
import shutil
import os
from app.utils import ErrorResponse, SuccessResponse

async def add_product(name: str, category: str, new_price: float, old_price: float, file: UploadFile, db: AsyncSession = Depends(get_db)):
    temp_path = f"temp_{file.filename}"
    try:
        # Save file locally
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Upload to Cloudinary
        result = await upload_to_cloudinary(temp_path)
        if result["url"] == "Error":
            os.remove(temp_path)
            raise ErrorResponse(status_code=400, message="Failed to upload file, try again")

        product = Product(
            name=name,
            image=result["url"],
            category=category,
            new_price=new_price,
            old_price=old_price,
        )
        db.add(product)
        await db.commit()
        await db.refresh(product)
        os.remove(temp_path)
        return SuccessResponse(status=200, message="Product added successfully", data={"id": product.id})
    except Exception as e:
        print("Error adding product:", e)
        await db.rollback()
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if "public_id" in locals():
            await delete_from_cloudinary(result["public_id"])
        raise ErrorResponse(status_code=400, message="Error adding product")

async def remove_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()

    if not product:
        raise ErrorResponse(status_code=404, message="Product not found")

    await db.delete(product)
    await db.commit()
    return SuccessResponse(status=200, message="Product removed successfully")

async def get_all_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return SuccessResponse(status=200, message="Products fetched", data=products)

async def new_collection(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).order_by(Product.id.desc()).limit(20)
    )
    products = result.scalars().all()
    return SuccessResponse(status=200, message="New collection fetched", data=products)

async def popular_in_women(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).filter(Product.category == "women").limit(4)
    )
    products = result.scalars().all()
    return SuccessResponse(status=200, message="Popular in women", data=products)
