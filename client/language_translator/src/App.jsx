import  { useState} from 'react';
import List from './List';

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const text = event.target.value.trim();
      if (text !== '') {
        const socket = new WebSocket('ws://localhost:8050/websoc');
        socket.onopen = () => {
          if (socket.readyState === 1) {
            socket.send(text);
            setInputValue('');
            setData([])
          }
        };
        socket.onmessage = (event) => {
          setData((prevData) => [...prevData, event.data]);
        };
      }
    }
  };

  return (
    <div id="main">
      <input
        type="text"
        id="text-input"
        placeholder="Enter text to translate"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <List data={data} />
    </div>
  );
}

export default App;