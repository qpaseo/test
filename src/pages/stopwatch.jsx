import React, { useState, useEffect, useRef } from "react";
import "../style/Stopwatch.module.css";

function Stopwatch() {
  const [startState, setStartState] = useState(false); // 타이머를 실행을 시킬 것인가?
  const [time, setTime] = useState(0); // 돌아가는 초(0.00초까지 표현)

  const [raps, setReps] = useState({}); // 랩의 요소를 담고있는 배열
  const [rapNumber, setRapNumder] = useState(1); // 랩의 수

  const [lastTime, setLastTime] = useState([0, 0, 0, 0]); // 이전 랩의 시간 [시간, 분, 초, 밀리초]
  const timerRef = useRef(null); // 타이머 (시간 +1) ref

  function reset() {
    setStartState(false);
    setTime(0);
    setReps({});
    setRapNumder(1);
    setLastTime([0, 0, 0, 0]);
  }

  function rap(time) {
    if (startState) {
      setReps((prevRaps) => ({
        ...prevRaps,
        [rapNumber]: {
          lastTime: lastTime,
          time: time,
        },
      }));

      setLastTime(time);
      setRapNumder(rapNumber + 1);
    }
  }

  useEffect(() => {
    if (startState) {
      timerRef.current = setInterval(() => {
        setTime((Time) => Time + 1);
      }, 10); {/* 이거 조절하는데 10분 걸림... */}
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [startState]);

  const hour = time / 360000;
  const minute = (time % 360000) / 6000;
  const second = (time % 6000) / 100;
  const ms = time % 100;

  return (
    <div>
      <div>
        {String(Math.floor(hour)).padStart(2, "0")}:
        {String(Math.floor(minute)).padStart(2, "0")}:
        {String(Math.floor(second)).padStart(2, "0")}:
        {String(ms).padStart(2, "0")}
      </div>
      <button onClick={() => setStartState(true)}>시작!</button>
      <button onClick={() => setStartState(false)}>멈춰!</button>
      <button onClick={() => reset()}>초기화!</button>
      <button onClick={() => rap([hour, minute, second, ms])}>랩!</button>

      <table>
        <thead>
          <tr>
            <th>랩</th>
            <th>번호</th>
            <th>스플릿</th>
            <th>전체</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(raps).map(([key, value]) => {
            if (!value || !value.time || !value.lastTime) {
              return null;
            }

            const [lastHour, lastMinute, lastSecond, lastMs] = value.lastTime;
            const [hour, minute, second, ms] = value.time;

            const splitHour = Math.floor(hour - lastHour);
            const splitMinute = Math.floor(minute - lastMinute);
            const splitSecond = Math.floor(second - lastSecond);
            let splitMs = Math.floor(ms - lastMs);

            const totHour = Math.floor(hour);
            const totMinute = Math.floor(minute);
            const totSecond = Math.floor(second);
            const totMs = Math.floor(ms);

            if (splitMs < 0) {
              splitMs = splitMs * -1;
            }

            return (
              <tr key={key}>
                <td>랩</td>
                <td>{key}</td>
                <td>
                  {String(splitHour).padStart(2, "0")}:
                  {String(splitMinute).padStart(2, "0")}:
                  {String(splitSecond).padStart(2, "0")}:
                  {String(splitMs).padStart(2, "0")}
                </td>
                <td>
                  {String(totHour).padStart(2, "0")}:
                  {String(totMinute).padStart(2, "0")}:
                  {String(totSecond).padStart(2, "0")}:
                  {String(totMs).padStart(2, "0")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Stopwatch;

// 고민한점, 알게된점
/* 
  1. dev에 문자열을 00:00:00의 형태로 넣을수 있는가? << 가능하다 {}와 padStart을 이용한다
  2. 0.01초마다 초를 증가시킬때 분과 시도 하나의 변수를 가지고 표현이 가능한가? << 식을 잘 조정한다면 가능하다
  3. 버튼을 클릭하는것을 인식하여 프롭스를 가진 컴포넌트를 호출할수 있을까? << 
  4. 스플릿은 뭐세요..? << "전체"에서 전에있던 전체를 뺀거..? (맞기는 한것 같은데...)
  5. 테이블의 구조 복습 << 테이블에는 tbody > tr > 요소 가 있어야 한다
  6. 앞으로 프롭스나 배열을 받아와서 계산을 한다면 꼭 변수로 받아와서 계산을 합시다... (내 2시간...)
*/

// 그지같은 오류들
/* 
  1. startState을 false로 바꾸어도 멈추지 않는문제 
    setInterval과 clearInterval을 정확히 추적하기 위해 이 둘을 저장하는 Timer을 ref처리라고 관리

  2. Object.entries(raps).map이 개속 값을 불러오는 문제 << 배열에서 가져오는 것이 아닌 배열에서 변수로 값을 꺼내온 다음 연산해서 해결 << 역시 채찍비티

  3. function rap(time) 에서 만든 배열에서 undefined가 반환 << 배열에서 가져오는 것이 아닌 배열에서 변수로 값을 꺼내온 다음 연산해서 해결 << 역시 채찍비티

  4. 반환되는 값이 0.1234331244232132과 같은 이상한 값으로 반환됨(2글짜 변환이 안 먹힘) <<  배열에서 가져오는 것이 아닌 배열에서 변수로 값을 꺼내온 다음 연산해서 해결 << 역시 채찍비티

  5. 스플릿 시간이 -로 반환되는 현상 발생 << +로 변환하여 해결 (계산 해보면 맞음?!)

*/

