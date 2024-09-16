const Validator = require("validatorjs");


// Define user schema
const userSchema = {
    fullname: 'required|string|min:2|max:50',
    address: 'required|string|min:2|max:255',
    province: 'required|string|min:2|max:50',
    district: 'required|string|min:2|max:50',
    phone_number: ['required', 'regex:/^[0-9]{10,15}$/'],
};


const validationMessages = {
    'fullname.required': 'Please enter a username',
    'fullname.min': 'Name must be at least 2 characters',
    'fullname.max': 'Name cannot exceed 50 characters',
    'address.required': 'Please enter a address',
    'address.min': 'Name must be at least 2 characters',
    'address.max': 'Name cannot exceed 255 characters',
    'phone_number.required': 'Please enter a phone number',
    'phone_number.regex': 'Phone number must be between 10 and 15 digits',
};



const validateShippingData = (userData) => {
    const validation = new Validator(userData, userSchema, validationMessages);

    if (validation.fails()) {
        console.log("Validation errors:", validation.errors.all());
        return validation.errors.all();
    } else {
        return null; // Indicates validation success
    }
};

module.exports = {
    validateShippingData
};

