const request = require('request');
const exif = require("exif-parser");
const awsService = require("./awsService");
const dynamoDbService = require("./dynamoDbService");
const dynamoDbQueryBuilder = require("../builders/dynamoQueryBuilder");

const BUCKET_NAME = 'factweavers-aws-training-s3-bucket-jojo';
const TABLE_NAME = 'dynamoDbTableVarghese';

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

// upload image and metadata
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
        const dynamoDbParams = {
            TableName: TABLE_NAME,
            Item: { "fileName": fileName, "metaData": metaData }
        };
        let dynamoDbResults = await dynamoDbService.saveMetaData(dynamoDbParams);
        return [results, dynamoDbResults];
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

// list image and metadata
module.exports.listImageService = async () => {
    const params = {
        Bucket: BUCKET_NAME,
        Prefix: 'aws_imagelist/'
    };
    const dynamoDbParams = { TableName: TABLE_NAME };
    try {
        let results = await awsService.listImageObject(params);
        let dynamoDbResults = await dynamoDbService.listMetaData(dynamoDbParams);
        return [results, dynamoDbResults];
    }
    catch (error) { throw (error); }
}

// delete image and metadata
module.exports.deleteImageService = async (fileName) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: "aws_imagelist/" + fileName
        };
        const dynamoDbParams = {
            TableName: TABLE_NAME,
            Key: { "fileName": fileName },
            ConditionExpression: "fileName <= :val",
            ExpressionAttributeValues: { ":val": fileName }
        };
        let results = await awsService.deleteImageObject(params);
        let dynamoDbResults = await dynamoDbService.deleteMetaData(dynamoDbParams);
        return [results, dynamoDbResults];
    }
    catch (error) { throw (error); }
};

// get image public url
module.exports.getImageUrlService = async (fileName) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName
    };
    try {
        let results = await awsService.getImageUrlObject(params);
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

// update metadata
module.exports.updateMetaDataService = async (reqData) => {
    try {
        let fileName = reqData.filename;
        let metaDataValue = reqData.metadata;
        const dynamoDbParams = {
            TableName: TABLE_NAME,
            Key: { "fileName": fileName },
            UpdateExpression: "set metaData = :r",
            ExpressionAttributeValues: { ":r": metaDataValue },
            ReturnValues: "UPDATED_NEW"
        };
        let dynamoDbResults = await dynamoDbService.updateMetaData(dynamoDbParams);
        return dynamoDbResults;
    }
    catch (error) { throw (error); }
};

// bulk save image metadata
module.exports.bulkSaveMetaDataService = async (reqData) => {
    try {
        let queryResults = await dynamoDbQueryBuilder.bulkQueryGenerator(reqData);
        const dynamoDbParams = {
            RequestItems: {
                [TABLE_NAME]: queryResults
            }
        };
        let dynamoDbResults = await dynamoDbService.bulkSaveMetaData(dynamoDbParams);
        return dynamoDbResults;
    }
    catch (error) { throw (error); }
};

// bulk update image metadata
module.exports.bulkUpdateMetaDataService = async (reqData) => {
    try {
        let queryResults = dynamoDbQueryBuilder.bulkUpdateQueryGenerator(reqData);
        const dynamoDbParams = queryResults
        let dynamoDbResults = await dynamoDbService.bulkUpdateMetaData(dynamoDbParams);
        return dynamoDbResults;
    }
    catch (error) { throw (error); }
};

// bulk delete
module.exports.bulkDeleteMetaDataService = async (reqData) => {
    try {
        let queryResults = dynamoDbQueryBuilder.bulkDeleteQueryGenerator(reqData);
        const dynamoDbParams = {
            RequestItems: {
                [TABLE_NAME]: queryResults
            }
        };
        let dynamoDbResults = await dynamoDbService.bulkDeleteMetaData(dynamoDbParams);
        return dynamoDbResults;
    }
    catch (error) { throw (error); }
};