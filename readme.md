# Phoenix: IMF Gadget API

Welcome, agent! This is the codebase for the **Phoenix: IMF Gadget API Development Challenge**. Your mission (should you choose to accept it) is to manage and deploy an API that helps the Impossible Missions Force (IMF) handle their gadget inventory. This secure API is built with Node.js, Express, and PostgreSQL using Prisma as our ORM.

---

## Table of Contents

- [Background](#background)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Gadget Inventory](#gadget-inventory)
- [Deployment](#deployment)
- [CI/CD with Azure Pipelines](#cicd-with-azure-pipelines)
- [Notes](#notes)
- [License](#license)

---

## Background

The IMF needs a secure API to manage their gadgets. Your mission includes:

- Retrieving the gadget inventory (with a randomly generated "mission success probability").
- Adding new gadgets with a unique, randomly generated codename.
- Updating gadget information.
- Marking gadgets as "Decommissioned" (instead of hard deletion) with a timestamp.
- Initiating a self-destruct sequence for a gadget, returning a simulated confirmation code.

**Bonus Objectives:**

- Implement robust authentication and authorization (JWT) to protect the API.
- Deploy the API on a platform such as Azure.
- Provide filtering for gadgets by status (via query parameters).

---

## Features

- **Gadget Inventory**

  - **GET `/gadgets`**  
    Retrieve all gadgets with an appended "mission success probability" (a random percentage between 50% and 100%).  
    _Optional:_ Filter by status using the query parameter (e.g., `/gadgets?status=Available`).

  - **POST `/gadgets`**  
    Create a new gadget. If a name is not provided, a unique codename is randomly generated (e.g., "Shadow Hawk").

  - **PATCH `/gadgets/:id`**  
    Update the details of an existing gadget.

  - **DELETE `/gadgets/:id`**  
    Mark a gadget as "Decommissioned" and record the time of decommission (instead of hard deletion).

  - **Self-Destruct Sequence:**  
    Initiate the self-destruct sequence for a gadget.  
    **_Note:_** The assignment originally specified a POST request to `/gadgets/{id}/self-destruct`, but here the route is implemented as a PATCH to `/gadgets/:id/self-destruct` (or adjust as needed).  
    Returns a simulated confirmation code for the self-destruct process.

- **Authentication**
  - **POST `/auth/register`**  
    Register a new user by providing a `userName` and `password`.
    - The password is hashed using bcrypt.
    - A JWT token is issued (valid for 24 hours) that includes the user's ID and username.
  - **JWT Middleware:**  
    Protects the gadget routes ensuring only authenticated users can access them.

---

## Technologies Used

- **Node.js & Express:** Server framework for building the RESTful API.
- **PostgreSQL:** Database to store gadgets and user credentials.
- **Prisma ORM:** For database modeling and querying.
- **JWT (jsonwebtoken):** To secure API endpoints via authentication.
- **bcrypt:** For secure password hashing.
- **TypeScript:** For robust type checking and improved code quality.
- **Azure DevOps Pipelines:** CI/CD configuration for continuous integration and deployment.
- **Additional Tools:** dotenv for environment variables, uuid for generating unique IDs.

---

## Project Structure

```plaintext
project-root/
├── .github/
|    └── workflows/
|         └── deploy.yml    # CI/CD configuration for Azure Pipelines
├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma       # Prisma schema including Gadget and User models
├── src/
│   ├── index.ts            # Application entry point
│   ├── app.ts              # Express app setup and route mounting
│   ├── handlers/
│   │   ├── authHandler.ts      # User registration & authentication
│   │   └── gadgetHandler.ts    # CRUD operations for gadgets and self-destruct
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # JWT authentication middleware
│   │   └── errorMiddleware.ts     # Global error handling middleware
│   ├── routes/
│   │   ├── authRoutes.ts          # Routes for authentication endpoints
│   │   └── gadgetRoutes.ts        # Routes for gadget endpoints (protected)
│   └── utils.ts   # Helper functions (e.g., for generating random names)
└── README.md
```

---

## Installation and Setup

### Prerequisites

- **Node.js** (v16 or above recommended)
- **PostgreSQL** Database
- **Yarn** or **npm** package manager

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/phoenix-imf-gadget-api.git
   cd phoenix-imf-gadget-api
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   Or, if you use Yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory with the following:

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/yourdb?schema=public
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3000
   ```

4. **Set Up Prisma:**

   - Run the Prisma generate command:
     ```bash
     npx prisma generate
     ```
   - Run migrations if you’re managing schema changes:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Build and Start the Server:**

   ```bash
   npm run build      # Compiles TypeScript (if needed)
   npm start          # Starts the server (ensure your package.json has a start script like "node dist/index.js")
   ```

6. **Access the API:**
   - Open your browser or API client (Postman) and navigate to `http://localhost:3000`.

---

## API Endpoints

### Authentication

#### **Register User**

- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user and receive a JWT token.
- **Request Body Example:**
  ```json
  {
    "userName": "agent007",
    "password": "securePassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "user": {
      "id": "uuid-generated-id",
      "userName": "agent007",
      "createdAt": "2025-02-08T12:34:56.789Z",
      "updatedAt": "2025-02-08T12:34:56.789Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Gadget Inventory (Protected Routes)

_All gadget routes require an `Authorization` header with a valid JWT:_

```
Authorization: Bearer <token>
```

#### **Get Gadgets**

- **URL:** `/gadgets`
- **Method:** `GET`
- **Description:** Retrieve a list of all gadgets. Each gadget includes a randomly generated "mission success probability" (e.g., "87% success probability"). Optionally filter by status using a query parameter:
  - Example: `/gadgets?status=Available`
- **Response Example:**
  ```json
  [
    {
      "id": "uuid-1",
      "name": "The Nightingale",
      "status": "Available",
      "createdAt": "2025-02-08T12:34:56.789Z",
      "updatedAt": "2025-02-08T12:34:56.789Z",
      "missionSuccessProbability": "87%"
    }
  ]
  ```

#### **Create Gadget**

- **URL:** `/gadgets`
- **Method:** `POST`
- **Description:** Add a new gadget. If no name is provided in the request body, a random codename is generated.
- **Request Body Example:**
  ```json
  {
    "name": "Experimental Gadget"
  }
  ```
- **Response Example:**
  ```json
  {
    "id": "uuid-2",
    "name": "Experimental Gadget",
    "status": "Available",
    "createdAt": "2025-02-08T12:40:00.123Z",
    "updatedAt": "2025-02-08T12:40:00.123Z"
  }
  ```

#### **Update Gadget**

- **URL:** `/gadgets/:id`
- **Method:** `PATCH`
- **Description:** Update the details of an existing gadget.
- **Request Body Example:**
  ```json
  {
    "name": "Updated Gadget Name",
    "status": "Deployed"
  }
  ```
- **Response:** Returns the updated gadget data.

#### **Delete (Decommission) Gadget**

- **URL:** `/gadgets/:id`
- **Method:** `DELETE`
- **Description:** Instead of hard deleting, marks the gadget as "Decommissioned" and adds a timestamp.
- **Response Example:**
  ```json
  {
    "id": "uuid-2",
    "name": "Experimental Gadget",
    "status": "Decommissioned",
    "decommissionedAt": "2025-02-08T12:45:00.123Z",
    "createdAt": "2025-02-08T12:40:00.123Z",
    "updatedAt": "2025-02-08T12:45:00.123Z"
  }
  ```

#### **Self-Destruct Sequence**

- **URL:** `/gadgets/:id/self-destruct`
- **Method:** `PATCH`  
  _Note: The assignment originally specified a POST, but the endpoint here is implemented as a PATCH._
- **Description:** Initiates a self-destruct sequence for a gadget, returning a randomly generated 6-digit confirmation code.
- **Response Example:**
  ```json
  {
    "message": "Self-destruct sequence initiated for gadget uuid-2",
    "confirmationCode": 123456
  }
  ```

---

## Deployment

This API is deployed on Azure App Service. All environment variables (like `DATABASE_URL` and `JWT_SECRET`) are configured via the Azure Portal under **Settings > Configuration**.

### CI/CD

Our CI/CD pipeline is defined in the `azure-pipelines.yml` file. The pipeline:

- Installs Node.js and dependencies.
- Builds the project (compiling TypeScript).
- Runs tests.
- Publishes the build artifact.
- Deploys the artifact to the Azure App Service.

---

## Notes

- **Authentication:** All gadget routes are protected by JWT. Make sure to register a user via `/auth/register` and use the token in the `Authorization` header as `Bearer <token>`.
- **Error Handling:** The API uses a global error middleware to handle unexpected errors gracefully.
- **Self-Destruct Endpoint:** Although the assignment specified a POST request for the self-destruct sequence, it has been implemented as a PATCH endpoint. Adjust as necessary to suit your needs.

---

## License

This project is provided for the purpose of the IMF Gadget API Challenge. Feel free to fork and modify as needed for your mission. © 2025 IMF Solutions.

---

Good luck, agent, and happy coding!
