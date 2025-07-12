import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


export const UploadToCloudinary=async(localPath)=>{
  const uploadResult = await cloudinary.uploader
  .upload(
      localPath
  )
  .catch((error) => {
      console.log("Error while uploading to cloudinary",error);
      return "ERROR"
  });
  const cloudinary_Url=uploadResult.secure_url;
  const public_id=uploadResult.public_id;
return {cloudinary_Url,public_id};
// console.log("uploadResult",uploadResult);
}

export const deleteCloudinary=async (publicId)=>{
  await cloudinary.uploader.destroy(publicId);
} 