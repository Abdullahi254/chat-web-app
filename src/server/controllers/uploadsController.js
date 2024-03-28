const dbClient = require("../utils/db");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

const uploadFile = async (req, res) => {
  console.log(req.files);
  res.send("File uploaded");
};

module.exports = { uploadFile, uploads };
