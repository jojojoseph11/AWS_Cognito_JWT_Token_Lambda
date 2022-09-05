const TABLE_NAME = 'dynamoDbTableVarghese';

// Bulk save query building function
module.exports.bulkQueryGenerator = (reqData) => {
    let retData = [];
    let inputData = reqData;
    inputData.forEach(item => {
        retData.push({
            PutRequest: {
                Item: {
                    fileName: item['filename'],
                    metaData: item['metadata']
                }
            }
        });
    });
    return retData;
};

// Bulk update query building function
module.exports.bulkUpdateQueryGenerator = (reqData) => {
    let retData = [];
    let inputData = reqData;
    inputData.forEach(item => {
        retData.push({
            TableName: TABLE_NAME,
            Key: {
                "fileName": item['filename']
            },
            UpdateExpression: "set metaData = :r",
            ExpressionAttributeValues: {
                ":r": item['metadata']
            },
            ReturnValues: "UPDATED_NEW"
        });
    });
    return retData;
};

// Bulk delete query building function
module.exports.bulkDeleteQueryGenerator = (reqData) => {
    let retData = [];
    let inputData = reqData;
    inputData.forEach(item => {
        retData.push({
            DeleteRequest: {
                Key: {
                    fileName: item['filename']
                }
            }
        });
    });
    return retData;
};