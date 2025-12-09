import { v2 as cloudinary } from 'cloudinary'   // Import Cloudinary SDK (v2)
import fs from "fs"                              // File system module for deleting files

// Utility function to upload a file to Cloudinary
const uploadOnCloudinary = async (filePath) => {

    // Configure Cloudinary using environment variables
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        // Upload the file to Cloudinary using the provided file path
        const uploadResult = await cloudinary.uploader.upload(filePath)

        // Remove the local file after successful upload
        fs.unlinkSync(filePath)

        // Return the Cloudinary URL of the uploaded file
        return uploadResult.secure_url

    } catch (error) {

        // Return an error response if Cloudinary upload fails
        return res.status(500).json({ message: "cloudinary error" })
    }
}

// Export the upload function for reuse
export default uploadOnCloudinary
