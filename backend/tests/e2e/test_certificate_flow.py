import unittest
import sys
import os

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from services.ai.intent_classifier import classify_intent
from tools.certificate_tools import verify_student_eligibility, commit_certificate_request, CERTIFICATE_TYPES
from services.pdf.certificate_generator import generate_bonafide_certificate_html
from services.audit.audit_logger import log_audit_event, get_audit_logs

class TestCertificateFlowE2E(unittest.TestCase):
    """
    End-to-End E2E Integration Suite for Bonafide Certificate PDF Issuance:
    Intent Classification -> Student Fee Clearance Verification -> PDF Generation -> Audit Trail Logging.
    """

    def test_certificate_issuance_e2e(self):
        user_prompt = "I need an official Fee Structure & Bonafide Certificate for my e-Kalyan scholarship application."
        student_reg_no = "2023-CSE-042"
        student_name = "Kaushal Raj Gupta"

        # Step 1: Intent Classification
        intent, confidence = classify_intent(user_prompt)
        self.assertEqual(intent, "CERTIFICATE")
        self.assertGreaterEqual(confidence, 0.90)

        # Step 2: Certificate Types Check
        self.assertTrue(len(CERTIFICATE_TYPES) >= 3)
        bonafide_type = next((t for t in CERTIFICATE_TYPES if t["type"] == "BONAFIDE"), None)
        self.assertIsNotNone(bonafide_type)

        # Step 3: Eligibility & Tuition Dues Verification
        eligibility = verify_student_eligibility(student_reg_no)
        self.assertTrue(eligibility["verified"])
        self.assertEqual(eligibility["tuition_fee_dues"], 0.0)
        self.assertEqual(eligibility["enrollment_status"], "ACTIVE")

        # Step 4: Commit Certificate Request
        request_res = commit_certificate_request(
            request_id="50000000-0000-0000-0000-000000000002",
            student_name=student_name,
            student_reg_no=student_reg_no,
            department="Computer Science & Engineering",
            certificate_type="BONAFIDE",
            purpose="Scholarship Application"
        )
        self.assertEqual(request_res["status"], "APPROVED")
        self.assertIn("CERT-", request_res["cert_id"])

        # Step 5: PDF HTML Generator
        html_payload = generate_bonafide_certificate_html({
            "cert_id": request_res["cert_id"],
            "student_name": student_name,
            "father_name": "Rajesh Sharma",
            "student_reg_no": student_reg_no,
            "department": "Computer Science & Engineering",
            "academic_year": "2nd year",
            "purpose": "Scholarship Application",
            "qr_verification_code": request_res["qr_verification_code"]
        })
        self.assertIn("SIKSHA 'O' ANUSANDHAN", html_payload)
        self.assertIn(student_name, html_payload)

        # Step 6: Audit Log Entry
        audit = log_audit_event(
            event_type="TOOL_EXECUTED",
            action_summary=f"E2E Bonafide Certificate issued #{request_res['cert_id']}",
            provenance_payload={"request": request_res, "eligibility": eligibility},
            actor_id=f"{student_name} ({student_reg_no})",
            actor_role="Student"
        )
        self.assertIsNotNone(audit["audit_id"])

if __name__ == '__main__':
    unittest.main()
