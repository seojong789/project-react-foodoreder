import { useEffect, useState } from 'react';
import MealItem from './MealItem';

export default function Meals() {
  // async - await로 인해 시간이 지연되기 때문에 ui가 바로 출력되지 않음.
  // 따라서 그걸 막기 위해, 데이터가 없으면 없는 걸 보여주기 위한 상태 생성.
  const [loadedMeals, setLoadedMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch('http://localhost:3000/meals');

      if (!response.ok) {
        //
      }

      const meals = await response.json();
      setLoadedMeals(meals);
    }

    fetchMeals();
  }, []);

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
