import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  console.log("Cloudinary Upload Started for:", file.originalname);
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary configuration is missing in backend .env");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'medistore',
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Stream Error:", error);
          return reject(error);
        }
        if (result) {
          console.log("Cloudinary Upload Success:", result.secure_url);
          resolve(result.secure_url);
        }
        else reject(new Error('Cloudinary upload failed'));
      }
    );

    uploadStream.end(file.buffer);
  });
};

export default cloudinary;
