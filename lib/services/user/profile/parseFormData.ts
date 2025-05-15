import Busboy from "busboy";
import { Readable } from "stream";

export default async function parseFormData(
  event: any,
  userId: string
): Promise<{
  name: string;
  profileBuffer: Buffer | null;
  profileFilename: string;
}> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: event.headers });
    let name = "";
    let profileBuffer: Buffer | null = null;
    let profileFilename = "";

    busboy.on(
      "file",
      (
        fieldname: string,
        file: any,
        filename: string,
        encoding: string,
        mimetype: string
      ) => {
        profileFilename = `${userId}-${filename}`;
        const chunks: Uint8Array[] = [];
        file.on("data", (data: any) => chunks.push(data));
        file.on("end", () => {
          profileBuffer = Buffer.concat(chunks);
        });
      }
    );

    busboy.on("field", (fieldname: string, val: string) => {
      if (fieldname === "name") {
        name = val;
      }
    });

    busboy.on("finish", () => {
      resolve({ name, profileBuffer, profileFilename }); 
    });
    busboy.on("error", reject);

    const readable = Readable.from(event.body as any);
    readable.pipe(busboy);
  });
}
