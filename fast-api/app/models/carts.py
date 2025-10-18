from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Cart(Base):
    __tablename__ = "carts"
    
    id = Column(Integer, primary_key=True, index=True)
    users = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    product_collection = Column(Integer, ForeignKey("product_collection.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="carts")
    product_collection = relationship("ProductCollection", back_populates="carts")