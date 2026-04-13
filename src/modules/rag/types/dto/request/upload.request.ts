// multer가 처리하므로 별도 Zod 스키마 없이 타입만 정의
export interface UploadRequest {
  file: Express.Multer.File;
}
