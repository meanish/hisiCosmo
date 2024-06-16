const Validator = require("validatorjs");


// Define user schema
const userSchema = {
  username: 'required|string|min:2|max:50',
  // firstname: 'required|string|min:2|max:255',
  // lastname: 'required|string|min:2|max:255',
  // address: 'required|string|min:2|max:255',
  email: 'required|email',
  password: 'required|min:8',
  // password_confirmation: 'required|same:password',
  // image: 'image|mimes:jpg,png,jpeg,gif|max:2048'
};


const validationMessages = {
  'username.required': 'Please enter a username',
  'username.min': 'Name must be at least 2 characters',
  'username.max': 'Name cannot exceed 50 characters',
  // 'firstname.required': 'Please enter a name',
  // 'firstname.min': 'Name must be at least 2 characters',
  // 'firstname.max': 'Name cannot exceed 255 characters',
  // 'lastname.required': 'Please enter a name',
  // 'lastname.min': 'Name must be at least 2 characters',
  // 'lastname.max': 'Name cannot exceed 255 characters',
  // 'address.required': 'Please enter a name',
  // 'address.min': 'Name must be at least 2 characters',
  // 'address.max': 'Name cannot exceed 255 characters',
  'email.required': 'Please enter an email address',
  'email.email': 'Please enter a valid email address',
  'email.unique': 'Email address is already in use',
  'password.required': 'Please enter a password',
  'password.min': 'Password must be at least 8 characters',
  'password.max': 'Password cannot exceed 255 characters',
  // 'required.password_confirmation': 'Please confirm your password.',
  // 'confirmed.password_confirmation': 'The password confirmation does not match.',
  // // 'image.required': 'Please upload an image.',
  // 'image.image': 'The uploaded file is not an image.',
  // 'image.mimes': 'The uploaded image must be a JPG, PNG, JPEG, or GIF file.',
  // 'image.max': 'The uploaded image must not exceed 2 megabytes.',
};



const validateUserData = (userData) => {
  const validation = new Validator(userData, userSchema, validationMessages);

  if (validation.fails()) {
    console.log("Validation errors:", validation.errors.all());
    return validation.errors.all();
  } else {
    return null; // Indicates validation success
  }
};

module.exports = {
  validateUserData
};

