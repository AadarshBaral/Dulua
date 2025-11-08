# Authentication Router API Documentation

## Helper Functions

### verify_password()
Verifies a plain text password against a bcrypt hashed password.  
Uses passlib's CryptContext for secure password verification.

### get_password_hash()
Generates a bcrypt hash from a plain text password.  
Uses passlib's CryptContext with bcrypt scheme.

### authenticate_user()
Authenticates a user by username and password.  
Queries database for user and verifies password hash.  
Raises 401 error if user not found or password incorrect.

### create_access_token()
Creates a JWT access token with user data and expiration time.  
Uses HS256 algorithm with configurable expiration (default: 15 minutes).  
Encodes user information in token payload.

### get_current_user()
Dependency function that extracts and validates JWT token.  
Decodes token payload and retrieves user from database.  
Raises 401 error if token is invalid or user not found.

### get_current_active_user()
Dependency function that ensures current user is active.  
Builds on get_current_user() to add activity check.  
Raises 400 error if user account is inactive.

---

## API Endpoints

## login()

**Method:** POST  
**Path:** `/token`  
**Authentication:** Not required (this endpoint provides authentication)  
**Response Model:** Token

Authenticates user and issues JWT access token.  
Sets HTTP-only cookie with token for secure session management.  
Returns both token in response body and sets it as secure cookie.

**Form Parameters:**
- `username` (string) - User's username
- `password` (string) - User's plain text password

**Authentication Flow:**
1. Validates username and password against database
2. Creates JWT token with user data (username, email, role, userId)
3. Sets token expiration to 43200 minutes (30 days)
4. Stores token in HTTP-only cookie with secure settings
5. Returns token in response body

**Token Payload Includes:**
- `sub` (string) - Username
- `email` (string) - User email address
- `role` (string) - User role (user/admin/guide)
- `userId` (string) - User UUID
- `exp` (timestamp) - Token expiration time

**Cookie Settings:**
- `httponly`: True (prevents JavaScript access)
- `secure`: False (set to True in production for HTTPS)
- `samesite`: "lax" (CSRF protection)
- `path`: "/" (available site-wide)
- `max_age`: 43200 minutes (30 days)

**Returns:** Access token and token type ("bearer")

**Error Responses:**
- 401: Incorrect username or password
- 500: Token creation or cookie setting failure

---

## read_users_me()

**Method:** GET  
**Path:** `/get-user`  
**Authentication:** Required (JWT token)  
**Dependencies:** OAuth2PasswordBearer

Retrieves authenticated user's basic information.  
Validates token and ensures user is active before returning data.

**Returns:**
- `username` (string) - User's display name
- `email` (string) - User's email address
- `id` (UUID) - User's unique identifier

**Error Responses:**
- 401: Invalid or missing token
- 400: User account is inactive

---

## register()

**Method:** POST  
**Path:** `/register`  
**Authentication:** Not required

Initiates user registration process with email OTP verification.  
Creates pending registration record and sends 4-digit OTP to email.  
Handles duplicate registrations by cleaning up existing pending records.

**Request Body (UserCreate):**
- `name` (string) - User's display name
- `email` (EmailStr) - User's email address
- `password` (string) - User's plain text password

**Registration Flow:**
1. Checks if user already exists in UserDB
2. Removes any existing pending registrations for the email
3. Hashes the password using bcrypt
4. Generates random 4-digit OTP code
5. Creates pending registration record with 30-minute expiration
6. Sends OTP to user's email via send_email()
7. Returns success message

**OTP Details:**
- Format: 4-digit numeric code (1000-9999)
- Expiration: 30 minutes from generation
- Stored in PendingRegistration table

**Returns:** Success message confirming email sent

**Error Responses:**
- 400: User with email already exists

**Security Features:**
- Password is hashed before storage
- OTP expires after 30 minutes
- Pending registrations are cleaned up

---

## verify_otp()

**Method:** POST  
**Path:** `/verify_otp`  
**Authentication:** Not required

Verifies OTP code and completes user registration.  
Creates permanent user account and associated user profile.  
Automatically generates unique handle for user profile.

**Request Body (VerifyOtp):**
- `email` (EmailStr) - User's email address
- `otp` (string) - 4-digit OTP code received via email

**Verification Flow:**
1. Queries PendingRegistration table for matching email, OTP, and valid expiration
2. Validates OTP hasn't expired (checks expires_at > current time)
3. Creates permanent UserDB record with verified credentials
4. Deletes pending registration record
5. Generates unique handle from username
6. Creates UserProfile with default values (0 contributions, 0 green points)
7. Commits all changes to database

**User Profile Initialization:**
- `handle` (string) - Auto-generated unique handle from username
- `image` (null) - No profile image initially
- `contribution` (integer) - Initialized to 0
- `green_points` (integer) - Initialized to 0

**Returns:** Success message confirming OTP verification

**Error Responses:**
- 400: Invalid OTP (wrong code, expired, or email not found)

**Database Operations:**
1. Creates UserDB record (permanent user account)
2. Deletes PendingRegistration record (cleanup)
3. Creates UserProfile record (user metadata)

**Security Features:**
- Time-based OTP expiration (30 minutes)
- Single-use OTP (deleted after verification)
- Automatic cleanup of pending registrations

---

## Configuration

**Authentication Settings:**
- Algorithm: HS256 (HMAC with SHA-256)
- Secret Key: Loaded from settings.APP_SECRET
- Access Token Expiration: 43200 minutes (30 days)
- Password Hashing: Bcrypt via passlib

**Security Context:**
- Password scheme: bcrypt
- Deprecated schemes: auto-handled by passlib
- OAuth2 flow: Password bearer token

**Dependencies:**
- OAuth2PasswordBearer: Handles token extraction from requests
- CryptContext: Manages password hashing and verification
- JWT: Creates and verifies JSON Web Tokens