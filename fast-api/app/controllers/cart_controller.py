from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import Depends
from app.models.user import User
from app.models.carts import Cart
from app.models.product_collection import ProductCollection
from app.models.items import Item
from app.models.products import Product
from app.utils import ErrorResponse, SuccessResponse


# 🛒 Add to cart
async def add_to_cart(item_id: int, db: AsyncSession, current_user: User):
    try:
        # Check if the product exists
        result = await db.execute(select(Product).filter(Product.id == item_id))
        product = result.scalars().first()
        if not product:
            raise ErrorResponse(status_code=404, message="Product not found")
        # Create a new ProductCollection
        product_collection = ProductCollection()
        db.add(product_collection)
        await db.flush()  # ensures product_collection.id is available

        # Add the item to ProductCollection
        item = Item(product_id=product.id, product_collection_id=product_collection.id)
        db.add(item)
        await db.flush()

        # Add a cart entry for the user
        cart_entry = Cart(user_id=current_user.id, product_collection_id=product_collection.id)
        db.add(cart_entry)
        await db.commit()
        await db.refresh(cart_entry)

        return SuccessResponse(
            status=200,
            message="Cart updated successfully",
            data={"cart_id": cart_entry.id},
        )
    except Exception as e:
        print("❌ Error adding to cart:", e)
        await db.rollback()
        raise ErrorResponse(status_code=500, message="Something went wrong while adding to cart")


# 🧾 Get cart
async def get_cart(db: AsyncSession, current_user: User):
    try:
        result = await db.execute(select(Cart).filter(Cart.user_id == current_user.id))
        user_carts = result.scalars().unique().all()

        if not user_carts:
            return SuccessResponse(status=200, message="Cart is empty", data=[])

        cart_data = []
        for cart in user_carts:
            if not cart.product_collection:
                continue

            # Fetch all items in this product collection
            item_result = await db.execute(
                select(Item).filter(Item.product_collection_id == cart.product_collection_id)
            )
            items = item_result.scalars().all()

            product_list = []
            for item in items:
                if item.product:
                    product_list.append({
                        "id": item.product.id,
                        "name": item.product.name,
                        "image": item.product.image,
                        "category": item.product.category,
                        "new_price": float(item.product.new_price),
                        "old_price": float(item.product.old_price) if item.product.old_price else None,
                    })

            cart_data.append({
                "cart_id": cart.id,
                "products": product_list,
            })

        return SuccessResponse(status=200, message="Cart fetched successfully", data=cart_data)

    except Exception as e:
        print("❌ Error fetching cart:", e)
        raise ErrorResponse(status_code=500, message="Something went wrong while fetching the cart")


# ❌ Remove from cart
async def remove_from_cart(cart_id: int, db: AsyncSession, current_user: User):
    try:
        result = await db.execute(
            select(Cart).filter(Cart.id == cart_id, Cart.user_id == current_user.id)
        )
        cart_entry = result.scalars().first()

        if not cart_entry:
            raise ErrorResponse(status_code=404, message="Cart item not found")

        # Delete related items + product collection
        if cart_entry.product_collection_id:
            await db.execute(
                Item.__table__.delete().where(
                    Item.product_collection_id == cart_entry.product_collection_id
                )
            )
            await db.execute(
                ProductCollection.__table__.delete().where(
                    ProductCollection.id == cart_entry.product_collection_id
                )
            )

        await db.delete(cart_entry)
        await db.commit()

        return SuccessResponse(status=200, message="Cart item removed successfully")

    except Exception as e:
        print("❌ Error removing cart item:", e)
        await db.rollback()
        raise ErrorResponse(status_code=500, message="Something went wrong while removing cart item")
