--Remove all memebers from all chats
DELETE FROM ChatMembers;

--Remove all messages from all chats
DELETE FROM Messages;

--Remove all chats
DELETE FROM Chats;

--Remove the user test1
DELETE FROM Members 
WHERE Email='test1@test.com';

--Add the User test1  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test1First', 'test1Last', 'test1', 'test1@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Remove the user test2
DELETE FROM Members 
WHERE Email='test2@test.com';

--Add the User test2  (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test2First', 'test2Last', 'test2', 'test2@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Remove the user test3
DELETE FROM Members 
WHERE Email='test3@test.com';

--Add the User test3 (password is: test12345)
INSERT INTO 
    Members(FirstName, LastName, Username, Email, Password, Salt, Verification)
VALUES
    ('test3First', 'test3Last', 'test3', 'test3@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f', 1);

--Create 3 Chat rooms, ChatIds 1, 2, and 3
INSERT INTO
    chats(chatid, name)
VALUES
    (1, 'test chat 1')
RETURNING *;

INSERT INTO
    chats(chatid, name)
VALUES
    (2, 'test chat 2')
RETURNING *;

INSERT INTO
    chats(chatid, name)
VALUES
    (3, 'test chat 3')
RETURNING *;

--Add the three test users to chat 1
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 1, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add the three test users to chat 2
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 2, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add the three test users to chat 3
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 3, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to create a conversation in chat 1
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hello Everyone!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'hi',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hey Test1, how is it going?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

-- add messages to chat 2
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

-- adding messages to chat 3
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    '3 2 1 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;