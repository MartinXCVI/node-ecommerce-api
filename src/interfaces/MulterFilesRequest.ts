import { Request } from "express"

export interface MulterFilesRequest extends Request {
  files?: Express.Multer.File[]; // Array of uploaded files
}