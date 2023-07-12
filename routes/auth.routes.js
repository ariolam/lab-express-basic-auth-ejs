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

// GET route ==> to display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

// POST login route ==> to process form data
router.post("/login", async (req, res, next) => {
    // console.log(req.body);
    try {
        const userData = req.body;
        const checkedUser = await User.findOne({
            username: userData.username,
        });
        // Check is user does exists in DB
        if (checkedUser) {
            // if so, compare the password with the passwordHash in DB
            if (
                bcryptjs.compareSync(
                    userData.password,
                    checkedUser.passwordHash
                )
            ) {
                // If password is correct
                const loggedUser = { ...checkedUser._doc };
                delete loggedUser.passwordHash;
                req.session.user = loggedUser;
                res.redirect("/profile");
            } else {
                // If password is incorrect
                console.log("Password is incorrect");
                res.render("auth/login", {
                    errorMessage: "Password is incorrect",
                    payload: { username: userData.username },
                });
            }
        } else {
            // No user with this email
            console.log("No user with this email");
            res.render("auth/login", {
                errorMessage: "No user with this email",
                payload: { username: userData.username },
            });
        }
    } catch (error) {
        console.log("error occured: ", error);
        res.render("auth/login", {
            errorMessage: "There was an error on the server",
            payload: { username: userData.username },
        });
    }
});

module.exports = router;
