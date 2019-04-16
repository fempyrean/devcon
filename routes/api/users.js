const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Loading input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Loading user model
const User = require('../../models/User');

//@route    POST api/users/register
//@desc     Route for registering an user
//@access   Public
router.post('/register', (req, res) => {
    // Validating request body
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Checking if e-mail sent already exists
    const findUseremail = User.findOne({ email: req.body.email });

    findUseremail.then(user => {
        if (user) {
            // If e-mail already exists, return error.
            errors.email = 'Email already exists';
            return res.status(400).json({ errors });
        } else {
            // If e-mail does not exist, register an user with the email.
            // Checking if the user has an gravatar account
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size of the image
                r: 'pg', // Rating of image
                d: 'mm' // Default image
            });
            
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });

            // Hashing the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Setting the newUser password to be the hashed password
                    newUser.password = hash;
                    // Saving the new user
                    const saveUser = newUser.save();
                    saveUser.then(user => {
                        // Returning a response
                        res.json(user);
                    });
                    saveUser.catch(err => console.log(err));
                })
            })
        }
    });
});

//@route    POST api/users/login
//@desc     Login User / Return JWT
//@access   Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Filed validation
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Finding an user by email
    const findUser = User.findOne({ email: email });

    findUser.then(user => {
        // Check user
        if (!user) {
            // Return error, there's no user
            errors.email = 'User not found'
            return res.status(404).json(errors);
        }

        // Here, we have a user, and we're gonna check the password.
        const comparePassword = bcrypt.compare(password, user.password);
        // Comparing password sent, to the user's password
        comparePassword.then(isMatch => {
            // Checking the password
            if (isMatch) {
                // Passwords match

                // Creating payload to pass to jwt.sign
                /**
                 * The JWT generated will contain the information in the payload.
                 */
                const payload = { id: user.id, name: user.name, avatar: user.avatar };

                // Sign Token
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    // Sending response
                    res.json({
                        success: true,
                        token: `Bearer ${token}` // Returning the Token generated.
                    })
                });
            } else {
                errors.password = 'Password incorrect';
                return res.status(400).json(errors);
            }
        })
    })
})

//@route GET api/users/current
//@desc Return current logged user
//@access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;