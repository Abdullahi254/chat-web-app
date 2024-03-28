// const dbClient = require('../utils/db');
const multer = require('multer');
const path = require('path');

// General file upload storage
const generalStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const generalUploads = multer({ storage: generalStorage });

const uploadFile = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // getting an array of file paths
    const filePaths = req.files.map(file => file.path);

    // Send file paths to the client
    res.status(200).json({ files: filePaths });
}

// Profile picture upload storage
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'profiles'));
    },
    filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const profileUpload = multer({ storage: profileStorage });

const uploadProfile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No profile were uploaded.');
    }

    // Send file paths to the client
    res.status(200).json({ profile: req.file.path });
}

module.exports = { uploadFile, uploadProfile, generalUploads, profileUpload };
