import sys
import os
import uuid
from datetime import datetime, timezone

# Ensure project root is on sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import (
    User,
    Lab,
    LabBooking,
    ServiceRequest,
    ApprovalRecord,
    KnowledgeDocument,
    KnowledgeChunk,
    AuditLog,
    Notification
)

def seed_database():
    print("[1/6] Initializing database schema...")
    init_db()
    
    session = SyncSessionFactory()
    try:
        print("[2/6] Seeding User Profiles...")
        # Check if users already seeded
        if session.query(User).count() == 0:
            users_data = [
                User(
                    id="u1000000-0000-0000-0000-000000000001",
                    reg_number="2023-CSE-042",
                    email="student@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_student",
                    full_name="Kaushal Raj Gupta",
                    role="Student",
                    department="Computer Science & Engineering",
                    semester=4,
                    cgpa=8.92,
                    attendance_pct=88.5,
                    is_active=True
                ),
                User(
                    id="u2000000-0000-0000-0000-000000000002",
                    reg_number="FAC-CSE-088",
                    email="faculty@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_faculty",
                    full_name="Dr. Sunita Panigrahi",
                    role="Faculty",
                    department="Computer Science & Engineering",
                    is_active=True
                ),
                User(
                    id="u3000000-0000-0000-0000-000000000003",
                    reg_number="FAC-LAB-012",
                    email="labincharge@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_labincharge",
                    full_name="Prof. A. K. Samanta",
                    role="Lab_In_Charge",
                    department="Computer Science & Engineering",
                    is_active=True
                ),
                User(
                    id="u4000000-0000-0000-0000-000000000004",
                    reg_number="STAFF-EST-104",
                    email="estates@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_estates",
                    full_name="Rajesh Kumar",
                    role="Estates_Staff",
                    department="Campus Maintenance & Infrastructure",
                    is_active=True
                ),
                User(
                    id="u5000000-0000-0000-0000-000000000005",
                    reg_number="OFFICER-GRV-001",
                    email="grievance@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_grievance",
                    full_name="Prof. S. N. Panda",
                    role="Grievance_Officer",
                    department="Dean Student Affairs",
                    is_active=True
                ),
                User(
                    id="u6000000-0000-0000-0000-000000000006",
                    reg_number="ADM-SYS-001",
                    email="admin@soa.ac.in",
                    hashed_password="$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_admin",
                    full_name="Dean Academics Office",
                    role="Admin",
                    department="Central University Administration",
                    is_active=True
                ),
            ]
            session.add_all(users_data)
            session.commit()
            print(f"  [OK] Seeded {len(users_data)} users.")

        print("[3/6] Seeding Lab Catalog...")
        if session.query(Lab).count() == 0:
            labs_data = [
                Lab(
                    lab_id="LAB-AI-101",
                    name="Advanced AI & GPU Computing Lab",
                    room_no="Room C-204",
                    building="C-Block 2nd Floor",
                    total_workstations=30,
                    gpu_nodes="NVIDIA A100 / RTX 4090",
                    equipment="High-Performance GPU Computing Workstations",
                    prerequisites=["CS301 Machine Learning"],
                    max_booking_hours=3,
                    is_active=True
                ),
                Lab(
                    lab_id="LAB-MICRO-202",
                    name="Microelectronics & VLSI Design Lab",
                    room_no="Room C-202",
                    building="C-Block 2nd Floor",
                    total_workstations=25,
                    equipment="Cadence / Xilinx FPGA Kits",
                    prerequisites=["EC202 VLSI Design"],
                    max_booking_hours=3,
                    is_active=True
                ),
                Lab(
                    lab_id="LAB-CAD-103",
                    name="Mechanical CAD & 3D Modeling Kiosk",
                    room_no="Room C-103",
                    building="C-Block 1st Floor",
                    total_workstations=20,
                    equipment="SolidWorks / ANSYS Workstations",
                    prerequisites=["ME101 Engineering Graphics"],
                    max_booking_hours=2,
                    is_active=True
                ),
            ]
            session.add_all(labs_data)
            session.commit()
            print(f"  [OK] Seeded {len(labs_data)} labs.")

        print("[4/6] Seeding Knowledge Documents & Policy Chunks...")
        if session.query(KnowledgeDocument).count() == 0:
            doc1 = KnowledgeDocument(
                id="DOC-1001",
                title="SOA_Academic_Regulations_2025.pdf",
                category="Academic Policy",
                effective_year=2025,
                chunk_count=84,
                vector_dim=768,
                status="ACTIVE",
                uploaded_by="Dr. S. N. Panda (Dean Academics)"
            )
            doc2 = KnowledgeDocument(
                id="DOC-1002",
                title="SOA_Lab_Guidelines_2025.pdf",
                category="Lab Operations",
                effective_year=2025,
                chunk_count=42,
                vector_dim=768,
                status="ACTIVE",
                uploaded_by="Prof. A. K. Samanta (Lab In-Charge)"
            )
            session.add_all([doc1, doc2])
            session.flush()

            chunk1 = KnowledgeChunk(
                document_id=doc1.id,
                page_number=4,
                chunk_text="Section 4.2: Course Prerequisite & Fast-Track Permits. Students maintaining above 85% attendance and CGPA >= 7.5 are eligible for fast-track lab permits.",
                embedding=[0.042, -0.198, 0.812, 0.301, -0.054],
                similarity_weight=0.94
            )
            chunk2 = KnowledgeChunk(
                document_id=doc2.id,
                page_number=2,
                chunk_text="Advanced AI & GPU Computing Lab (Room C-204) capacity: 30 NVIDIA RTX 4090 workstations.",
                embedding=[0.304, -0.112, 0.655, -0.091, 0.442],
                similarity_weight=0.96
            )
            session.add_all([chunk1, chunk2])
            session.commit()
            print("  [OK] Seeded knowledge base documents and policy chunks.")

        print("[5/6] Seeding Initial Service Requests...")
        if session.query(ServiceRequest).count() == 0:
            req1 = ServiceRequest(
                id="50000000-0000-0000-0000-000000000001",
                tracking_code="LB-9021",
                request_type="LAB_BOOKING",
                student_id="u1000000-0000-0000-0000-000000000001",
                status="Waiting for approval",
                risk_level="HIGH",
                assigned_approver_id="u3000000-0000-0000-0000-000000000003",
                is_anonymous=False,
                payload={
                    "lab_id": "LAB-AI-101",
                    "lab_name": "Advanced AI & GPU Computing Lab",
                    "date": "2026-08-25",
                    "start_time": "14:00",
                    "end_time": "16:00",
                    "purpose": "B.Tech Capstone Project Work"
                }
            )
            req2 = ServiceRequest(
                tracking_code="CERT-4019",
                request_type="CERTIFICATE",
                student_id="u1000000-0000-0000-0000-000000000001",
                status="Completed",
                risk_level="LOW",
                assigned_approver_id="u6000000-0000-0000-0000-000000000006",
                is_anonymous=False,
                payload={"certificate_type": "BONAFIDE", "purpose": "Passport Verification"}
            )
            req3 = ServiceRequest(
                tracking_code="MT-8842",
                request_type="MAINTENANCE",
                student_id="u1000000-0000-0000-0000-000000000001",
                status="In progress",
                risk_level="MEDIUM",
                assigned_approver_id="u4000000-0000-0000-0000-000000000004",
                is_anonymous=False,
                payload={"location": "C-Block Room 302", "category": "HVAC", "issue": "AC Leaking"}
            )
            req4 = ServiceRequest(
                tracking_code="GR-1049",
                request_type="GRIEVANCE",
                student_id="u1000000-0000-0000-0000-000000000001",
                status="In progress",
                risk_level="HIGH",
                assigned_approver_id="u5000000-0000-0000-0000-000000000005",
                is_anonymous=True,
                payload={"department": "Computer Science", "description": "Lab equipment non-functional in Lab 4"}
            )
            session.add_all([req1, req2, req3, req4])
            session.commit()
            print("  [OK] Seeded 4 initial service requests.")

        print("[6/6] Seeding Initial Notifications & Audit Logs...")
        if session.query(Notification).count() == 0:
            notifs = [
                Notification(
                    user_id="u1000000-0000-0000-0000-000000000001",
                    title="Action Plan Approved",
                    message="Prof. A. K. Samanta approved your AI Lab Reservation (#LB-9021).",
                    category="APPROVAL",
                    is_read=False,
                    link_path="/services/lab-booking"
                ),
                Notification(
                    user_id="u1000000-0000-0000-0000-000000000001",
                    title="Maintenance Dispatched",
                    message="Rajesh Kumar (HVAC Lead) has been dispatched for AC Repair in Room 302.",
                    category="MAINTENANCE",
                    is_read=False,
                    link_path="/services/maintenance"
                ),
            ]
            audit_entry = AuditLog(
                actor_id="u1000000-0000-0000-0000-000000000001",
                actor_role="Student",
                action_type="LAB_RESERVATION_REQUESTED",
                request_id="50000000-0000-0000-0000-000000000001",
                ip_address="127.0.0.1",
                details={
                    "intent": "LAB_BOOKING",
                    "lab_id": "LAB-AI-101",
                    "status": "WAITING_FOR_APPROVAL"
                }
            )
            session.add_all(notifs)
            session.add(audit_entry)
            session.commit()
            print("  [OK] Seeded notifications and audit logs.")

        print("\n[SUCCESS] Database Seed Successful! Production schema initialized.")
    except Exception as e:
        session.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()
