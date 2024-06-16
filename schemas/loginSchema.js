const Validator = require("validatorjs");



//for login validate form
const loginSchema = {
    email: 'required|email',
    password: 'required|min:8|max:255',

};
const validationMessages = {
    'email.required': 'Please enter an email address',
    'email.email': 'Please enter a valid email address',
    'email.unique': 'Email address is already in use',
    'password.required': 'Please enter a password',
    'password.min': 'Password must be at least 8 characters',
    'password.max': 'Password cannot exceed 255 characters',
};

const validateloginData = (userData) => {
    const Validation = new Validator(userData, loginSchema, validationMessages);
    if (Validation.fails()) {
        return Validation.errors.all();
    } else {
        return null; // Indicates validation success
    }
};


module.exports = { validateloginData }


