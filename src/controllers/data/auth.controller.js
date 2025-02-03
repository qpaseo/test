const {
  signinServise,
  signupServise,
} = require("../../services/data/auth.service");

const signin = async (req, res, data) => {
  try {
    const { email, password } = data;

    const userData = await signinServise(email, password);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200; // 상태 코드 설정
    res.end(); //요청 종료
  } catch {
    res.statusCode = 500; // 에러 상태 코드
    res.end(JSON.stringify({ message: error.message }));
  }
};

const signup = async (req, res, data) => {
  try {
    const userData = await signupServise(email, password);

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200; // 상태 코드 설정
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { signin, signup };
