import React, { useContext } from 'react';
import logoImg from '../assets/logo.jpg';
import Button from './UI/Button';
import CartContext from '../store/CartContext';

export default function Header() {
  const cartCtx = useContext(CartContext);
  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Logo Image" />
        <h1>React Food Order</h1>
      </div>
      <nav>
        {/* prop 이름만 설정해두면 default가 true */}
        <Button textOnly>Cart ({totalCartItems})</Button>
      </nav>
    </header>
  );
}
