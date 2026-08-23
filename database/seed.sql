-- ====================================================================
-- SOA NEXUS AI — Database Prototype Seed Data Script
-- Problem Statement: SOAIDEATHON-S1
-- Note: Uses valid RFC 4122 hexadecimal UUID strings compatible with PostgreSQL/Supabase
-- ====================================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, permissions) VALUES
('10000000-0000-0000-0000-000000000001', 'Student', '{"can_submit_request": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000002', 'Faculty', '{"can_submit_request": true, "can_approve": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000003', 'Lab_In_Charge', '{"can_submit_request": true, "can_approve_labs": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000004', 'Maintenance_Staff', '{"can_update_tickets": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000005', 'Admin', '{"can_manage_all": true, "can_view_audit": true, "can_ingest_kb": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Seed Users
INSERT INTO users (id, email, full_name, role_id, department, registration_no) VALUES
('20000000-0000-0000-0000-000000000001', 'student@soa.ac.in', 'Rahul Sharma', '10000000-0000-0000-0000-000000000001', 'Computer Science & Engineering', '2023-CSE-042'),
('20000000-0000-0000-0000-000000000002', 'faculty@soa.ac.in', 'Dr. Sunita Panigrahi', '10000000-0000-0000-0000-000000000002', 'Computer Science & Engineering', NULL),
('20000000-0000-0000-0000-000000000003', 'labincharge@soa.ac.in', 'Prof. A. K. Samanta', '10000000-0000-0000-0000-000000000003', 'Computer Science & Engineering', NULL),
('20000000-0000-0000-0000-000000000004', 'maintenance@soa.ac.in', 'Rajesh Kumar', '10000000-0000-0000-0000-000000000004', 'Campus Estates & Facilities', NULL),
('20000000-0000-0000-0000-000000000005', 'admin@soa.ac.in', 'Admin Officer Patnaik', '10000000-0000-0000-0000-000000000005', 'Academic Administration', NULL)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Knowledge Documents
INSERT INTO knowledge_documents (id, title, category, file_path, version, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'SOA Academic Regulations 2025.pdf', 'Academic Policy', '/docs/policies/SOA_Academic_Regulations_2025.pdf', 'v2025.1', TRUE),
('30000000-0000-0000-0000-000000000002', 'SOA Lab Usage Guidelines 2025.pdf', 'Facility Rules', '/docs/policies/SOA_Lab_Guidelines_2025.pdf', 'v2025.2', TRUE),
('30000000-0000-0000-0000-000000000003', 'Campus Safety Circular 2026.pdf', 'Safety', '/docs/policies/Campus_Safety_Circular_2026.pdf', 'v2026.1', TRUE)
ON CONFLICT DO NOTHING;

-- 4. Insert Sample Knowledge Chunks
INSERT INTO knowledge_chunks (id, document_id, chunk_text, page_number, metadata_json) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Section 4.2: Attendance Requirements. Students must maintain a minimum of 75% attendance in each course to be eligible for end-semester examinations. Medical leave up to 10 days may be condoned upon Warden approval.', 14, '{"section": "4.2", "topic": "Attendance"}'::jsonb),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Section 2.1: Advanced AI Lab (Room C-204) reservations for B.Tech Major Project work require prior prerequisite verification (CS301 passed) and approval from the Lab In-Charge or Faculty Supervisor. Maximum single booking duration is 3 hours.', 6, '{"section": "2.1", "topic": "AI Lab Booking"}'::jsonb),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'Section 1.4: Weekend Campus Access. All student club activities and venue bookings on weekends must terminate by 7:00 PM as per campus safety guidelines.', 3, '{"section": "1.4", "topic": "Night Safety"}'::jsonb)
ON CONFLICT DO NOTHING;

-- 5. Insert Sample Service Requests
INSERT INTO service_requests (id, user_id, service_type, status, current_step, ai_plan) VALUES
('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'LAB_BOOKING', 'PENDING_APPROVAL', 3, '{"steps": ["Check Prerequisites", "Verify Availability", "Request Approval from Lab In-Charge", "Issue Access Pass"], "risk_level": "HIGH", "requires_approval": true}'::jsonb),
('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'CERTIFICATE', 'APPROVED', 4, '{"steps": ["Verify Student Status", "Draft Certificate", "Admin Sign-Off", "Generate PDF"], "risk_level": "MEDIUM", "requires_approval": true}'::jsonb)
ON CONFLICT DO NOTHING;

-- 6. Insert Lab Booking Record
INSERT INTO lab_bookings (id, request_id, lab_id, booking_date, start_time, end_time, purpose, access_pass_code) VALUES
('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'LAB-AI-101', CURRENT_DATE + INTERVAL '1 day', '14:00:00', '16:00:00', 'B.Tech Major Capstone Project Work', 'PASS-LAB-AI-88192')
ON CONFLICT DO NOTHING;

-- 7. Insert Certificate Record
INSERT INTO certificates (id, request_id, certificate_type, purpose, pdf_url, qr_verification_code) VALUES
('70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002', 'BONAFIDE', 'Passport Application at SBI Branch', '/api/assets/certificates/CERT-881.pdf', 'QR-BONAFIDE-2026-881')
ON CONFLICT DO NOTHING;

-- 8. Insert Approval Task
INSERT INTO approvals (id, request_id, approver_id, assigned_role, status, approver_comments) VALUES
('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Lab_In_Charge', 'PENDING', NULL)
ON CONFLICT DO NOTHING;

-- 9. Insert Sample Audit Log Entry
INSERT INTO audit_logs (id, request_id, user_id, action_type, raw_prompt, detected_intent, retrieved_sources, agent_plan, execution_payload) VALUES
('90000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Consequential_Action_Gated', 'I want to book the AI Lab tomorrow from 2 PM to 4 PM for my project.', 'Service_Request.Lab_Booking', '[{"document": "SOA Lab Guidelines 2025.pdf", "page": 6, "score": 0.92}]'::jsonb, '{"risk_level": "HIGH", "requires_approval": true}'::jsonb, '{"tool": "create_lab_booking_request", "assigned_approver": "Prof. A. K. Samanta"}'::jsonb)
ON CONFLICT DO NOTHING;

-- 10. Insert Sample Notification
INSERT INTO notifications (id, user_id, title, message, type, is_read, link_path) VALUES
('a0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Approval Pending', 'Your AI Lab reservation request #LB-4019 has been routed to Prof. A. K. Samanta for approval.', 'APPROVAL_REQUIRED', FALSE, '/requests/50000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
