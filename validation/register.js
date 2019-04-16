const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Making sure data is always a string
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    
    // Validating name
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    // Validating e-mail
    if (!Validator.isEmail(data.email)) {
        errors.email = 'E-mail is invalid'
    }
    // Validating password
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 and 30 characters';
    }

    // Checking that all fields are required
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = 'E-mail is required';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password is required';
    }

    // Checking that password and password2 are the same.
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

}
