const services = require("../services/userService");
const cognitoServices = require("../services/cognitoService")
const fs = require("fs");
const responseHandler = require("./responseHandler");
const { DynamoDB } = require("aws-sdk");
// Upload image to S3 bucket
// Save image
module.exports.uploadImage = async (event) => {
    let fileName = JSON.parse(event.body).filename;
    try {
        let results = await services.uploadImageService(fileName);
        return responseHandler.success("successfully uploaded image and metadata", null);
    }
    catch (error) {
        return responseHandler.error("Couldnot upload image and metadata", error)
    }
};

// Get image from s3 bucket
module.exports.getImage = async (event) => {
    let fileName = event.queryStringParameters.filename;
    try {
        let results = await services.getImageService(fileName);
        return responseHandler.success("successfully retrieved image", results)
    }
    catch (error) {
        return responseHandler.error("Couldnot retrieve image", error)
    }
};

// List all images and their metadatas
module.exports.listImages = async () => {
    try {
        let results = await services.listImageService();
        return responseHandler.success("successfully retrieved images and metadatas", results);
    }
    catch (error) {
        return responseHandler.error("Couldnot retrieve images and metadatas", error)
    }
};


// User signup
module.exports.createUser = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await cognitoServices.createUserService(reqData);
        return responseHandler.success("User successfully created", results)
    }
    catch (error) {
        return responseHandler.error("Couldnot create user", error)
    }
};

// Account confirmation
module.exports.userConfirmRegistration = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await cognitoServices.userConfirmRegistrationService(reqData);
        return responseHandler.success("User successfully registered", results)
    }
    catch (error) {
        return responseHandler.error("Couldnot verify user", error)
    }
};

// User login
module.exports.userLogin = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await cognitoServices.userLoginService(reqData);
        let accessToken = results.getAccessToken().getJwtToken();
        return responseHandler.success("User successfully loggedin", accessToken)
    }
    catch (error) {
        return responseHandler.error("Couldnot login user", error)
    }
};

// Forgot password
module.exports.forgotPassword = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await cognitoServices.forgotPasswordService(reqData);
        return responseHandler.success("OTP send to registered email",
            results)
    }
    catch (error) {
        return responseHandler.error("Couldnot send OTP", error)
    }
};

// Confirm password
module.exports.confirmPassword = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await cognitoServices.confirmPasswordService(reqData);
        return responseHandler.success("Password changed successfully", results)
    }
    catch (error) {
        return responseHandler.error("Couldnot send OTP", error)
    }
};