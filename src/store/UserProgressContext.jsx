import { createContext, useState } from 'react';

const UserProgressContext = createContext({
  progress: '', // 'cart', 'checkout'
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
  // 초기값 '' -> Cart 모달 창 or Checkout(결제) 모달 창 다 안 띄우겠다.
  const [userProgress, setUserProgress] = useState('');

  function showCart() {
    setUserProgress('cart'); // showCart가 호출되면 Cart Modal창 출력
  }
  function hideCart() {
    setUserProgress('');
  }
  function showCheckout() {
    setUserProgress('checkout');
  }
  function hideCheckout() {
    setUserProgress('');
  }

  const userProgressCtx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
