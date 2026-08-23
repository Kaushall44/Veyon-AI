import sys
import os
import unittest

# Ensure backend root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.certificate_tools import (
    verify_student_eligibility,
    commit_certificate_request,
    CERTIFICATE_TYPES
)
from services.pdf.certificate_generator import generate_bonafide_certificate_html

class TestCertificateTools(unittest.TestCase):

    def test_get_certificate_types(self):
        self.assertEqual(len(CERTIFICATE_TYPES), 3)
        types = [c["type"] for c in CERTIFICATE_TYPES]
        self.assertIn("BONAFIDE", types)
        self.assertIn("CONDUCT", types)
        self.assertIn("GRADE_TRANSCRIPT", types)
        print("\n[PASSED] Test 1: Certificate types listed successfully.")

    def test_verify_student_eligibility(self):
        eligibility = verify_student_eligibility("2023-CSE-042")
        self.assertTrue(eligibility["verified"])
        self.assertEqual(eligibility["enrollment_status"], "ACTIVE")
        self.assertEqual(eligibility["tuition_fee_dues"], 0.0)
        print(f"[PASSED] Test 2: Student eligibility verified (Status: {eligibility['enrollment_status']}, Dues: Rs.{eligibility['tuition_fee_dues']}).")

    def test_commit_certificate_request_and_pdf_generation(self):
        record = commit_certificate_request(
            request_id="50000000-0000-0000-0000-000000000002",
            student_name="Rahul Sharma",
            student_reg_no="2023-CSE-042",
            department="Computer Science & Engineering",
            certificate_type="BONAFIDE",
            purpose="Passport Application at SBI Branch",
            approver_name="Admin Officer Patnaik"
        )

        self.assertEqual(record["status"], "APPROVED")
        self.assertTrue(record["cert_id"].startswith("CERT-2026-"))
        self.assertTrue(record["qr_verification_code"].startswith("QR-BONAFIDE-2026-"))

        # Verify Watermarked HTML Generator
        html_output = generate_bonafide_certificate_html(record)
        self.assertIn("Siksha 'O' Anusandhan", html_output)
        self.assertIn("FEE STRUCTURE CERTIFICATE", html_output)
        self.assertIn("SIKSHA 'O' ANUSANDHAN", html_output)
        self.assertIn("Passport Application at SBI Branch", html_output)
        print(f"[PASSED] Test 3: Watermarked Bonafide Certificate PDF payload generated. Certificate ID: {record['cert_id']}")

if __name__ == "__main__":
    unittest.main()
