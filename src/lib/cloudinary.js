import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function unggahGambar(dataUrl, folder = 'muhyi-id') {
  const hasil = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: 'image',
    transformation: [{ width: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
  });
  return { url: hasil.secure_url, publicId: hasil.public_id };
}

export default cloudinary;
