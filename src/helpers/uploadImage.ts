/* MODULES IMPORTS */
import multer from "multer"
import path from 'node:path'


const storage = multer.diskStorage({
  // Defining the destination dir for uploaded files
  destination: function (req, file, cb) {
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    const fileExtension = path.extname(file.originalname).toLowerCase()
    const uploadError = allowedExtensions.includes(fileExtension)
      ? null
      : new Error("Invalid image type on upload")
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    // Removing spaces
    const fileName = path.parse(file.originalname).name.replace(/\s+/g, "-")
    // Getting original extension
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${fileName}-${Date.now()}${fileExt}`);
  }
})

export const uploadImage = multer({ storage: storage })