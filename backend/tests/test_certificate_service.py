import os
import sys
import unittest

# Ensure backend directory is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from tools.certificate_tools import verify_student_eligibility, commit_certificate_request
from services.pdf.certificate_generator import generate_bonafide_pdf, generate_bonafide_certificate_html

class TestCertificateService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_eligibility_verification(self):
        """Test student academic standing and fee clearance verification."""
        res = verify_student_eligibility("24E042")
        self.assertTrue(res["verified"])
        self.assertEqual(res["enrollment_status"], "ACTIVE")
        self.assertEqual(res["tuition_fee_dues"], 0.0)

    def test_certificate_commitment(self):
        """Test committing certificate request and generating unique record."""
        record = commit_certificate_request(
            request_id="50000000-0000-0000-0000-000000000099",
            student_name="Kaushal Raj Gupta",
            student_reg_no="24E042",
            department="Computer Science & Engineering",
            certificate_type="BONAFIDE",
            purpose="e-Kalyan Scholarship"
        )
        self.assertIn("CERT-", record["cert_id"])
        self.assertEqual(record["status"], "APPROVED")
        self.assertIn("QR-BONAFIDE", record["qr_verification_code"])

    def test_reportlab_pdf_binary_generation(self):
        """Test generating ReportLab binary PDF file stream."""
        cert_data = {
            "cert_id": "ITER/SOA/219",
            "student_name": "Kaushal Raj Gupta",
            "father_name": "Rajesh Sharma",
            "student_reg_no": "24E042",
            "branch": "Computer Science and Engineering",
            "academic_year": "2nd",
            "academic_session": "2025-2026",
            "batch": "2024 - 2025",
            "purpose": "Jharkhand state e Kalyan Scholarship",
            "issued_date": "27.01.2026",
            "annual_fee": "Rs. 2, 75,000/-"
        }
        pdf_bytes = generate_bonafide_pdf(cert_data)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertGreater(len(pdf_bytes), 1000)
        # Verify valid PDF header magic bytes
        self.assertTrue(pdf_bytes.startswith(b"%PDF-"))

    def test_api_download_pdf_endpoint(self):
        """Test GET /api/certificates/{cert_id}/download endpoint."""
        response = self.client.get(
            "/api/certificates/ITER_SOA_219/download",
            params={
                "student_name": "Kaushal Raj Gupta",
                "student_reg_no": "24E042",
                "purpose": "Jharkhand state e Kalyan Scholarship"
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "application/pdf")
        self.assertIn("attachment; filename=", response.headers.get("content-disposition", ""))
        self.assertTrue(response.content.startswith(b"%PDF-"))

    def test_api_request_endpoint(self):
        """Test POST /api/certificates/request endpoint."""
        payload = {
            "student_name": "Kaushal Raj Gupta",
            "father_name": "Rajesh Sharma",
            "student_reg_no": "24E042",
            "department": "Computer Science & Engineering",
            "certificate_type": "BONAFIDE",
            "purpose": "Jharkhand state e Kalyan Scholarship"
        }
        response = self.client.post("/api/certificates/request", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("cert_id", data)
        self.assertEqual(data["status"], "APPROVED")

if __name__ == "__main__":
    unittest.main()
