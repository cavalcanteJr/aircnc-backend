const multer = require('multer');
const path = require('path');
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'aircnc-storage',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
}

module.exports = {
  dest: path.resolve(__dirname, '..', 'uploads'),
  storage: storageTypes['s3'],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};