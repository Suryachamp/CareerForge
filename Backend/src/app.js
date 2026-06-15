const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isVercel = /\.vercel\.app$/.test(origin); // Allow any Vercel deployment dynamically
      if (isLocalhost || isVercel) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
