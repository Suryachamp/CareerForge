const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

    
app.use(express.json());
app.use(cookieParser())

// REQUIRE ALL THE ROUTES HERE
const authRouter=require("./routes/auth.routes");


// USING ALL THE ROUTES HERE
app.use("/api/auth",authRouter); 

module.exports = app;