from sqlalchemy import Column, Integer, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class ProductCollection(Base):
    __tablename__ = "product_collection"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    items = relationship("Item", back_populates="product_collection")
    carts = relationship("Cart", back_populates="product_collection")
    orders = relationship("Order", back_populates="product_collection")