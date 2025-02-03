const { supabase } = require("../../DB/supabase");

const getDataServise = async () => {
  const { data: getData, error: getError } = supabase
    .from("Writing")
    .select("*");

  if (getError) {
    console.log("데이터 찾는중에 오류", getError.message);
  }

  return getData;
};

const getSameNameDataServise = async (text) => {
  const { data: getSameNameData, error: getSameNameError } = supabase
    .from("Writing")
    .select("*")
    .eq("title", text);

  if (getSameNameError) {
    console.log("같은 이름의 데이터 찾는중에 오류", getSameNameError.message);
  }

  return getSameNameData;
};

const createDataServise = async (data) => {
  const { title, info } = data;
  console.log(title, info);

  const { data: createData, error: createError } = await supabase
    .from("Writing")
    .insert({
      title,
      info,
    });

  if (createError) {
    console.log("데이터 추가중 오류", createError.message);
  }
};

module.exports = { getDataServise, getSameNameDataServise, createDataServise };
