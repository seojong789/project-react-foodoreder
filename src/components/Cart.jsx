import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting';
import Button from './UI/Button';
import UserProgressContext from '../store/UserProgressContext';
import CartItem from './CartItem';

export default function Cart() {
  const cartCtx = useContext(CartContext);

  const cartTotalPrice = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  const userProgressCtx = useContext(UserProgressContext);
  function handleCloseCart() {
    userProgressCtx.hideCart();
  }
  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === 'cart'}
      /* onClose 설정의 의미
        Go to Checkout 버튼을 눌렀을 때 ...
        만약 onClose={handleCloseCart}일 경우, userProgressCtx.progress의 값이 cart -> checkout으로 변경
        즉, open 값으로 false가 넘어가면서 해당 Modal은 종료
        -> 종료되면서 onClose={handleCloseCart} 이벤트가 발생하여 최종 userProgressCtx.progress 값은 ''이 된다.
        그래서, Checkout Modal도 출력이 안 되는 오류가 발생함.

        이를 해결하기 위해, userProgressCtx.progress의 값이 'cart'라면, Cart Modal에서 close 버튼 or ESC 키를 누른 것이고
        Go to Checkout 버튼을 누르면 'cart'가 아니라 'checkout'이므로 onClose의 값으로 null을 지정하여 해당 이벤트가 발생하지 않도록 함.
        그렇기 때문에, 정상적으로 Checkout Modal이 출력된다.
        기존 Cart Modal은 open의 값이 false이므로 자동으로 닫힘.
      */
      onClose={userProgressCtx.progress === 'cart' ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onDecrease={() => cartCtx.removeItem(item.id)}
            onIncrease={() => cartCtx.addItem(item)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotalPrice)}</p>
      <p className="modal-actions">
        <Button textOnly={true} onClick={handleCloseCart}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
