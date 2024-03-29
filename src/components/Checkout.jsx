import { useContext } from 'react';
import Modal from './UI/Modal';
import CartContext from '../store/CartContext';
import { currencyFormatter } from '../util/formatting';
import Input from './UI/Input';
import UserProgressContext from '../store/UserProgressContext';
import Button from './UI/Button';
import useHttp from '../hooks/useHttp';
import Error from './Error';

// 무한루프를 방지하기 위해, config 객체는 컴포넌트 함수 외부에 생성
const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  // body의 경우, cartCtx, userProgressCtx는 handleSubmit 양식이 제출된 이후에 사용이 가능함.
  // useHttp에서 sendRequest를 직접 받고, handleSubmit 함수 내에서 sendRequest를 호출하면서 body를 별도로 추가하여 보냄.
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);

  // 해당 request의 경우 POST 방식인데, useHttp.js에서 sendRequest의 경우 GET 방식에서만 요청함.
  // 즉, POST 방식의 요청을 수행하기 위해, sendRequest를 직접 반환받아 사용함.
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp('http://localhost:3000/orders', requestConfig);

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);

  const userProgressCtx = useContext(UserProgressContext);

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData(); // Checkout이 끝날 때, 이전 data 상태를 초기화해야 다음 Checkout에서 오류가 발생하지 않음.
  }

  function handleSubmit(event) {
    // backend 서버로 데이터를 보내기 위해, 기존 form 기능(새로고침 or 다른 URL 이동)을 막기 위함.
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries()); // 결과 값으로 객체 받음. { email: userInput@naver.com }

    // useHttp 커스텀 훅을 사용하여 아래 코드를 대체함.
    // fetch('http://localhost:3000/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData,
    //     },
    //   }),
    // });

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      {' '}
      <Button type="button" onClick={handleClose} textOnly>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  // request를 통해 데이터를 정상적으로 받았을 경우...
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === 'checkout'}
        onClose={handleClose}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minuates.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
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

        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
