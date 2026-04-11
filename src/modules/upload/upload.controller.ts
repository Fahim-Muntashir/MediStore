import { Request, Response } from 'express';
import { uploadToCloudinary } from '../../lib/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file);

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error: any) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};
