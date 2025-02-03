const { supabase } = require("../../DB/supabase");

const signinServise = async (email, password) => {
  const { data: signinData, error: signinError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signinError) {
    console.log("로그인 중에 오류", signinError.message);
  } else {
    return;
  }
};

const signupServise = async (email, password) => {
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    console.log("회원가입 중에 오류", signupError.message);
  } else {
    return;
  }
};

module.exports = { signinServise, signupServise };
