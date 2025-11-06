# LocalGuideForm Component

A **Next.js client component** (`"use client"`) for registering as a local guide.  

## Features
- Uses **React Hook Form** with **Zod validation** for form handling.
- Fetches **logged-in user info** from Redux (`username` and `email`) and shows it as read-only.
- Allows users to input:
  - Age (18–80)
  - Address
  - Contact number
  - Select a place from the provided list
  - Upload two ID images
- Handles form submission with **FormData** and sends a POST request to the API.
- Displays error messages for validation or network issues.
- Shows a **loading state** while submitting and redirects to a thank-you page on success.
