const amazonCognitoIdentity = require('amazon-cognito-identity-js');
const constants = require('constants');
const e = require('express');

const poolData = {
    UserPoolId: constants.awsPoolConfig.userPoolId,
    ClientId: constants.awsPoolConfig.poolClientId
};
const userPool = new amazonCognitoIdentity.CognitoUserPool(poolData);

// create user
module.exports.createUserService = async (reqData) => {
    let email = reqData.emailValue;
    let password = reqData.password;
    let confirmPassword = reqData.confirmpassword;
    let attributeList = [];
    if (password != confirmPassword) {
        throw "Passwords donot match"
    }
    else {
        attributeList.push(new amazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
        return new Promise((resolve, reject) =>
            userPool.signUp(email, password, attributeList, null, (err, result) => {
                if (err) { reject(err); }
                else { resolve(result); }
            })
        );
    }
};

module.exports.userConfirmRegistrationService = async (reqData) => {
    let emailCode = reqData.code;
    let userName = reqData.email;
    const userData = { Username: userName, Pool: userPool }
    const cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) =>
        cognitoUser.confirmRegistration(emailCode, true, function (err, result) {
            if (err) { reject(err); }
            else { resolve(result); }
        })
    );
};

// login user
module.exports.userLoginService = async (reqData) => {
    let userName = reqData.username;
    let password = reqData.password;
    const authenticationDetails = new amazonCognitoIdentity.AuthenticationDetails({
        Username: userName,
        Password: password
    });
    const userData = { Username: userName, Pool: userPool }
    const cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
    return new Promise(function (resolve, reject) {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => { resolve(result); },
            onFailure: (err) => { reject(err); }
        })
    })
};

// forgot password
module.exports.forgotPasswordService = async (reqData) => {
    let userName = reqData.username;
    let cognitoUser = new amazonCognitoIdentity.CognitoUser({ Username: userName, Pool: userPool });
    return new Promise(function (resolve, reject) {
        cognitoUser.forgotPassword({
            onSuccess: (result) => { resolve(result); },
            onFailure: (error) => { reject(error); }
        })
    });
};

// confirm password
module.exports.confirmPasswordService = async (reqData) => {
    let userName = reqData.username;
    let verificationCode = reqData.verificationcode;
    let newPassword = reqData.newpassword;
    let userData = { Username: userName, Pool: userPool }
    let cognitoUser = new amazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) =>
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onFailure: (err) => { reject(err); },
            onSuccess: (result) => { resolve(result); }
        })
    );
};