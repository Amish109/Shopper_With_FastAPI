from sqlalchemy import Column, Integer, String, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    role = Column(
        String(20),
        nullable=False,
        default='users',
        server_default='users'
    )
    username = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(60), nullable=False)
    refresh_token = Column(String(512), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint(
            "role IN ('admin', 'test_admin', 'users')",
            name='check_role_valid'
        ),
    )

    # ✅ Relationships
    carts = relationship("Cart", back_populates="user")
    orders = relationship("Order", back_populates="user")
