import { useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  const drawOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Example: Draw a rectangle, circle, and text
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Draw a rectangle
    ctx.strokeRect(50, 50, 200, 100);

    // Draw a circle
    ctx.beginPath();
    ctx.arc(150, 200, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw text
    ctx.font = '30px Arial';
    ctx.fillText('A', 100, 300);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Coloring Page Generator</h1>
      <p>Click the button to generate a coloring page!</p>
      <button onClick={drawOnCanvas}>Generate Coloring Page</button>
      <canvas
        ref={canvasRef}
        width={816} // 8.5 inches in pixels at 96 DPI
        height={1056} // 11 inches in pixels at 96 DPI
        style={{ border: '1px solid black', marginBottom: '20px' }}
      ></canvas>
      <br />
    </div>
  );
}

export default App;
