from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import Depends,Response, Request
from app.models.user import User
from app.models.carts import Cart
from app.models.product_collection import ProductCollection
from app.models.items import Item
from app.models.products import Product
from app.utils import ErrorResponse, SuccessResponse

async def add_to_cart(item_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        current_user = request.state.user

        # 1️⃣ Check if product exists
        result = await db.execute(select(Product).filter(Product.id == item_id))
        product = result.scalars().first()
        if not product:
            raise ErrorResponse(status_code=404, message="Product not found")

        # 2️⃣ Check if user already has a cart
        existing_cart_query = await db.execute(
            select(Cart).filter(Cart.user_id == current_user.id)
        )
        existing_cart = existing_cart_query.scalars().first()

        if not existing_cart:
            # 3️⃣ Create a new product collection
            new_collection = ProductCollection()
            db.add(new_collection)
            await db.flush()  # to get new_collection.id

            # 4️⃣ Create a new cart linked to user and collection
            new_cart = Cart(
                user_id=current_user.id,
                product_collection_id=new_collection.id
            )
            db.add(new_cart)
            await db.flush()

            # 5️⃣ Add product as a new item
            new_item = Item(
                product_id=product.id,
                product_collection_id=new_collection.id
            )
            db.add(new_item)
            await db.commit()

            return SuccessResponse(
                status=200,
                message="New cart created and product added successfully",
                data={
                    "cart_id": new_cart.id,
                    "product_id": product.id,
                    "collection_id": new_collection.id
                },
            )

        else:
            # 6️⃣ User already has a cart → add product to same collection (even if same product already exists)
            collection_id = existing_cart.product_collection_id

            new_item = Item(
                product_id=product.id,
                product_collection_id=collection_id
            )
            db.add(new_item)
            await db.commit()

            return SuccessResponse(
                status=200,
                message="Product added to existing cart successfully",
                data={
                    "cart_id": existing_cart.id,
                    "product_id": product.id,
                    "collection_id": collection_id
                },
            )

    except ErrorResponse as e:
        raise e
    except Exception as e:
        await db.rollback()
        raise ErrorResponse(status_code=500, message=f"Internal Server Error: {str(e)}")


# 🧾 Get user's cart
async def get_cart(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        current_user = request.state.user

        # 1️⃣ Get user's cart
        cart_result = await db.execute(
            select(Cart).filter(Cart.user_id == current_user.id)
        )
        cart = cart_result.scalars().first()

        if not cart:
            return SuccessResponse(status=200, message="Cart is empty", data=[])

        # 2️⃣ Get product collection for this cart
        collection_id = cart.product_collection_id
        if not collection_id:
            return SuccessResponse(status=200, message="Cart is empty", data=[])

        # 3️⃣ Get all items linked to this collection
        items_result = await db.execute(
            select(Item).filter(Item.product_collection_id == collection_id)
        )
        items = items_result.scalars().all()

        if not items:
            return SuccessResponse(status=200, message="Cart is empty", data=[])

        # 4️⃣ For each item, get product details
        product_list = []
        for item in items:
            if item.product:  # relationship: Item → Product
                product_list.append({
                    "item_id": item.id,
                    "product_id": item.product.id,
                    "name": item.product.name,
                    "image": item.product.image,
                    "category": item.product.category,
                    "new_price": float(item.product.new_price),
                    "old_price": float(item.product.old_price) if item.product.old_price else None,
                })

        # 5️⃣ Final response
        return SuccessResponse(
            status=200,
            message="Cart fetched successfully",
            data=[{
                "cart_id": cart.id,
                "collection_id": collection_id,
                "products": product_list
            }]
        )

    except Exception as e:
        print("❌ Error fetching cart:", e)
        raise ErrorResponse(status_code=500, message=f"Something went wrong while fetching the cart: {str(e)}")

# ❌ Remove one product from user's cart
async def remove_from_cart(item_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        current_user = request.state.user

        # 1️⃣ Find user's cart
        cart_result = await db.execute(
            select(Cart).filter(Cart.user_id == current_user.id)
        )
        cart = cart_result.scalars().first()
        if not cart:
            raise ErrorResponse(status_code=404, message="Cart not found")

        # 2️⃣ Get the user's collection
        collection_id = cart.product_collection_id
        if not collection_id:
            raise ErrorResponse(status_code=400, message="No product collection found for this cart")

        # 3️⃣ Check if the item exists in that collection
        item_result = await db.execute(
            select(Item).filter(
                Item.id == item_id,
                Item.product_collection_id == collection_id
            )
        )
        item = item_result.scalars().first()

        if not item:
            raise ErrorResponse(status_code=404, message="Item not found in cart")

        # 4️⃣ Delete that specific item
        await db.delete(item)
        await db.flush()

        # 5️⃣ Check if collection has any more items
        remaining_items_result = await db.execute(
            select(Item).filter(Item.product_collection_id == collection_id)
        )
        remaining_items = remaining_items_result.scalars().all()

        # 6️⃣ If collection is empty, remove collection and cart too
        if not remaining_items:
            await db.execute(
                ProductCollection.__table__.delete().where(
                    ProductCollection.id == collection_id
                )
            )
            await db.delete(cart)

        # 7️⃣ Commit all changes
        await db.commit()

        return SuccessResponse(
            status=200,
            message="Item removed successfully from cart",
            data={
                "removed_item_id": item_id,
                "cart_id": cart.id,
                "collection_id": collection_id,
                "cart_deleted": not remaining_items
            },
        )

    except ErrorResponse as e:
        raise e
    except Exception as e:
        await db.rollback()
        raise ErrorResponse(status_code=500, message=f"Something went wrong: {str(e)}")