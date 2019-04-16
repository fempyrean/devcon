const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput (data) {

    // Errors object
    const errors = {};

    // Parsing empty fields to string

    // Handle
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    // Status
    data.status = !isEmpty(data.status) ? data.status : '';
    // Skills
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // Validating length of handle
    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle must be between 2 and 40 characters';
    }

    // Requiring profile handle
    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'A profile handle is required';
    }
    // Requiring status
    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status is required';
    }
    // Requiring skills
    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills are required';
    }

    // Validating Website
    // If a website is passed
    if (!isEmpty(data.website)) {
        // Validating the url
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    // Validating social media
    // Youtube
    if (!isEmpty(data.youtube)) {
        // Validating the url
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }
    // Twitter
    if (!isEmpty(data.twitter)) {
        // Validating the url
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }
    // Facebook
    if (!isEmpty(data.facebook)) {
        // Validating the url
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }
    // Linkedin
    if (!isEmpty(data.linkedin)) {
        // Validating the url
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL';
        }
    }
    // Instagram
    if (!isEmpty(data.instagram)) {
        // Validating the url
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
