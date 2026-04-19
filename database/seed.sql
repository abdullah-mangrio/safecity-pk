-- Cities
INSERT INTO city (name, province) VALUES
('Karachi', 'Sindh'),
('Lahore', 'Punjab'),
('Islamabad', 'Islamabad Capital Territory');

-- Areas
INSERT INTO area (city_id, name, lat, lng) VALUES
(1, 'Gulshan', 24.9200, 67.0900),
(1, 'Clifton', 24.8138, 67.0295),
(2, 'DHA', 31.4697, 74.3782),
(2, 'Gulberg', 31.5204, 74.3587),
(3, 'F-10', 33.6844, 73.0479),
(3, 'Blue Area', 33.7070, 73.0498);

-- Incident Types
INSERT INTO incident_type (name, category) VALUES
('Street Robbery', 'Theft'),
('Snatching', 'Theft'),
('Assault', 'Violence'),
('Vehicle Theft', 'Theft'),
('Harassment', 'Violence'),
('Burglary', 'Property Crime');

-- Sample Users
INSERT INTO app_user (full_name, email, role, password_hash) VALUES
('Admin User', 'admin@safecity.pk', 'admin', 'hashedpassword'),
('Analyst User', 'analyst@safecity.pk', 'analyst', 'hashedpassword'),
('Operator User', 'operator@safecity.pk', 'operator', 'hashedpassword');

-- Incidents
INSERT INTO incident (
    city_id, area_id, incident_type_id,
    occurred_at, severity, status,
    title, description, source
)
VALUES
(1, 1, 1, NOW() - INTERVAL '1 day', 4, 'reported',
 'Robbery near market', 'Two suspects on bike near a busy market road', 'manual'),

(1, 2, 2, NOW() - INTERVAL '2 days', 3, 'verified',
 'Mobile snatching at signal', 'Phone taken from victim while waiting at traffic signal', 'manual'),

(1, 1, 5, NOW() - INTERVAL '6 hours', 2, 'reported',
 'Harassment complaint', 'Victim reported harassment near bus stop', 'manual'),

(1, 2, 4, NOW() - INTERVAL '4 days', 4, 'resolved',
 'Motorcycle theft', 'Bike reported stolen outside apartment block', 'manual'),

(2, 3, 3, NOW() - INTERVAL '3 days', 5, 'reported',
 'Assault case', 'Physical fight reported near commercial area', 'manual'),

(2, 4, 6, NOW() - INTERVAL '5 days', 4, 'verified',
 'House burglary', 'Forced entry reported in residential block', 'manual'),

(2, 4, 1, NOW() - INTERVAL '10 hours', 3, 'reported',
 'Street robbery near cafe', 'Wallet and cash taken by two unknown suspects', 'manual'),

(3, 5, 2, NOW() - INTERVAL '8 hours', 3, 'reported',
 'Snatching in sector F-10', 'Pedestrian reported phone snatching', 'manual'),

(3, 6, 5, NOW() - INTERVAL '1 day 3 hours', 2, 'verified',
 'Harassment near office zone', 'Complaint logged from office area', 'manual'),

(3, 6, 4, NOW() - INTERVAL '7 days', 4, 'rejected',
 'Vehicle theft suspicion', 'Initial complaint later found unsupported', 'manual');
