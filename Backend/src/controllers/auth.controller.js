const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenblacklistmodel = require("../models/blacklist.model");


/**
 * @name registerUserController
 * @description Register a new user, expects username, email, password in request body
 * @access public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this username or email address"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}


/**
 * @name loginUserController
 * @description Login a user, expects username and password in request body
 * @access public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token)
    res.status(201).json({
        message: "user logged in successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req,res) {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        
        if(!token){
            return res.status(400).json({ message: "No token provided for logout" });
        }

        await tokenblacklistmodel.create({token})
        
        res.clearCookie("token")
        res.status(200).json({
            message:"user logged out successfully"
        })
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error during logout" });
    }
}

/**
 * @name getUserController
 * @description Get the current loggedin user details
 * @access private
 */

async function getUserController(req, res) {
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserController
};