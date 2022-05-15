const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024* 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
   // console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize ,         
   },  
}).single("file");



let uploadFileMiddleware = util.promisify(uploadFile);
// console.log(uploadFileMiddleware)
module.exports = uploadFileMiddleware;