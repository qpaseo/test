//confirm을 쉽게 설정할수 있는 사용자 정의 함수

export const useConfirm = (
  message: string,
  callbeck: Function,
  rejection: Function
) => {
  const confirmmAction = () => {
    if (confirm(message)) {
      callbeck();
    } else {
      rejection();
    }
  };
  return confirmmAction;
};

//사용 예시
// export const UseConfirm = () => {
//   const deleteFunction = () => console.log("delete");
//   const about = () => console.log("about");
//   const confrmDelete = useConfirm("?", deleteFunction, about);
//   return (
//     <div>
//       <h1>hi!</h1>
//       <button onClick={confrmDelete}>delete</button>
//     </div>
//   );
// };
