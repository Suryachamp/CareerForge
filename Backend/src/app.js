const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

    
app.use(cors({
    origin: "http://localhost:5173", // The URL of your Vite React frontend
    credentials: true // Crucial for allowing cookies (like your auth tokens) to be sent
}));
app.use(express.json());
app.use(cookieParser());

// REQUIRE ALL THE ROUTES HERE
const authRouter=require("./routes/auth.routes");


// USING ALL THE ROUTES HERE
app.use("/api/auth",authRouter); 

module.exports = app;