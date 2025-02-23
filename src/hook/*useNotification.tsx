//크롬 창에서 알림을 보내는 훅
//Notification api 사용 : https://developer.mozilla.org/en-US/docs/Web/API/Notification 참고

const useNotification = (title: string, options?: NotificationOptions) => {
  if (!("Notification" in window)) {
    return () => {};
  }
  const fireNotif = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        } else {
          console.log("알림이 허용되지 않음");
        }
      });
    } else {
      new Notification(title, options);
    }
  };

  return fireNotif;
};

export const UseNotification = () => {
  const triggerNotif = useNotification("test제목", { body: "test내용" });

  return (
    <div>
      <button onClick={triggerNotif}>hello</button>
    </div>
  );
};
