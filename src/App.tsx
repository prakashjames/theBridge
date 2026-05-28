import { useState, useEffect } from 'react';
import {theBridge, getBridgeSettings} from './theBridge';

function App() {
  const [responseData, setResponseData] = useState<any>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const bridgeSettings:any = getBridgeSettings('userListBridge');
      const requestParams = {
        userId: 123,
        includeDetails: true,
      };
      const data = await theBridge(bridgeSettings, requestParams);
      console.log('Data received from theBridge:', data);
      setResponseData(data);
    };
    
    fetchData();
  }, []);















  return (
    <div className="app-container">
      <h1>The Bridge POC</h1>
      <p>responseData: {responseData ? JSON.stringify(responseData[0]) : 'No data'} </p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count is {count}
      </button>
    </div>
  );
}

export default App;
