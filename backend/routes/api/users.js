const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check("firstName")
        .exists({ checkFalsy: true })
        .withMessage("First Name is required"),
    check("lastName")
        .exists({ checkFalsy: true })
        .withMessage("Last Name is required"),
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Invalid email"),
    check("username")
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Username is required."),

    check("username").not().isEmail().withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    handleValidationErrors,
];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const currUser = req.user;

        // if (currUser) {
        //     const err = new Error("User is already logged in, please sign out");
        //     err.status = 403;
        //     return next(err);
        // }

        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        let user;

        //Try to create a user
        try {
            //An error is thrown here when there is a attribute error
            user = await User.create({ email, username, hashedPassword, firstName, lastName });


        }
        //If the model validation/constraint finds and Error, catch the error and send it to the error handler
        catch (err) {

            err.message = 'User already exists';
            err.errors = err.errors
            err.status = 500;

            return next(err)
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,

        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);




router.use(requireAuth);






module.exports = router;
