import { Router } from "express";
import multer from "multer";
import { RagController } from "../controllers/ragController";

const router = Router();
const ragController = new RagController();

// multer 설정 — 메모리에만 저장 (로컬 저장 없음)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB 제한
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("PDF 파일만 업로드 가능합니다."));
    }
  },
});

// ============= RAG 라우트 =============
router.post("/upload", upload.single("file"), ragController.uploadPdf);

export default router;
