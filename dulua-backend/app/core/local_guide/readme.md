# Local Guide Router Overview

## add_local_guide()

**Method:** POST
**Path:** /add
Adds a new local guide by uploading two ID images and saving personal details.
Validates the email with the token and ensures the guide doesn’t already exist.

---

## verifyLocalGuide()

**Method:** GET
**Path:** /verifyLocalGuide/{id}
Allows only admin users to verify a guide.
Updates the user’s role to “guide” once verified.

---

## getLocalGuide()

**Method:** GET
**Path:** /getLocalGuide/{guide_id}
Fetches and returns details of a specific guide using their ID.
Raises 404 if the guide is not found.

---

## getAllLocalGuides()

**Method:** GET
**Path:** /getAllLocalGuides
Retrieves all local guides from the database.
Returns 404 if none are found.

---

## deleteLocalGuide()

**Method:** DELETE
**Path:** /deleteLocalGuide/{guide_id}
Allows only admin users to delete a local guide by ID.
Removes the record permanently from the database.
