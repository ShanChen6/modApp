const multer = require('multer')

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/png||jpeg||jpg||gif$i/)) {
            // You can always pass an error if something goes wrong:
            cb(new Error('File does not support'), false)
            return
        }

        cb(null, true)
    },
})
