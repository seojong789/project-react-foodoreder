import { createContext, useReducer } from 'react';

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    // findIndex에서 원하는 항목을 찾지 못하면 -1 반환.
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    // -1보다 크면, 현재 추가하려는 항목이 이미 배열에 있다는 의미.
    if (existingCartItemIndex > -1) {
      // 배열에 동일한 항목을 늘릴 필요 없이, 개수와 가격 등을 늘리면 돼.
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };

      // updatedItems는 변경 전의 값의 복사본이니까, 새 값(개수 + 1)을 복사본 배열에 업데이트 해줘야 해.
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // -1이라면 현재 추가하려는 항목이 배열에 없으므로 추가.
      // 이때, state.items에 추가하는 것이 아니라 복사본을 만들어서 추가하고, 나중에 상태 업데이트.
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    // reducer는 업데이트된 상태를 반환함.
    return { ...state, items: updatedItems };
  }
  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      // 제거하려는 항목의 양의 개수가 1개라면 항목 자체를 지워야함.
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      // 제거하려는 항목의 양의 개수가 2개 이상 -> 개수 -1
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };

      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] };
  }

  // 위의 if에 해당하지 않으면 현재 state 반환.
  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item: item });
  }
  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id: id });
  }
  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  // console.log(cartContext);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
