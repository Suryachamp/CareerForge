# Comprehensive Application Workflow & Architecture Guide

This document provides a highly detailed, step-by-step technical map of the CareerForge application. It is designed to act as a definitive reference guide so that any developer can understand exactly how data flows from the user interface all the way to the database and external AI APIs.

Whenever a new feature is added, this document should be referenced and updated to maintain architectural clarity.

---

## 🏗️ High-Level Architectural Components

1. **Frontend (React/Vite)**
   - **Routing**: `react-router-dom` manages client-side navigation.
   - **State**: React context/hooks manage local UI state and global user sessions.
   - **Networking**: `axios` handles API requests to the backend.

2. **Backend (Node.js/Express)**
   - **Entry Point**: `server.js` boots the application.
   - **App Configuration**: `app.js` configures global middlewares and route registries.
   - **Routing Layer**: Maps HTTP endpoints to specific controller functions.
   - **Middleware Layer**: Intercepts requests for authentication and file parsing.
   - **Controller Layer**: Contains the core business logic.
   - **Service Layer**: Handles external AI API integrations.

3. **Data Layer (MongoDB & Mongoose)**
   - Defines strict schemas for documents (`User`, `InterviewReport`).
   - Handles secure data operations (e.g., pre-save hooks for password hashing).

---

## 🚀 Detailed Execution Workflows

### 1. Server Initialization Lifecycle
The sequence of events when the backend server boots up (`npx nodemon server.js`):

1. **Environment Setup (`server.js`)**: 
   - `require("dotenv").config()` is executed first to inject secrets (API Keys, JWT Secrets, Mongo URIs) into `process.env`.
2. **Database Connection & Self-Repair Migration (`config/db.js`)**:
   - `server.js` calls `connectToDB()`.
   - Mongoose attempts an asynchronous connection to the MongoDB Atlas cluster using `process.env.MONGO_URI`.
   - On success, it logs `"connected to Database"`.
   - **Database Auto-Migration Routines**:
     - **Resume Model Migration**: Checks for any existing resume documents missing a `uuid` field. Generates a new cryptographically secure UUID (`crypto.randomUUID()`) and saves them.
     - **Interview Report Model Migration**: Scans for any interview reports that do not possess a `uuid` field, generates a persistent UUID for each, and saves them. This prevents temporary client-side in-memory ID generation that leads to 404s when loading detailed prep plans from history.
3. **Application Configuration (`src/app.js`)**:
   - `server.js` imports the `app` instance.
   - **Global Middlewares Applied**:
     - `cors()`: Configured to accept cross-origin requests from the React frontend.
     - `express.json()` & `express.urlencoded()`: Parses incoming JSON payloads and URL-encoded data.
     - `cookieParser()`: Parses `Cookie` headers into a usable `req.cookies` object.
   - **Route Registration**:
     - `app.use("/api/auth", authRouter)`
     - `app.use("/api/interview", interviewRouter)`
4. **Server Listening (`server.js`)**:
   - `app.listen(3000)` binds the Express application to port 3000, and the server begins accepting incoming HTTP requests.

---

### 2. User Authentication Workflow

This section maps out how identity management is securely handled across the stack.

#### A. Registration Flow
1. **Frontend (`Register.jsx`)**: 
   - User types name, email, and password.
   - An `onSubmit` handler fires, preventing default form submission.
   - `axios.post('/api/auth/register', { name, email, password })` is executed.
2. **Backend Router (`auth.routes.js`)**: 
   - Intercepts `POST /api/auth/register` and passes the `req` and `res` objects to `authController.registerUserController`.
3. **Backend Controller (`auth.controller.js`)**:
   - Validates that `name`, `email`, and `password` are present.
   - Checks if a user with that email already exists in MongoDB.
   - Uses `bcrypt` to hash the raw password before saving.
   - Creates a new `User` document using `user.model.js`.
   - Generates a **JSON Web Token (JWT)** signed with `process.env.JWT_SECRET`.
   - Attaches the JWT to the response as an HTTP-only cookie (preventing XSS attacks).
   - Sends a `201 Created` JSON response containing the user data (excluding the password).
4. **Frontend Resolution**:
   - React receives the success response.
   - Updates the global authentication state (Context/Redux) to log the user in.
   - React Router redirects the user to the protected dashboard (`/`).

#### B. Authorization Verification (The `get-me` Flow)
Whenever the user refreshes the page, the frontend must verify if they are still authenticated.
1. **Frontend (`Protected.jsx` / Auth Hook)**:
   - On component mount (`useEffect`), sends `GET /api/auth/get-me`.
2. **Backend Router (`auth.routes.js`)**:
   - Intercepts `GET /api/auth/get-me`.
   - Passes the request through `authMiddleware.authUser` before reaching the controller.
3. **Backend Middleware (`auth.middleware.js`)**:
   - Extracts the JWT from `req.cookies.token`.
   - If missing, returns `401 Unauthorized`.
   - If present, verifies the token signature.
   - Decodes the user ID from the payload, fetches the user from MongoDB, and attaches it to `req.user`.
   - Calls `next()` to pass control to the controller.
4. **Backend Controller (`auth.controller.js`)**:
   - `getUserController` simply sends back the `req.user` object.
5. **Frontend Resolution**:
   - If `200 OK`, allows the user to view the protected route.
   - If `401`, kicks the user back to `/Login`.

---

### 3. AI Interview Report Generation Workflow (Core Feature)

This maps out the deepest, most complex pipeline in the application: converting a PDF and text input into a structured AI-generated assessment.

#### Phase 1: Frontend Data Collection
1. User navigates to the Interview Generation page.
2. User fills out two text fields (`selfDescription`, `jobDescription`) and uploads a PDF file (`resume`).
3. Frontend packages this into a `FormData` object (because it contains a binary file).
4. `axios.post('/api/interview', formData, { headers: { 'Content-Type': 'multipart/form-data' }})` is executed.

#### Phase 2: Request Interception & Validation
1. **Backend Router (`interview.routes.js`)**: 
   - Catches `POST /api/interview`.
2. **Middleware 1: Authentication (`auth.middleware.js`)**:
   - Ensures the request is coming from a valid, logged-in user (extracts JWT from cookie).
3. **Middleware 2: File Parsing (`file.middleware.js`)**:
   - `multer` intercepts the `multipart/form-data` stream.
   - Identifies the field named `resume`.
   - Validates that the file size is under 3MB (`fileSize: 3*1024*1024`).
   - Buffers the file into RAM (`multer.memoryStorage()`) so it never touches the server's hard drive, improving speed and security.
   - Attaches the binary buffer to `req.file.buffer`.

#### Phase 3: Data Extraction & Controller Logic
1. **Controller (`interview.controller.js`)**:
   - Extracts `req.body.selfDescription` and `req.body.jobDescription`.
   - Passes `req.file.buffer` to the `pdf-parse` library.
   - `pdf-parse` reads the binary PDF data and synchronously converts it into raw UTF-8 string text (`resumeContent`).
   - The controller then calls `generateInterviewReport(resumeContent, selfDescription, jobDescription)` from the AI service.

#### Phase 4: AI Processing via AI Service
1. **Service (`ai.service.js`)**:
   - Interpolates the `resume`, `selfDescription`, and `jobDescription` strings into a strict, highly engineered AI prompt.
   - Defines a native structured JSON schema that dictates the exact response structure the AI must return (Match Score, Technical Questions, Behavioural Questions, Skill Gaps, Preparation Plan).
   - Sends the request to the AI model using structured JSON response configurations.
   - **Error Handling**: Wraps the network call in a `try...catch` block. If AI servers return an overload or quota exceeded error, it catches the error to prevent the Node.js process from crashing.
   - Parses the returned string into a native JavaScript object (`JSON.parse(response.text)`).

#### Phase 5: Persistence & Response
1. **Database Persistence (`interviewreport.model.js`)**:
   - The controller receives the parsed JSON object from the AI service.
   - It normalizes the data to match the database schemas (technical questions, behavioural questions, skill gaps, preparation plan).
   - It instantiates a new `InterviewReport` Mongoose document.
   - It ties the report to the current user's ID (`req.user._id` from the auth middleware).
   - Saves the document to MongoDB.
2. **Client Response**:
   - The controller sends a `201 Created` response with the structured JSON report back to the frontend.
3. **Frontend Rendering**:
   - React receives the JSON.
   - Dynamically maps over the `preparationPlan` array to render a timeline component.
   - Displays the `matchScore` visually.
   - Maps over the `technicalQuestions` and `behaviouralQuestionsSchema` to create expanding accordions.

---

### 4. ATS Resume Builder & Real-Time Compiler Workflow

This maps out the workflow for building, optimizing, compiling, and reviewing resumes:

#### Phase 1: Frontend Form Collection & Target Role Submission
1. User navigates to `/resume/new`.
2. User fills in personal details, skills, experience, projects, education, and target job description.
3. On submission, the form data is parsed and sent via `POST /api/resume/optimize` to the backend.

#### Phase 2: AI Prompt Engineering & Resume Generation
1. **Backend Controller (`resume.controller.js`)**:
   - Captures form fields and target job description from `req.body`.
   - Delegates optimization to `ai.service.js`.
2. **AI Service (`ai.service.js`)**:
   - Compiles user profile details and templates.
   - Instructs the AI model to optimize the resume fields specifically matching keywords from the job description, compute an ATS score estimate, and generate structural source code using the standard template.
   - Returns a structured JSON containing the computed score, tailoring suggestions, and compiled source code.

#### Phase 3: DB Persistence & Redirect
1. The backend controller saves the optimized document to MongoDB, associated with the user's ID.
2. The server responds with the saved resume document.
3. The frontend receives the response and redirects the user to the interactive workspace at `/resume/:id`.

#### Phase 4: Split Editor & Real-Time Client-Side Parsing
1. The workspace at `/resume/:id` mounts with the source code editor on the left and preview pane on the right.
2. **Left Editor Pane**:
   - Pre-renders syntax-highlighted source code matching the theme.
   - Captures user edits and updates local react state.
3. **Right Preview Pane**:
   - The user triggers a recompile action by clicking the Compile button.
   - A client-side parser parses the source commands into clean HTML elements.
   - Renders the structured preview formatted as an A4 document template.

---

## 🛠️ Modifying & Adding Workflows

When you add a new feature (e.g., "Delete Interview Report"), update this document using the same standard flow:
1. Define the Frontend action.
2. Define the Router endpoint.
3. Define the applicable Middlewares.
4. Define the Controller logic.
5. Define the Database interaction.
6. Define the Frontend state update.