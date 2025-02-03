const {
  getDataServise,
  getSameNameDataServise,
  createDataServise,
} = require("../../services/data/data.service");

const getData = async (req, res) => {
  try {
    const userData = await getDataServise();

    res.setHeader("Content-Type", "application/json"); // 해더 설정
    res.statusCode = 200; // 코드 설정
    res.end(JSON.stringify(userData));
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: error.message }));
  }
};

const getSameNameData = async (req, res, parsedUrl) => {
  try {
    const queryParams = parsedUrl.searchParams; // ? 이후의 쿼리 스트링 가져옴
    const text = queryParams.get("text");
    const userData = await getSameNameDataServise(text);

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return;
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: error.message }));
  }
};

const createData = async (req, res, title, info) => {
  try {
    const userData = await createDataServise(title, info);

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { getData, getSameNameData, createData };
