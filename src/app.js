//req : request : 킅라가 보낸 데이터
//res : 서버가 클라한테 보내는 데이터

const http = require("http");
const cors = require("cors");
const corsMiddleware = cors(); // 재사용을 위해 이렇게 사용

const {
  getData,
  getSameNameData,
  createData,
} = require("./controllers/data/data.controller"); // 컨트롤러
const { signin, signup } = require("./controllers/data/auth.controller"); // 컨트롤러

// ----------------------미들웨어-------------------------------

//corsMiddleware을 받아서 실행(적용)
function runMiddleware(req, res, middleware) {
  return new Promise((resolve, reject) => {
    //Promise : 비동기적 처리에 사용되고 api요청의 상테를 확인합
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// -----------------------------------------------------

// ----------------------서버 라우팅(컨트롤러 연결)-------------------------------
const server = http.createServer(async (req, res) => {
  try {
    // CORS 미들웨어 실행
    await runMiddleware(req, res, corsMiddleware);

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
