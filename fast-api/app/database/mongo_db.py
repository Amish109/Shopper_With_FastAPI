from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
# Usage example :-
# user_collection = db["users"]  # "users" is the MongoDB collection name
# result = await user_collection.insert_one(user)





# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]
