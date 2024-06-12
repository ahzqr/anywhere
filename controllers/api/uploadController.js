const cloudinary = require("cloudinary").v2

const uploadImages = async (req, res) => {
    try {
        const file = req.file;
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                fetch_format: 'auto',
                quality: "auto",
                crop: "fill",
                width: 640,
                height: 480,
                gravity: "center"

            },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            stream.end(file.buffer);
        });

        res.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.log(error);
    }
}

const uploadProfilePic = async (req, res) => {
    try {
        const file = req.file;
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                fetch_format: 'auto',
                quality: "auto",
                crop: "fill",
                width: 150,
                height: 150,
                gravity: "center"

            },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            stream.end(file.buffer);
        });

        res.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadImages,
    uploadProfilePic
}