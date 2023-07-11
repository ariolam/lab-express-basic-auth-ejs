const { Router } = require("express");
const router = new Router();
// require bcryptjs and use it
const bcryptjs = require("bcryptjs");
// require user model
const User = require("../models/User.model");

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", async (req, res, next) => {
    // console.log(req.body);
    //copy of body
    const user = { ...req.body };
    //delete property password
    delete user.password;
    // add the ecrypted password in DB
    const salt = bcryptjs.genSaltSync(13);
    user.passwordHash = bcryptjs.hashSync(req.body.password, salt);

    try {
        const newUser = await User.create(user);
        //sending the copy with the encrypted password
        console.log(newUser);
        res.redirect("/userProfile");
    } catch (error) {
        console.log("error");
    }
});

//GET route ==> render profile page
router.get("/userProfile", (req, res) => res.render("users/user-profile"));

module.exports = router;
