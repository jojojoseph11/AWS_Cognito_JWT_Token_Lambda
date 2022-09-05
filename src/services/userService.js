const request = require('request');
const exif = require("exif-parser");
const awsService = require("./awsService");


const BUCKET_NAME = 'factweavers-aws-training-s3-bucket-jojo';

// Fetching image from url data
const fetchImage = async (url) => {
    return new Promise((resolve, reject) => {
        request({ url, encoding: null }, (err, resp, buffer) => {
            if (err) {
                resolve(null);
            }
            resolve(buffer);
        });
    });
};

// upload image 
module.exports.uploadImageService = async (reqData) => {
    try {
        let fileContent = await fetchImage(reqData);
        let fileName = reqData.replace(/^.*[\\\/]/, '');
        let metaData = exif.create(fileContent).parse();
        const params = {
            Bucket: BUCKET_NAME,
            Key: 'aws_imagelist/' + fileName,
            Body: fileContent
        };
        let results = await awsService.addImageObject(params);
    }
    catch (error) { throw (error); }
};

// get image
module.exports.getImageService = async (fileName) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName
    };
    try {
        let results = await awsService.getImageObject(params);
        return results;
    }
    catch (error) { throw (error); }
};

// list image 
module.exports.listImageService = async () => {
    const params = {
        Bucket: BUCKET_NAME,
        Prefix: 'aws_imagelist/'
    };
    try {
        let results = await awsService.listImageObject(params);
        return results; 
    }
    catch (error) { throw (error); }
}

// delete image
module.exports.deleteImageService = async (fileName) => {
    try {
        let results = await awsService.deleteImageObject(params);
        return results;
    }
    catch (error) { throw (error); }
};

// change permission
module.exports.changePermissionsService = async (reqData) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: reqData.filename,
        ACL: reqData.permissions
    };
    try {
        let results = await awsService.changeImagePermissions(params);
        return results;
    }
    catch (error) { throw (error); }
};



