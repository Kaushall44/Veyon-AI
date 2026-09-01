"""Initial production schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-30 22:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('reg_number', sa.String(64), unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(32), nullable=False, server_default='Student'),
        sa.Column('department', sa.String(128), nullable=False, server_default='Computer Science & Engineering'),
        sa.Column('semester', sa.Integer(), nullable=True),
        sa.Column('cgpa', sa.Numeric(3, 2), nullable=True),
        sa.Column('attendance_pct', sa.Numeric(5, 2), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_users_reg_number', 'users', ['reg_number'])
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_role', 'users', ['role'])

    # 2. Service Requests
    op.create_table(
        'service_requests',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('tracking_code', sa.String(32), unique=True, nullable=False),
        sa.Column('request_type', sa.String(32), nullable=False),
        sa.Column('student_id', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('status', sa.String(32), nullable=False, server_default='SUBMITTED'),
        sa.Column('risk_level', sa.String(16), nullable=False, server_default='LOW'),
        sa.Column('assigned_approver_id', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('sla_deadline', sa.DateTime(), nullable=True),
        sa.Column('is_anonymous', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('payload', sa.JSON(), nullable=False),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_service_requests_tracking_code', 'service_requests', ['tracking_code'])
    op.create_index('ix_service_requests_request_type', 'service_requests', ['request_type'])
    op.create_index('ix_service_requests_status', 'service_requests', ['status'])

    # 3. Approval Records
    op.create_table(
        'approval_records',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('request_id', sa.String(36), sa.ForeignKey('service_requests.id'), nullable=False),
        sa.Column('approver_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('decision', sa.String(32), nullable=False),
        sa.Column('justification', sa.Text(), nullable=True),
        sa.Column('action_plan_snapshot', sa.JSON(), nullable=True),
        sa.Column('decided_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_approval_records_request_id', 'approval_records', ['request_id'])
    op.create_index('ix_approval_records_approver_id', 'approval_records', ['approver_id'])

    # 4. Labs & Lab Bookings
    op.create_table(
        'labs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('lab_id', sa.String(32), unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('room_no', sa.String(64), nullable=False),
        sa.Column('building', sa.String(128), nullable=False),
        sa.Column('total_workstations', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('gpu_nodes', sa.String(128), nullable=True),
        sa.Column('equipment', sa.String(255), nullable=True),
        sa.Column('prerequisites', sa.JSON(), nullable=False),
        sa.Column('max_booking_hours', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_labs_lab_id', 'labs', ['lab_id'])

    op.create_table(
        'lab_bookings',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('booking_id', sa.String(32), unique=True, nullable=False),
        sa.Column('request_id', sa.String(36), sa.ForeignKey('service_requests.id'), nullable=True),
        sa.Column('lab_id', sa.String(32), sa.ForeignKey('labs.lab_id'), nullable=False),
        sa.Column('student_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('student_name', sa.String(255), nullable=False),
        sa.Column('date', sa.String(16), nullable=False),
        sa.Column('start_time', sa.String(8), nullable=False),
        sa.Column('end_time', sa.String(8), nullable=False),
        sa.Column('purpose', sa.String(255), nullable=False),
        sa.Column('status', sa.String(32), nullable=False, server_default='APPROVED'),
        sa.Column('approver_name', sa.String(255), nullable=True),
        sa.Column('access_pass_code', sa.String(64), unique=True, nullable=False),
        sa.Column('qr_payload', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_lab_bookings_booking_id', 'lab_bookings', ['booking_id'])
    op.create_index('ix_lab_bookings_date', 'lab_bookings', ['date'])

    # 5. Knowledge Documents & Chunks
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('category', sa.String(64), nullable=False),
        sa.Column('effective_year', sa.Integer(), nullable=False, server_default='2025'),
        sa.Column('chunk_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('vector_dim', sa.Integer(), nullable=False, server_default='768'),
        sa.Column('status', sa.String(16), nullable=False, server_default='ACTIVE'),
        sa.Column('uploaded_by', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_knowledge_documents_category', 'knowledge_documents', ['category'])

    op.create_table(
        'knowledge_chunks',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('document_id', sa.String(36), sa.ForeignKey('knowledge_documents.id'), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=False),
        sa.Column('chunk_text', sa.Text(), nullable=False),
        sa.Column('embedding', sa.JSON(), nullable=True),
        sa.Column('similarity_weight', sa.Numeric(4, 3), nullable=True, server_default='1.0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )

    # 6. Audit Logs
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('actor_id', sa.String(64), nullable=True),
        sa.Column('actor_role', sa.String(32), nullable=True),
        sa.Column('action_type', sa.String(64), nullable=False),
        sa.Column('request_id', sa.String(64), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('details', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_audit_logs_action_type', 'audit_logs', ['action_type'])
    op.create_index('ix_audit_logs_created_at', 'audit_logs', ['created_at'])

    # 7. Notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('category', sa.String(32), nullable=False, server_default='SYSTEM'),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('link_path', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])

def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('audit_logs')
    op.drop_table('knowledge_chunks')
    op.drop_table('knowledge_documents')
    op.drop_table('lab_bookings')
    op.drop_table('labs')
    op.drop_table('approval_records')
    op.drop_table('service_requests')
    op.drop_table('users')
