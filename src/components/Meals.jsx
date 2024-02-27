import { useEffect, useState } from 'react';
import MealItem from './MealItem';
import useHttp from '../hooks/useHttp';

// requestConfig 객체를 Meals Component 외부에서 생성해야 무한루프 방지가능.
// 해당 {} 객체는 Meals 컴포넌트 함수에서 생성
// Meals 컴포넌트는 useHttp 요청이 완료될 때마다 재실행 된다.
// -> 즉, Meals 컴포넌트 함수가 실행될 때마다 {}객체가 재생성된다. -> useHttp의 의존성 배열에 {}가 계속 들어간다는 의미.
const requestConfig = {};

export default function Meals() {
  // async - await로 인해 시간이 지연되기 때문에 ui가 바로 출력되지 않음.
  // 따라서 그걸 막기 위해, 데이터가 없으면 없는 걸 보여주기 위한 상태 생성.
  // const [loadedMeals, setLoadedMeals] = useState([]);

  // 두 번째 파라미터인 config값 빈 객체 : GET 요청이므로...
  // 세 번째 파라미터인 initialData 값 빈 배열 : useHttp.js에서 useEffect의 경우, Component가 렌더링 된 다음에야 실행된다.
  // 즉, 아래 return 코드에서 loadedMeals의 데이터가 fetch 수행 전에, undefined로 되어있기 때문에 map에서 오류가 발생함.
  // useHttp에서 isLoading의 시작 값을 true로 바꾸게 되면, Checkout.jsx에서 useHttp를 못 씀. (결제할 때는 초기에 로딩중이 아니기 때문.)
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp('http://localhost:3000/meals', requestConfig, []);

  if (isLoading) {
    return <p>Fetching Meals...</p>;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
