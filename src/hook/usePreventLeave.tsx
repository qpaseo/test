//2개의 함수를 설정하여 패이지떠나는 이벤트 방지, 실행 조정하는 함수

export const usePreventLeave = () => {
  const listener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };

  const enablePrevent = () => window.addEventListener("beforeunload", listener);
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", listener);

  return { enablePrevent, disablePrevent };
};

//사용 예시
// export const UsePreventLeave = () => {
//   const { enablePrevent, disablePrevent } = usePreventLeave();

//   return (
//     <div>
//       <button onClick={enablePrevent}>Protect</button>
//       <button onClick={disablePrevent}>Unprotect</button>
//     </div>
//   );
// };
