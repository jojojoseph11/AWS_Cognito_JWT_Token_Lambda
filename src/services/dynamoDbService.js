const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
});
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

// Save image metadata to DynamoDB
module.exports.saveMetaData = async (paramsData) => {
    return await dynamoDbClient.put(paramsData).promise();
};

// List metadata of corresponding images
module.exports.listMetaData = async (paramsData) => {
    const scanResults = [];
    let items;
    do {
        items = await dynamoDbClient.scan(paramsData).promise();
        items.Items.forEach((item) => scanResults.push(item));
        paramsData.ExclusiveStartKey = items.LastEvaluatedKey;
    }
    while (typeof items.LastEvaluatedKey !== "undefined");
    return scanResults;
};

// Update metadata of corresponding image
module.exports.updateMetaData = async (paramsData) => {
    return await dynamoDbClient.update(paramsData).promise();

};

// Delete metadata of corresponding image
module.exports.deleteMetaData = async (paramsData) => {
    return await dynamoDbClient.delete(paramsData).promise();
};

// Bulk save metadata of corresponding images
module.exports.bulkSaveMetaData = async (paramsData) => {
    return await dynamoDbClient.batchWrite(paramsData).promise();
};

// Bulk update metadata of corresponding images
module.exports.bulkUpdateMetaData = async (paramsData) => {
    let inputData = paramsData;
    let resultData = []
    for (let item of inputData) {
        try {
            let result = await dynamoDbClient.update(item).promise();
            resultData.push(result)
        }
        catch (error) {
            resultData.push(error);
        }
    }
    return resultData
};

// Bulk delete metadata of corresponding images
module.exports.bulkDeleteMetaData = async (paramsData) => {
    return await dynamoDbClient.batchWrite(paramsData).promise();
};