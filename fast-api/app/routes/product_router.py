from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.middleware.auth_jwt import verify_jwt
from app.controllers.product_controller import (
    add_product,
    remove_product,
    get_all_products,
    new_collection,
    popular_in_women,
)

from app.controllers.cart_controller import (
add_to_cart,
get_cart,
remove_from_cart as remove_cart ,
)

router = APIRouter(prefix="/api/product", tags=["Product"])

# Public routes
router.get("/newcollections")(new_collection)
router.get("/getProduct")(get_all_products)
router.get("/popularInWomen")(popular_in_women)

# Authenticated routes
router.post("/addToCart", dependencies=[Depends(verify_jwt)])(add_to_cart)
router.post("/getCart", dependencies=[Depends(verify_jwt)])(get_cart)
router.post("/removeCart", dependencies=[Depends(verify_jwt)])(remove_cart)

# Admin/Product management
router.post("/removeproduct")(remove_product)
router.post("/addProduct")(add_product)



# from fastapi import APIRouter, Depends, UploadFile, File, Form
# from typing import Optional
# from app.middleware.auth_jwt import verify_jwt
# from app.controllers.product_controller import (
#     add_product,
#     remove_product,
#     add_to_cart,
#     get_all_products,
#     new_collection,
#     popular_in_women,
#     get_cart,
#     remove_cart,
# )

# router = APIRouter(
#     prefix="/api/product",
#     tags=["Product"]
# )

# # Public Routes
# @router.get("/newcollections")
# async def get_new_collections():
#     return await new_collection()

# @router.get("/getProduct")
# async def get_products():
#     return await get_all_products()

# @router.get("/popularInWomen")
# async def get_popular_in_women():
#     return await popular_in_women()


# # Authenticated Routes
# @router.post("/addToCart")
# async def add_to_cart_route(
#     product_id: int = Form(...),
#     user=Depends(verify_jwt)
# ):
#     return await add_to_cart(user, product_id)


# @router.post("/getCart")
# async def get_cart_route(user=Depends(verify_jwt)):
#     return await get_cart(user)


# @router.post("/removeCart")
# async def remove_cart_route(
#     product_id: int = Form(...),
#     user=Depends(verify_jwt)
# ):
#     return await remove_cart(user, product_id)


# # Admin/Product Management
# @router.post("/removeproduct")
# async def remove_product_route(product_id: int = Form(...)):
#     return await remove_product(product_id)


# @router.post("/addProduct")
# async def add_product_route(
#     name: str = Form(...),
#     price: float = Form(...),
#     category: str = Form(...),
#     image: UploadFile = File(...),
# ):
#     return await add_product(name, price, category, image)
