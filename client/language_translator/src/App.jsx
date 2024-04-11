import  { useState} from 'react';
import List from './List';

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);
  const [isSending, setIsSending] = useState('Enter in any language...');
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const text = event.target.value.trim();
      if (text !== '') {
        setIsReceiving(true);
        const socket = new WebSocket('ws://localhost:8050/websoc');
        socket.onopen = () => {
          if (socket.readyState === 1) {
            socket.send(text);
            setInputValue('');
            setIsSending('Sending...');
            setData([])
          }
        };
        socket.onmessage = (event) => {
          setData((prevData) => [...prevData, event.data]);
          setIsReceiving(false);
          setIsSending('Enter in any language...');
        };
      }
    }
  };

  return (
    <div id="main" className="w-screen h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <h1 className="text-center text-4xl font-bold">LANGUAGE TRANSLATOR</h1>
      <h2 className="font-semibold text-2xl">Enter a text to translate:</h2>
      <input
        type="text"
        id="text-input"
        placeholder={isSending}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border-black border-2 w-1/3 h-10 p-2 mt-2 text-lg"
        disabled={isReceiving}
      />
      <div className="max-h-[50vh] overflow-auto mt-4">
        <List data={data} className=""/>
      </div>
      
    </div>
  );
}

export default App;