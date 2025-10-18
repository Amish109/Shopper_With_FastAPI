from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    products = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    product_collection = Column(Integer, ForeignKey("product_collection.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="items")
    product_collection = relationship("ProductCollection", back_populates="items")