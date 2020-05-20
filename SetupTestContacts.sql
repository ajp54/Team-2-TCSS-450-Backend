--Remove all members from Contacts
DELETE FROM Contacts;

--Remove the user testContact1
DELETE FROM Members 
WHERE Email='test1@test.com';

--Add the User testContact1  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test1First', 'test1Last', 'test1', 'test1@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Remove the user testContact2
DELETE FROM Members 
WHERE Email='test2@test.com';

--Add the User test2  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test2First', 'test2Last', 'test2', 'test2@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Remove the user testContact3
DELETE FROM Members 
WHERE Email='test3@test.com';

--Add the User testContact3 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test3First', 'test3Last', 'test3', 'test3@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Create contact from test1 to test2
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test1@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test2@test.com'),
    1)
RETURNING *;

--Create contact from test1 to test3
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test1@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test3@test.com'),
    1)
RETURNING *;


--Create contact from test2 to test1
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test2@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test1@test.com'),
    1)
RETURNING *;

--Create contact from test2 to test3
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test2@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test3@test.com'),
    1)
RETURNING *;

--Create contact from test3 to test1
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test3@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test1@test.com'),
    1)
RETURNING *;

--Create contact from test3 to test2
INSERT INTO
    Contacts(MemberID_A, MemberID_B, verified)
VALUES((SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test3@test.com'),
    (SELECT Members.MemberID 
    FROM Members
    WHERE Members.Email='test2@test.com'),
    1)
RETURNING *;