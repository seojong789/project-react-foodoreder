import { createContext, useReducer } from 'react';

export const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

function CartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    // 이미 있는 경우 (개수 추가), 없는 경우 (아이템 추가 -> 이때 quantity 프롭 추가)
    const existingCartItemIdx = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const updatedItems = [...state.items];

    if (existingCartItemIdx > -1) {
      // 아이템 배열에 있다는 의미 -> 개수 추가
      const existingItem = updatedItems[existingCartItemIdx];

      const updateItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
    } else {
      // 아이템 배열에 없어서 새로 추가
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }
  if (action.type === 'REMOVE_ITEM') {
    // 배열에 있다면 없다면 나눠야하나?

    // 1개 or 여러 개
    const updatedItems = [...state.items];
    if (state.item.quantity > 1) {
      const updateItem = {
        ...state.items[existingCartItemIdx],
        quantity: state.items[existingCartItemIdx].quantity - 1,
      };
    } else if (state.item.quantity === 1) {
      updatedItems.filter((item) => item.id !== action.item.id);
    }
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(CartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item: item });
  }
  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id: id });
  }

  const cartContext = {
    item: cart.items,
    addItem,
    removeItem,
  };

  return <CartContext.Provider>{children}</CartContext.Provider>;
}
