const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require('path');
const {aws_access_key,aws_secret_key} = require('../config');
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    credentials: {
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key
    },
    region: "us-east-2" // this is the region that you select in AWS account
})

const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "macrohard", // change it as per your project requirement
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

exports.uploadImage = multer({
    storage: s3Storage,
    limits: {
        fileSize: 1024 * 1024 * 30 // 2mb file size
    }
});