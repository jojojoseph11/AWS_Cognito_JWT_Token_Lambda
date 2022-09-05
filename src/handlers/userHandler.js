const services = require("../services/userService");
const cognitoServices = require("../services/cognitoService")
const fs = require("fs");
const responseHandler = require("./responseHandler");
const { DynamoDB } = require("aws-sdk");
// Upload image to S3 bucket
// Save image metadata to DynamoDB table
module.exports.uploadImage = async (event) => {
    let fileName = JSON.parse(event.body).filename;
    try {
        let [results, databaseResults] = await services.uploadImageService(fileName);
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
        let [results, databaseResults] = await services.listImageService();
        return responseHandler.success("successfully retrieved images and metadatas",
            { "Images": results.Contents.map(a => a.Key), "Metadata": databaseResults })
    }
    catch (error) {
        return responseHandler.error("Couldnot retrieve images and metadatas", error)
    }
};

// Update image
module.exports.updateImage = async (event) => {
    let fileName = JSON.parse(event.body).filename;
    try {
        let results = await services.uploadImageService(fileName);
        return responseHandler.success("Image successfully updated", null)
    }
    catch (error) {
        return responseHandler.error("Couldnot update image", error)
    }
};

// Delete Image and corresponding metadata
module.exports.deleteImage = async (event) => {
    let fileName = event.queryStringParameters.filename;
    try {
        let [results, dynamoDbResults] = await services.deleteImageService(fileName);
        return responseHandler.success("Successfully deleted image and metadata", null)
    }
    catch (error) {
        return responseHandler.error("Couldnot delete image and metadata", error)
    }
};

// Get image public URL from s3 bucket
module.exports.getImageUrl = async (event) => {
    let fileName = event.queryStringParameters.filename;
    try {
        let results = await services.getImageUrlService(fileName);
        return responseHandler.success("Successfully retrieved image public Url",
            results.split("?")[0])
    }
    catch (error) {
        return responseHandler.error("Couldnot retrieve image public Url", error)
    }
};

// Change image permissions
module.exports.changePermissions = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await services.changePermissionsService(reqData);
        return responseHandler.success("Successfully changed image permission", null)
    }
    catch (error) {
        return responseHandler.error("Couldnot change image permissions", error)
    }
};

// Update metadata of an image
module.exports.updateMetaData = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await services.updateMetaDataService(reqData);
        return responseHandler.success("Metadata successfully updated", null)
    }
    catch (error) {
        return responseHandler.error("Couldnot update metadata", error)
    }
};

// Bulk save metadatas
module.exports.bulkSaveMetaData = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await services.bulkSaveMetaDataService(reqData);
        return responseHandler.success("Metadatas successfully saved", null)
    }
    catch (error) {
        return responseHandler.error("Error while saving metadatas", error)
    }
};

// Bulk update metadatas
module.exports.bulkUpdateMetaData = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await services.bulkUpdateMetaDataService(reqData);
        return responseHandler.success("Metadatas successfully updated", null)
    }
    catch (error) {
        return responseHandler.error("Error while updating metadatas", error)
    }
};

// Bulk delete metadatas
module.exports.bulkDeleteMetaData = async (event) => {
    let reqData = JSON.parse(event.body);
    try {
        let results = await services.bulkDeleteMetaDataService(reqData);
        return responseHandler.success("Metadatas successfully deleted", null)
    }
    catch (error) {
        return responseHandler.error("Couldnot delete metadatas", error)
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