const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Loading MODELS
// Profile Model
const Profile = require('../../models/Profile');
// User Model
const User = require('../../models/User');

//@route GET api/profile
//@desc Route to get the current user's profile
//@access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Initializing errors object
    const errors = {};
    // Trying to find the profile for the user
    const findProfile = Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
    findProfile.then(profile => {
        // Checking the profile
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        // If we have the profile, return it
        res.json(profile);
    })
    findProfile.catch(err => console.log(err));
});


//@route POST api/profile
//@desc Route for registering/updating an user's profile
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body);

    // Checking fields validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Getting the profile fields passed in req.
    const profileFields = {};
    // ID comes from passport
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.skills) profileFields.skills = req.body.skills;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills
    if (typeof(req.body.skills) !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social links
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // Find a user's profile
    const findProfile = Profile.findOne({ user: req.user.id });
    
    findProfile.then(userProfile => {

        // Check if we have a profile.
        if (userProfile) {
            // If we have the user profile, we'll update it.
            const updateUserProfile = Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: false });
            updateUserProfile.then(updatedProfile => {
                // Here we have the updated user profile
                // Returning it
                res.json(updatedProfile);
            });
            updateUserProfile.catch(err => console.log(err));
        } else {
            // If we're here, the user does not have a profile
            // Let's create one

            // First, we need to check if the handle is available.
            // Trying to find a user with the handle passed
            const checkHandle = Profile.findOne({ handle: profileFields.handle });
            checkHandle.then(handleProfile => {
                if (handleProfile) {
                    // There's already a profile with this handle
                    errors.handle = 'Username already exists';
                    res.status(400).json(errors);
                }

                // If the handle is not in use, create a profile
                const createProfile = new Profile(profileFields).save();
                createProfile.then(newProfile => {
                    // Returning the new profile
                    res.json(newProfile);
                });
            })
        }
    })
})

/**
 * @route GET api/profile/handle/:handle
 * @desc Get user's profile by handle
 * @access Public
 */
router.get('/handle/:handle', (req, res) => {
    // Find user by handle
    const findUserProfile = Profile.findOne({ handle: req.params.handle }).populate('user', ['name', 'avatar']);
    findUserProfile.then(profile => {
        const erros = {};
        // Here we have the profile.
        if (!profile) {
            // If the profile does not exist
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        } else {
            // A profile for the user exists
            res.status(200).json(profile);
        }
    });
    // If anything goes wrong
    findUserProfile.catch((err) => res.status(404).json(err));
})

/**
 * @route GET api/profile/user/:user_id
 * @desc Get user's profile by id
 * @access Public
 */
router.get('/user/:user_id', (req, res) => {
    //Find user by id
    const findUserProfile = Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    findUserProfile.then(profile => {
        console.log(req.params.id);
        const errors = {};
        // Check the profile
        if (!profile) {
            errors.noprofile = 'There is no profile for this user.';
            res.status(404).json(errors);
        } else {
            // If we have a profile, we'll return it
            res.status(200).json(profile);
        }
    });
    // If anything goes wrong
    findUserProfile.catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
})

/**
 * @route GET api/profile/all
 * @desc Return all profiles
 * @access Public
 */
router.get('/all', (req, res) => {
    // Getting all profiles
    const allProfiles = Profile.find().populate('user', ['name', 'avatar']);
    allProfiles.then(profiles => {
        const errors = {};
        // Checking if we have profiles
        if (profiles.length === 0) {
            errors.noprofiles = 'There are no profiles to be shown';
            res.status(404).json(errors);
        } else {
            // Here, we have at least 1 profile, let's return it.
            res.status(200).json(profiles);
        }
    })
    // If anything goes wrong
    allProfiles.catch(err => res.status(404).json({ profiles: 'There are no profiles' }));
})

/**
 * @route POST api/profile/experience
 * @desc Adds a new experience to profile
 * @access Private
 */
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

    // Validating fields
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Find user profile
    const userProfile = Profile.findOne({ user: req.user.id });
    userProfile.then(profile => {
        // Creating new experience
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        // Addinng new experience
        profile.experience.unshift(newExp);

        // Saving profile with new experience
        profile.save().then(profile => res.status(200).json(profile));
    })
    userProfile.catch(err => res.status(404).json(err));
})

/**
 * @route POST api/profile/education
 * @description Adds a new education to profile
 * @access Private
 */
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

    // Validating fields
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Find user profile
    const userProfile = Profile.findOne({ user: req.user.id });
    userProfile.then(profile => {
        // Creating new education
        const newEducation = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }

        profile.education.unshift(newEducation);

        profile.save().then(profile => res.status(200).json(profile));
    });
    userProfile.catch(err => res.status(404).json(err));
});

/**
 * @route DELETE api/profile/experience/:exp_id
 * @description Delete an experience from the user's profile
 * @access Private
 */
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Finding the user's profile
    const userProfile = Profile.findOne({ user: req.user.id });
    userProfile.then(profile => {
        // Here we have the user's profile
        const indexes = profile.experience.map(exp => exp.id);
        // Index to remove
        const removeIndex = indexes.indexOf(req.params.exp_id);
        // Removing from the array
        profile.experience.splice(removeIndex, 1);
        // Saving profile
        profile.save().then(profile => res.status(200).json(profile));
    });
    userProfile.catch(err => res.status(404).json(err));
})
 
/**
 * @route DELETE api/profile/education/:edu_id
 * @description Delete an education from an user's profile
 * @access Private
 */
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Finding the user's profile
	const userProfile = Profile.findOne({ user: req.user.id });
	userProfile.then((profile) => {
		// Here we have the user's profile
		const indexes = profile.education.map(education => education.id);
		// The index to be remove
		const removeIndex = indexes.indexOf(req.params.edu_id);

		// Removing from education array
		profile.education.splice(removeIndex, 1);
		// Saving profiel
		profile.save().then(pŕofile => res.status(200).json(profile));
	});
	userProfile.catch(err => res.json(404).json(err));
});

/**
 * @route DELETE api/profile/
 * @description Delete an user and it's profile
 * @access Private
 */
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Finding user's profile and deleting
	const deleteUserProfile = Profile.findOneAndRemove({ user: req.user.id });
	deleteUserProfile.then(() => {
		// Delete user
		const removeUser = User.findOneAndRemove({ _id: req.user.id });
		removeUser.then(() => {
			res.status(200).json({ success: true });
		});
		removerUser.catch(err => res.status(404).json(err));
	});
	deleteUserProfile.catch(err => res.status(404).json(err));
})

module.exports = router;