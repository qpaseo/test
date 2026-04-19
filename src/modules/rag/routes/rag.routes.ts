import { Router } from "express";
import multer from "multer";
import { IRagController } from "../contracts/controller/rag.controller";

export const createRagRouter = (ragController: IRagController): Router => {
  const router = Router();

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("PDF 파일만 업로드 가능합니다."));
      }
    },
  });

  router.post("/upload", upload.single("file"), ragController.uploadPdf);

  return router;
};
