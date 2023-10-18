exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }

    const imageUrl = `http://localhost:4000/static/public/uploads/images/${req.file.filename}`;
    return res.status(200).json({
        status: 'success',
        data: {
            imageUrl: imageUrl,
        },
    });
};

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `http://localhost:4000/static/src/uploads/files/${req.file.filename}`;
    return res.status(200).json({
        status: 'success',
        data: {
            fileUrl: fileUrl,
        },
    });
};
