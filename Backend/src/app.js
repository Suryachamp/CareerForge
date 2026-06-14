const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Support both localhost and 127.0.0.1 loopbacks
    credentials: true, // Crucial for allowing cookies (like your auth tokens) to be sent
  }),
);
app.use(express.json());
app.use(cookieParser());

// REQUIRE ALL THE ROUTES HERE
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const resumeRouter = require("./routes/resume.routes");

// USING ALL THE ROUTES HERE
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/resume", resumeRouter);

module.exports = app;
