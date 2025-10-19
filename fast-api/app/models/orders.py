from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    payment_status = Column(String(20), default='pending', server_default='pending')
    product_collection_id = Column(Integer, ForeignKey("product_collection.id", ondelete="SET NULL"), nullable=True)
    
    # ✅ Relationships
    user = relationship("User", back_populates="orders")
    product_collection = relationship("ProductCollection", back_populates="orders")
