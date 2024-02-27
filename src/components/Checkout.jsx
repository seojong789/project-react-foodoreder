import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input';
import UserProgressContext from '../store/UserProgressContext';
import Button from './UI/Button';

export default function Checkout() {
  const cartCtx = useContext(CartContext);

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  const userProgressCtx = useContext(UserProgressContext);

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(event) {
    // backend 서버로 데이터를 보내기 위해, 기존 form 기능(새로고침 or 다른 URL 이동)을 막기 위함.
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries()); // 결과 값으로 객체 받음. { email: userInput@naver.com }

    // http request를 사용하여 customerData를 backend 서버로 보냄.
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    });
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        {/* 
          input에서 name에 관련된 값을 id로 받고 있음.
          input에 name이 필요한 이유 -> Checkout Component에서 form을 제출할 때, 백엔드에 데이터를 보낼텐데 
          이때 유효성 검사, 데이터 등을 전달하기 위해 FormData를 사용하기 위해서 name 필요함. 
        */}
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        <p className="modal-actions">
          <Button type="button" onClick={handleClose} textOnly>
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}
