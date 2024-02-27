import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
export default function Modal({ children, open, onClose, className = '' }) {
  const dialogRef = useRef();

  useEffect(() => {
    const modal = dialogRef.current;

    if (open) {
      // open === true : dialog를 직접 구현하여 엶.
      modal.showModal();
    }
    // else보다 clean-up function을 사용하여 닫으면, 라이프사이클 관리, 코드 안정성 증가.
    // else {
    //   dialogRef.current.close();
    // }

    // clean-up function : open의 경우 UserProgressContext의 progress에 의해 값이 변경된다.
    // 그러나, progress가 true (open이 true)인 경우에 대해서는 showModal()로 지정해줬는데,
    // false인 경우에 대해서는 정해주지 않았다.
    // -> 따라서 open값이 변경되면 해당 컴포넌트 재실행되는데, 재실행 직전에 clean-up function으로 close() 수행.
    // 이때, dialogRef.current.close()가 아니라 별도의 modal로 상수로 둔 이유.
    // clean-up function의 경우 useEffect보다 이후에 실행된다(open이 변할때만 실행하기 때문).
    // -> 프로젝트 규모가 클 경우 clean-up 실행 전에 dialogRef.current의 참조가 변할 수 있기 때문에 별도의 상수에 저장해둬서 사용하는 게 좋다.
    // 해당 예제에서는 변하지 않고 계속 dialog를 가리킴.
    return () => modal.close();
  }, [open]);

  return createPortal(
    <dialog className={`modal ${className}`} ref={dialogRef} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}
