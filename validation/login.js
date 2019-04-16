const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput (data) {

    // Making sure data is always a string
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    const errors = {};

    // Checking that email is valid
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // Requiring email and password
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}