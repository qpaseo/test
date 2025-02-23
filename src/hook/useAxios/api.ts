//1. 엑시오스 객채 타입 확인
import defaultAxios from "axios";
import { useEffect, useState } from "react";

interface AxiosState<T = any> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export const useAxios = (opts: any, axiosInstanse: any = defaultAxios) => {
  const [state, steState] = useState<AxiosState>({
    loading: true,
    error: null,
    data: null,
  });
  useEffect(() => {
    axiosInstanse(opts)
      .then((response: any) => {
        steState({
          ...state,
          loading: false,
          data: response.data,
        });
      })
      .catch((error: Error) => {
        steState({
          ...state,
          loading: false,
          data: error,
        });
      });
  }, []);
  return state;
};
