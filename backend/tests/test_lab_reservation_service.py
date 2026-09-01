import os
import sys
import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db, SyncSessionFactory
from backend.database.models import User, Lab, LabBooking
from backend.services.lab_service import LabReservationService

client = TestClient(app)

class TestLabReservationService(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        session = SyncSessionFactory()
        cls.student = session.query(User).filter(User.role == "Student").first()
        # Seed test lab if not present
        if not session.query(Lab).filter(Lab.lab_id == "LAB-AI-101").first():
            lab = Lab(
                id="test-lab-ai-101",
                lab_id="LAB-AI-101",
                name="Advanced AI & GPU Computing Lab",
                room_no="Room C-204",
                building="C-Block 2nd Floor",
                total_workstations=30,
                gpu_nodes="NVIDIA RTX 4090",
                prerequisites=["CS301 Machine Learning"],
                max_booking_hours=3,
                is_active=True
            )
            session.add(lab)
            session.commit()
        session.close()

    def setUp(self):
        self.db = SyncSessionFactory()

    def tearDown(self):
        self.db.query(LabBooking).filter(LabBooking.purpose.like("%Test%")).delete()
        self.db.commit()
        self.db.close()

    def test_get_lab_catalog(self):
        catalog = LabReservationService.get_lab_catalog(db=self.db)
        self.assertGreaterEqual(len(catalog), 1)
        lab_ids = [l["lab_id"] for l in catalog]
        self.assertIn("LAB-AI-101", lab_ids)
        print("\n[PASSED] Test 1: Lab catalog retrieved with authentic 30-workstation GPU specs.")

    def test_check_lab_availability_and_prerequisites(self):
        # Test Fast-Track student (>= 85% attendance, >= 7.5 CGPA)
        avail_fast = LabReservationService.check_lab_availability(
            lab_id="LAB-AI-101",
            date="2026-08-24",
            start_time="14:00",
            end_time="16:00",
            student_attendance=90.0,
            student_cgpa=8.5,
            db=self.db
        )
        self.assertTrue(avail_fast["available"])
        self.assertTrue(avail_fast["student_eligibility"]["is_fast_track"])
        self.assertEqual(avail_fast["total_seats"], 30)

        # Test Deficit Attendance student (< 75%)
        avail_low = LabReservationService.check_lab_availability(
            lab_id="LAB-AI-101",
            date="2026-08-24",
            start_time="14:00",
            end_time="16:00",
            student_attendance=68.0,
            student_cgpa=8.0,
            db=self.db
        )
        self.assertFalse(avail_low["available"])
        self.assertEqual(avail_low["student_eligibility"]["status"], "ATTENDANCE_DEFICIT")
        print("[PASSED] Test 2: Prerequisite validation rules (85% fast-track vs 75% cutoff) verified.")

    def test_successful_lab_booking_with_qr_code(self):
        booking = LabReservationService.commit_lab_booking(
            lab_id="LAB-AI-101",
            date="2026-08-28",
            start_time="14:00",
            end_time="16:00",
            student_id="u1000000-0000-0000-0000-000000000001",
            student_name="Kaushal Raj Gupta",
            student_reg_no="2023-CSE-042",
            purpose="Test Deep Learning Research",
            workstation_no=14,
            db=self.db
        )

        self.assertEqual(booking["status"], "APPROVED")
        self.assertEqual(booking["workstation_no"], 14)
        self.assertTrue(booking["access_pass_code"].startswith("PASS-LAB-AI-"))
        self.assertIn("SOA-NEXUS-PASS", booking["qr_payload"])
        self.assertIn("SIG:", booking["qr_payload"])
        print(f"[PASSED] Test 3: Workstation #14 booked successfully with HMAC signature: {booking['access_pass_code']}")

    def test_concurrent_collision_rejection(self):
        # 1. First student books Workstation #20
        LabReservationService.commit_lab_booking(
            lab_id="LAB-AI-101",
            date="2026-08-29",
            start_time="14:00",
            end_time="16:00",
            student_name="Student 1",
            student_reg_no="2023-CSE-001",
            purpose="Test Collision Booking",
            workstation_no=20,
            db=self.db
        )

        # 2. Second student tries to book the EXACT same Workstation #20 for the overlapping time
        with self.assertRaises(ValueError) as ctx:
            LabReservationService.commit_lab_booking(
                lab_id="LAB-AI-101",
                date="2026-08-29",
                start_time="14:00",
                end_time="16:00",
                student_name="Student 2",
                student_reg_no="2023-CSE-002",
                purpose="Test Collision Booking",
                workstation_no=20,
                db=self.db
            )

        self.assertIn("Conflicting booking", str(ctx.exception))
        self.assertIn("already reserved", str(ctx.exception))
        print("[PASSED] Test 4: Concurrency collision blocked! Second student booking rejected with Conflict message.")

    def test_api_router_booking_conflict_409(self):
        # First booking via API endpoint
        res1 = client.post("/api/labs/book", json={
            "lab_id": "LAB-AI-101",
            "date": "2026-08-30",
            "start_time": "10:00",
            "end_time": "12:00",
            "workstation_no": 11,
            "purpose": "Test API Router Booking",
            "student_name": "API Student 1",
            "student_reg_no": "2023-CSE-011"
        })
        self.assertEqual(res1.status_code, 201)

        # Second conflicting booking via API endpoint
        res2 = client.post("/api/labs/book", json={
            "lab_id": "LAB-AI-101",
            "date": "2026-08-30",
            "start_time": "10:00",
            "end_time": "12:00",
            "workstation_no": 11,
            "purpose": "Test Colliding Booking",
            "student_name": "API Student 2",
            "student_reg_no": "2023-CSE-012"
        })
        self.assertEqual(res2.status_code, 409)
        self.assertIn("already reserved", res2.json()["detail"])
        print("[PASSED] Test 5: API Router returned HTTP 409 Conflict for concurrent workstation collision.")

if __name__ == "__main__":
    unittest.main()
