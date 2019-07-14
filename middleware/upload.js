require('express-async-errors');
const multer = require('multer');

module.exports = function upload() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/profile/'); // need to create folder first!!
        },

        filename: function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' ) {
                cb(null, req.user._id + '_avatar.jpg');
            } else if (file.mimetype === 'image/png') {
                cb(null, req.user._id + '_avatar.png');
            }
        }
    });

    const fileFilter = (req, file, cb) => {
        // reject a file
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    return multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });
};
