```markdown

# API Documentation

## User Endpoints

### User Login

- **Endpoint:** `/api/login`

- **Method:** `POST`

- **Description:** Authenticates a user and returns a JWT token.

#### Request

```json

{

  "email": "user@example.com",

  "password": "userpassword"

}

```

#### Response

```json

{

  "token": "jwt_token_here",

  "email": "user@example.com",

  "username": "username_here"

}

```

#### Error Responses

- **400 Bad Request:** Missing `email` or `password` in request body.

- **401 Unauthorized:** Invalid email or password.

### User Registration

- **Endpoint:** `/api/register`

- **Method:** `POST`

- **Description:** Registers a new user.

#### Request

```json

{

  "username": "username_here",

  "email": "user@example.com",

  "password": "userpassword"

}

```

#### Response

```json

{

  "username": "username_here",

  "email": "user@example.com"

}

```

#### Error Responses

- **400 Bad Request:** Invalid email format, password length less than 6, or missing required fields.

### Get All Users

- **Endpoint:** `/api/users`

- **Method:** `GET`

- **Description:** Retrieves all users.

#### Response

```json

[

  {

    "id": "user_id_here",

    "fullName": "Full Name Here",

    "username": "username_here",

    "email": "user@example.com"

  }

]

```

#### Error Responses

- **500 Internal Server Error:** Error fetching users.

### Get User by ID

- **Endpoint:** `/api/users/:id`

- **Method:** `GET`

- **Description:** Retrieves a user by ID.

#### Response

```json

{

  "id": "user_id_here",

  "fullName": "Full Name Here",

  "username": "username_here",

  "email": "user@example.com"

}

```

#### Error Responses

- **500 Internal Server Error:** Error fetching user.

## Book Endpoints

### Create a New Book

- **Endpoint:** `/api/books`

- **Method:** `POST`

- **Description:** Creates a new book entry.

#### Request

```json

{

  "name": "Book Title Here"

}

```

#### Response

```json

{

  "id": "book_id_here",

  "name": "Book Title Here",

  "creator": "user_id_here"

}

```

#### Error Responses

- **401 Unauthorized:** User not authenticated.

- **400 Bad Request:** Missing `name` in request body.

### Get All Books

- **Endpoint:** `/api/books`

- **Method:** `GET`

- **Description:** Retrieves all books along with the creator's username.

#### Response

```json

[

  {

    "id": "book_id_here",

    "name": "Book Title Here",

    "creator": {

      "username": "creator_username_here"

    }

  }

]

```

#### Error Responses

- **500 Internal Server Error:** Error fetching books.

### Favorite a Book

- **Endpoint:** `/api/books/:id/favorite`

- **Method:** `POST`

- **Description:** Allows a user to favorite a book.

#### Request

```json

{

  "bookId": "book_id_here"

}

```

#### Response

```json

{

  "message": "Book favorited successfully"

}

```

#### Error Responses

- **401 Unauthorized:** User not authenticated.

- **400 Bad Request:** User trying to favorite their own book, already favorited the book, or has reached the maximum limit of 10 favorite books.

### Get Favorite Books

- **Endpoint:** `/api/books/favorites`

- **Method:** `GET`

- **Description:** Retrieves a list of favorite books for the authenticated user.

#### Response

```json

[

  {

    "id": "book_id_here",

    "name": "Book Title Here",

    "creator": {

      "username": "creator_username_here"

    }

  }

]

```

#### Error Responses

- **401 Unauthorized:** User not authenticated.

- **500 Internal Server Error:** Error fetching favorite books.

```
