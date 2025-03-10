// config/gridfs.js
import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Customize the filename as needed
      const filename = Date.now() + "-" + file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads", // Bucket name should match your desired collection (default: fs)
      };
      resolve(fileInfo);
    });
  },
});

export default storage;
