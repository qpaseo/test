//완벽한거는 아님
import { useAxios } from "./api";

export const UseAxios = () => {
  const { loading, data, error } = useAxios({
    url: "https://api.github.com/repos/${owner}/${repo}",
  });
  console.log(loading, JSON.stringify(data), error);
  return <div></div>;
};
