import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
import sharp from "sharp"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const uploadImage = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ ok: false, error: 'No image file provided' });
    }

    sharp(file.buffer)
        .resize({ width: 800, height: 1197 })
        .jpeg({ quality: 80 })
        .toBuffer(async (error, data, info) => {
            if (error) {
                console.error('Image processing error:', error);
                return res.status(500).json({ ok: false, error: 'Error processing image' });
            }

            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ ok: false, error: 'Error uploading image to Cloudinary' });
                }

                res.json({ ok: true, imageUrl: result.url, message: 'Image uploaded successfully' });
            }).end(data);
         })
}

export default uploadImage