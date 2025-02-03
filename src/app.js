//req : request : 킅라가 보낸 데이터
//res : 서버가 클라한테 보내는 데이터

const http = require("http");

const {
  getData,
  getSameNameData,
  createData,
} = require("./controllers/data/data.controller"); // 컨트롤러
const { signin, signup } = require("./controllers/data/auth.controller"); // 컨트롤러

// ----------------------서버 라우팅(컨트롤러 연결)-------------------------------
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    if (req.method === "GET") {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

      //데이터 불러오기
      if (parsedUrl.pathname === "/") {
        await getData(req, res);
        return;
      }

      //같은 이름의 제목을 가진 데이터만 불러오기
      if (parsedUrl.pathname === "/same") {
        await getSameNameData(req, res, parsedUrl);
        return;
      }
    }

    if (req.method === "POST") {
      //로그인
      if (req.url === "/signin") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsedBody = JSON.parse(body);
            await signin(req, res, parsedBody);
          } catch (parseError) {
            res.end(JSON.stringify({ message: "JSON 변경중 오류 발생" }));
          }
        });
        return;
      }

      //회원가입
      if (req.url === "/signup") {
        //클라에서 보낸 데이터 json으로 처리
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsedBody = JSON.parse(body);
            await signup(req, res, parsedBody);
          } catch (parseError) {
            res.end(JSON.stringify({ message: "JSON 변경중 오류 발생" }));
          }
        });
        return;
      }

      //데이터 추가
      if (req.url === "/create") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsedBody = JSON.parse(body);
            await createData(req, res, parsedBody);
          } catch (parseError) {
            res.end(JSON.stringify({ message: "JSON 변경중 오류 발생" }));
          }
        });
        return;
      }
    }
  } catch (err) {
    if (!res.headersSent) {
      res.end(
        JSON.stringify({ message: `Internal Server Error, ${err.message}` })
      );
    }
  }
});
// -----------------------------------------------------

module.exports = server;
