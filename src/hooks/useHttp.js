// useHttp.js

import { useCallback, useEffect, useState } from 'react';

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  // backend에 오류가 발생할 경우.
  if (!response.ok) {
    throw new Error(
      // backend/app.js에서 /orders에서 오류처리를 하고 있다.
      // 즉, resData.message에서 에러를 못잡았는데, !response.ok가 true일 경우, 좀 더 포괄적인 에러 메시지 출력.
      resData.message || 'Something went wrong, failed to send request.'
    );
  }

  // 응답이 정상적일 경우, 데이터 반환
  return resData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false); // false: 로딩 중이 아님.
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async function sendRequest() {
      setIsLoading(true);

      try {
        const resData = await sendHttpRequest(url, config);
        setData(resData);
      } catch (error) {
        setError(error.message || 'Something went wrong');
      }

      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    // config 객체를 정상적으로 받았고, method를 GET으로 요청하면 sendRequest() 실행.
    if ((config && (config.method === 'GET' || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    // 아래 sendRequest 자체를 노출시켜 다른 곳에서 사용할 수 있게 함.
    sendRequest,
  };
}
