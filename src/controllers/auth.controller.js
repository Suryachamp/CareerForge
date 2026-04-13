const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");  
/**
 * @name registerUserController
 * @description Register a new user, expects username, email, password in request body
 * @access public
 */

async function registerUserController(req, res) {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
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
}

module.exports = {
    registerUserController
};