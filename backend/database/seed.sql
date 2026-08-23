-- Mirror of database/seed.sql with valid hexadecimal UUIDs

INSERT INTO roles (id, name, permissions) VALUES
('10000000-0000-0000-0000-000000000001', 'Student', '{"can_submit_request": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000002', 'Faculty', '{"can_submit_request": true, "can_approve": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000003', 'Lab_In_Charge', '{"can_submit_request": true, "can_approve_labs": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000004', 'Maintenance_Staff', '{"can_update_tickets": true, "can_query_kb": true}'::jsonb),
('10000000-0000-0000-0000-000000000005', 'Admin', '{"can_manage_all": true, "can_view_audit": true, "can_ingest_kb": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (id, email, full_name, role_id, department, registration_no) VALUES
('20000000-0000-0000-0000-000000000001', 'student@soa.ac.in', 'Rahul Sharma', '10000000-0000-0000-0000-000000000001', 'Computer Science & Engineering', '2023-CSE-042'),
('20000000-0000-0000-0000-000000000002', 'faculty@soa.ac.in', 'Dr. Sunita Panigrahi', '10000000-0000-0000-0000-000000000002', 'Computer Science & Engineering', NULL),
('20000000-0000-0000-0000-000000000003', 'labincharge@soa.ac.in', 'Prof. A. K. Samanta', '10000000-0000-0000-0000-000000000003', 'Computer Science & Engineering', NULL),
('20000000-0000-0000-0000-000000000004', 'maintenance@soa.ac.in', 'Rajesh Kumar', '10000000-0000-0000-0000-000000000004', 'Campus Estates & Facilities', NULL),
('20000000-0000-0000-0000-000000000005', 'admin@soa.ac.in', 'Admin Officer Patnaik', '10000000-0000-0000-0000-000000000005', 'Academic Administration', NULL)
ON CONFLICT (email) DO NOTHING;

INSERT INTO knowledge_documents (id, title, category, file_path, version, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'SOA Academic Regulations 2025.pdf', 'Academic Policy', '/docs/policies/SOA_Academic_Regulations_2025.pdf', 'v2025.1', TRUE),
('30000000-0000-0000-0000-000000000002', 'SOA Lab Usage Guidelines 2025.pdf', 'Facility Rules', '/docs/policies/SOA_Lab_Guidelines_2025.pdf', 'v2025.2', TRUE),
('30000000-0000-0000-0000-000000000003', 'Campus Safety Circular 2026.pdf', 'Safety', '/docs/policies/Campus_Safety_Circular_2026.pdf', 'v2026.1', TRUE)
ON CONFLICT DO NOTHING;
