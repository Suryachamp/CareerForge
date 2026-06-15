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
* Docker & Docker Compose (Optional, for containerized run)

### 🐳 Running with Docker (Recommended)
You can run the entire CareerForge suite (frontend, backend, and all configurations) with a single command using Docker.

1. Create a `.env` file in the `Backend` directory containing your keys:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   ```
2. Build and start the containers from the project root:
   ```bash
   docker compose build
   docker compose up
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

### 🔌 Manual Backend Setup
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
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   ```
4. Start the backend dev server:
   ```bash
   npm run dev
   ```

### 💻 Manual Frontend Setup
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

---

## 📄 License & Authorship

Copyright © 2026 Surya Sekhar Prajapati. All rights reserved.

This project is licensed under a custom attribution license. Anyone is free to deploy, use, and share this software for educational and personal purposes. However, no one may copy, modify, or distribute this repository while claiming authorship, copyright, or ownership over it. All copies must explicitly credit **Surya Sekhar Prajapati** as the original creator. For details, see the [LICENSE](file:///home/surya-sekhar-prajapati/Downloads/d%20drive/GenAI/LICENSE) file.

