import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    Boolean,
    DateTime,
    Text,
    JSON,
    ForeignKey,
    Index
)
from sqlalchemy.orm import relationship
from backend.database.base import Base, TimestampMixin, generate_uuid

# =========================================================================
# 1. USER & PROFILE MODEL
# =========================================================================
class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reg_number = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(32), index=True, nullable=False, default="Student")
    department = Column(String(128), nullable=False, default="Computer Science & Engineering")
    semester = Column(Integer, nullable=True)
    cgpa = Column(Numeric(3, 2), nullable=True)
    attendance_pct = Column(Numeric(5, 2), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    service_requests = relationship("ServiceRequest", back_populates="student", foreign_keys="ServiceRequest.student_id")
    approval_records = relationship("ApprovalRecord", back_populates="approver", foreign_keys="ApprovalRecord.approver_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reg_number": self.reg_number,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "department": self.department,
            "semester": self.semester,
            "cgpa": float(self.cgpa) if self.cgpa else None,
            "attendance_pct": float(self.attendance_pct) if self.attendance_pct else None,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

# =========================================================================
# 2. UNIFIED SERVICE REQUEST MODEL
# =========================================================================
class ServiceRequest(Base, TimestampMixin):
    __tablename__ = "service_requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tracking_code = Column(String(32), unique=True, index=True, nullable=False)
    request_type = Column(String(32), index=True, nullable=False)  # 'LAB_BOOKING', 'CERTIFICATE', 'MAINTENANCE', 'GRIEVANCE'
    student_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(String(32), index=True, nullable=False, default="SUBMITTED")  # 'Draft', 'Waiting for approval', 'Approved', 'In progress', 'Completed', 'Rejected'
    risk_level = Column(String(16), nullable=False, default="LOW")  # 'LOW', 'MEDIUM', 'HIGH'
    assigned_approver_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    sla_deadline = Column(DateTime, nullable=True)
    is_anonymous = Column(Boolean, default=False, nullable=False)
    payload = Column(JSON, nullable=False, default=dict)
    resolution_notes = Column(Text, nullable=True)

    # Relationships
    student = relationship("User", foreign_keys=[student_id], back_populates="service_requests")
    approver = relationship("User", foreign_keys=[assigned_approver_id])
    approval_records = relationship("ApprovalRecord", back_populates="request", cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "tracking_code": self.tracking_code,
            "request_type": self.request_type,
            "student_id": self.student_id,
            "status": self.status,
            "risk_level": self.risk_level,
            "assigned_approver_id": self.assigned_approver_id,
            "sla_deadline": self.sla_deadline.isoformat() if self.sla_deadline else None,
            "is_anonymous": self.is_anonymous,
            "payload": self.payload,
            "resolution_notes": self.resolution_notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

# =========================================================================
# 3. APPROVAL RECORD MODEL (HITL ENGINE)
# =========================================================================
class ApprovalRecord(Base, TimestampMixin):
    __tablename__ = "approval_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("service_requests.id"), index=True, nullable=False)
    approver_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    decision = Column(String(32), nullable=False)  # 'APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED'
    justification = Column(Text, nullable=True)
    action_plan_snapshot = Column(JSON, nullable=True)
    decided_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    request = relationship("ServiceRequest", back_populates="approval_records")
    approver = relationship("User", foreign_keys=[approver_id], back_populates="approval_records")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "request_id": self.request_id,
            "approver_id": self.approver_id,
            "decision": self.decision,
            "justification": self.justification,
            "action_plan_snapshot": self.action_plan_snapshot,
            "decided_at": self.decided_at.isoformat() if self.decided_at else None,
        }

# =========================================================================
# 4. LAB & LAB BOOKING MODELS
# =========================================================================
class Lab(Base, TimestampMixin):
    __tablename__ = "labs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    lab_id = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    room_no = Column(String(64), nullable=False)
    building = Column(String(128), nullable=False)
    total_workstations = Column(Integer, nullable=False, default=30)
    gpu_nodes = Column(String(128), nullable=True)
    equipment = Column(String(255), nullable=True)
    prerequisites = Column(JSON, nullable=False, default=list)
    max_booking_hours = Column(Integer, nullable=False, default=3)
    is_active = Column(Boolean, default=True, nullable=False)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "lab_id": self.lab_id,
            "name": self.name,
            "room_no": self.room_no,
            "building": self.building,
            "total_workstations": self.total_workstations,
            "gpu_nodes": self.gpu_nodes,
            "equipment": self.equipment,
            "prerequisites": self.prerequisites,
            "max_booking_hours": self.max_booking_hours,
            "is_active": self.is_active,
        }

class LabBooking(Base, TimestampMixin):
    __tablename__ = "lab_bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(32), unique=True, index=True, nullable=False)
    request_id = Column(String(36), ForeignKey("service_requests.id"), nullable=True)
    lab_id = Column(String(32), ForeignKey("labs.lab_id"), index=True, nullable=False)
    student_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    student_name = Column(String(255), nullable=False)
    date = Column(String(16), index=True, nullable=False)  # 'YYYY-MM-DD'
    start_time = Column(String(8), nullable=False)         # '14:00'
    end_time = Column(String(8), nullable=False)           # '16:00'
    purpose = Column(String(255), nullable=False)
    status = Column(String(32), nullable=False, default="APPROVED")
    approver_name = Column(String(255), nullable=True)
    access_pass_code = Column(String(64), unique=True, nullable=False)
    qr_payload = Column(Text, nullable=False)

    # Indexes
    __table_args__ = (
        Index("idx_lab_slot", "lab_id", "date", "start_time", "end_time"),
    )

# =========================================================================
# 5. KNOWLEDGE DOCUMENTS & VECTOR CHUNKS (RAG PIPELINE)
# =========================================================================
class KnowledgeDocument(Base, TimestampMixin):
    __tablename__ = "knowledge_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    category = Column(String(64), index=True, nullable=False)
    effective_year = Column(Integer, index=True, nullable=False, default=2025)
    chunk_count = Column(Integer, nullable=False, default=0)
    vector_dim = Column(Integer, nullable=False, default=768)
    status = Column(String(16), index=True, nullable=False, default="ACTIVE")  # 'ACTIVE', 'DEPRECATED'
    uploaded_by = Column(String(255), nullable=True)

    # Relationships
    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "effective_year": self.effective_year,
            "chunk_count": self.chunk_count,
            "vector_dim": self.vector_dim,
            "status": self.status,
            "uploaded_by": self.uploaded_by,
            "uploaded_at": self.created_at.isoformat() if self.created_at else None,
        }

class KnowledgeChunk(Base, TimestampMixin):
    __tablename__ = "knowledge_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("knowledge_documents.id"), index=True, nullable=False)
    page_number = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(JSON, nullable=True)  # Stored as JSON float array or pgvector
    similarity_weight = Column(Numeric(4, 3), nullable=True, default=1.0)

    # Relationships
    document = relationship("KnowledgeDocument", back_populates="chunks")

# =========================================================================
# 6. IMMUTABLE AUDIT LOG MODEL
# =========================================================================
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(64), index=True, nullable=True)
    actor_role = Column(String(32), index=True, nullable=True)
    action_type = Column(String(64), index=True, nullable=False)
    request_id = Column(String(64), index=True, nullable=True)
    ip_address = Column(String(45), nullable=True)
    details = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True, nullable=False)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "audit_id": f"AUD-{self.id[:5].upper()}",
            "actor_id": self.actor_id,
            "actor_role": self.actor_role,
            "action_type": self.action_type,
            "request_id": self.request_id,
            "ip_address": self.ip_address,
            "details": self.details,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

# =========================================================================
# 7. NOTIFICATION MODEL
# =========================================================================
class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(32), nullable=False, default="SYSTEM")
    is_read = Column(Boolean, default=False, index=True, nullable=False)
    link_path = Column(String(255), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "category": self.category,
            "is_read": self.is_read,
            "link_path": self.link_path,
            "timestamp": self.created_at.isoformat() if self.created_at else None,
        }
