# 🛠️ CareerForge - AI Career & Resume Suite

CareerForge is a premium, full-stack AI-powered career preparation and resume optimization suite designed to help candidates prepare for interviews and tailor their applications for applicant tracking systems (ATS).

Built with the MERN stack (MongoDB, Express, React, Node.js) and advanced AI reasoning models, CareerForge provides job seekers with a streamlined, real-time workspace to analyze job descriptions, build structured ATS-friendly resumes, identify critical skill gaps, and practice tailored interview questions.

---

## ✨ Key Features

### 📋 1. AI Interview Planner
* **Job Description Parsing**: Analyzes target roles and matches them with your experience and profile.
* **Custom Readiness Reports**: Computes match scores and highlights critical vs. low-priority skill gaps.
* **Tailored Practice Questions**: Generates targeted technical and behavioral questions based on your profile and target job.
* **Prep Roadmaps**: Provides step-by-step roadmap guides to bridge identified knowledge gaps.

### 📝 2. ATS Resume Builder & Editor
* **AI-Guided Resume Optimization**: Rewrites bullet points and injects relevant keywords to maximize ATS scores above 90.
* **Source Code Editor**: A split workspace featuring an interactive, syntax-highlighted source code editor.
* **Real-Time Compiler**: Visualizes parsed resumes inside a live preview panel formatted as a standard 1-page document.
* **Compile Action**: Manual compiler control to test and render edits instantly.
* **Export Options**: Copy raw resume source code or download clean source documents for external use.

### 📊 3. Analytics Dashboard & History
* **Visual Diagnostics**: Quick stats displaying average match scores, total skill gaps, and priority levels.
* **Workspace History**: Centralized log displaying all generated interview plans and optimized resumes for easy revision.

### 🔒 4. Production-Ready Authentication
* **Secure Sessions**: Protected via JSON Web Tokens (JWT) stored in secure, HTTP-only cookies to mitigate CSRF and XSS.
* **User Accounts**: Custom user signup, login, and protected route wrappers.

---

## 🏗️ Technology Stack

* **Frontend**: React (Vite), TailwindCSS, React Router Dom, Axios
* **Backend**: Node.js, Express, Cookie Parser, Multer, PDF Parse
* **Database**: MongoDB & Mongoose
* **AI Services**: Structured JSON response generation models

---

## 🚀 Getting Started

### 📂 Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas Cluster)

### 🔌 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_ai_api_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend dev server:
   ```bash
   npm run dev
   ```

### 💻 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 📐 Architecture & Workflows
For a detailed step-by-step mapping of the technical architecture, data flows, and route mappings, refer to [workflow.md](file:///home/surya-sekhar-prajapati/Downloads/d%20drive/GenAI/workflow.md).
