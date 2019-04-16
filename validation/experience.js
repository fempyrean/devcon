const Validator = require('validator');
const isEmpty = require('./is-empty');

/**
 * @author Lucas Sousa
 * @since 2019.02.19
 * @description
 * Validates user input, and return appropriate error messages.
 */
module.exports = function validateExperienceInput (data) {

    // Errors object
    const errors = {};

    // Making sure that all fields are strings
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Checking required fields.
    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job Title is required';
    }
    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company is required';
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = 'A from date is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
    
}