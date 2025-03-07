import { Request } from "express"

export interface IMulterFilesRequest extends Request {
  files?: Express.Multer.File[]; // Array of uploaded files
}