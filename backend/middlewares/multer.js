import multer from "multer";   // Multer middleware for handling file uploads

// Configure disk storage for uploaded files
const storage = multer.diskStorage({
    // Define the local folder where uploaded files will be stored
    destination: (req, file, cb) => {
        cb(null, "./public")   // Store files inside the /public directory
    },
    // Define the naming convention for saved files
    filename: (req, file, cb) => {
        cb(null, file.originalname)   // Save the file using its original name
    }
})

// Initialize multer with the configured storage engine
const upload = multer({ storage })

export default upload    // Export upload middleware for use in routes that accept files
