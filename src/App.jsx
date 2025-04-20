import { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(80);
  const [type, setType] = useState('letters');
  const [isRandom, setIsRandom] = useState(false);
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(10);
  const [stepNumber, setStepNumber] = useState(1);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [lettersPerRow, setLettersPerRow] = useState(7);
  const [numbersPerRow, setNumbersPerRow] = useState(10);

  useEffect(() => {
    if (autoGenerate) handleGenerate();
  }, [autoGenerate, font, fontSize, type, isRandom, startNumber, endNumber, stepNumber, lettersPerRow, numbersPerRow]);

  const handleGenerate = () => {
    if (type === 'letters') {
      generateLetters(isRandom);
    } else {
      generateNumbers(endNumber, stepNumber, isRandom);
    }
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(Number(event.target.value));
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleRandomChange = (event) => {
    setIsRandom(event.target.checked);
  };

  const handleStartNumberChange = (event) => {
    setStartNumber(Number(event.target.value));
  };

  const handleEndNumberChange = (event) => {
    setEndNumber(Number(event.target.value));
  };

  const handleStepNumberChange = (event) => {
    setStepNumber(Number(event.target.value));
  };

  const generateLetters = (random = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentFontSize = fontSize;
    ctx.font = `${currentFontSize}px ${font}`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (random) {
      const positions = [];
      const isOverlapping = (x, y, size) => {
        return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
      };

      letters.split('').forEach((letter) => {
        let x, y;
        let attempts = 0;
        do {
          x = Math.random() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
          y = Math.random() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
          attempts++;
          if (attempts > 100) {
            currentFontSize -= 5;
            ctx.font = `${currentFontSize}px ${font}`;
            attempts = 0;
          }
        } while (isOverlapping(x, y, currentFontSize));

        positions.push([x, y]);
        const metrics = ctx.measureText(letter);
        ctx.strokeText(letter, x - metrics.width / 2, y);
      });
    } else {
      const padding = 10;
      const pageMargin = 30;
      const spacing = (canvas.width - 2 * pageMargin) / lettersPerRow;
      const rows = Math.ceil(letters.length / lettersPerRow);
      const totalHeight = rows * (currentFontSize * 1.2 + padding);
      const startY = (canvas.height - totalHeight) / 2 + currentFontSize;

      letters.split('').forEach((letter, i) => {
        const row = Math.floor(i / lettersPerRow);
        const col = i % lettersPerRow;
        const x = pageMargin + col * spacing + spacing / 2;
        const y = startY + row * (currentFontSize * 1.2 + padding);

        const metrics = ctx.measureText(letter);
        const letterX = x - metrics.width / 2;
        
        ctx.strokeText(letter, letterX, y);
      });
    }
  };

  const generateNumbers = (maxNumber = 10, step = 1, random = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentFontSize = fontSize;
    ctx.font = `${currentFontSize}px ${font}`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    const numbers = Array.from(
      { length: Math.ceil((maxNumber - startNumber + 1) / step) },
      (_, i) => startNumber + i * step
    );

    if (random) {
      const positions = [];
      const isOverlapping = (x, y, size) => {
        return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
      };

      numbers.forEach((number) => {
        let x, y;
        let attempts = 0;
        do {
          x = Math.random() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
          y = Math.random() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
          attempts++;
          if (attempts > 100) {
            currentFontSize -= 5;
            ctx.font = `${currentFontSize}px ${font}`;
            attempts = 0;
          }
        } while (isOverlapping(x, y, currentFontSize));

        positions.push([x, y]);
        const metrics = ctx.measureText(number.toString());
        ctx.strokeText(number.toString(), x - metrics.width / 2, y);
      });
    } else {
      const padding = 10;
      const pageMargin = 30;
      const spacing = (canvas.width - 2 * pageMargin) / numbersPerRow;
      const rows = Math.ceil(numbers.length / numbersPerRow);
      const totalHeight = rows * (currentFontSize * 1.2 + padding);
      const startY = (canvas.height - totalHeight) / 2 + currentFontSize;

      numbers.forEach((number, i) => {
        const row = Math.floor(i / numbersPerRow);
        const col = i % numbersPerRow;
        const x = pageMargin + col * spacing + spacing / 2;
        const y = startY + row * (currentFontSize * 1.2 + padding);

        const metrics = ctx.measureText(number.toString());
        const numberX = x - metrics.width / 2;
        
        ctx.strokeText(number.toString(), numberX, y);
      });
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1>Coloring Page Generator</h1>
        <div className="form-section">
          <div className="form-row">
            <label htmlFor="auto-generate">Auto-Generate:</label>
            <input
              id="auto-generate"
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="font-select">Choose Font:</label>
            <select id="font-select" value={font} onChange={handleFontChange}>
              <option value="Arial">Arial</option>
              <option value="Comic Sans">Comic Sans</option>
              <option value="Courier New">Courier New</option>
              <option value="Proxima Nova">Proxima Nova</option>
              <option value="Roboto">Roboto</option>
            </select>
          </div>
          <div className="form-row column">
            <label htmlFor="font-size-slider">Font Size: {fontSize}px</label>
            <input
              id="font-size-slider"
              type="range"
              min="40"
              max="200"
              value={fontSize}
              onChange={handleFontSizeChange}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-row">
            <label htmlFor="type-select">Choose Type:</label>
            <select id="type-select" value={type} onChange={handleTypeChange}>
              <option value="letters">Letters</option>
              <option value="numbers">Numbers</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="random-toggle">Random Placement:</label>
            <input
              id="random-toggle"
              type="checkbox"
              checked={isRandom}
              onChange={handleRandomChange}
            />
          </div>
          {!isRandom && (
            <div className="form-row column">
              <label htmlFor="items-per-row">
                {type === 'letters' ? 'Letters' : 'Numbers'} Per Row: {type === 'letters' ? lettersPerRow : numbersPerRow}
              </label>
              <input
                id="items-per-row"
                type="range"
                min="3"
                max="12"
                value={type === 'letters' ? lettersPerRow : numbersPerRow}
                onChange={(e) => type === 'letters' 
                  ? setLettersPerRow(Number(e.target.value))
                  : setNumbersPerRow(Number(e.target.value))
                }
              />
            </div>
          )}
          {type === 'numbers' && (
            <>
              <div className="form-row">
                <label htmlFor="start-number">Start Number:</label>
                <input
                  id="start-number"
                  type="number"
                  value={startNumber}
                  onChange={handleStartNumberChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="end-number">End Number:</label>
                <input
                  id="end-number"
                  type="number"
                  value={endNumber}
                  onChange={handleEndNumberChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="step-number">Step:</label>
                <input
                  id="step-number"
                  type="number"
                  value={stepNumber}
                  onChange={handleStepNumberChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="buttons">
          <button onClick={handleGenerate}>Regenerate</button>
          <button onClick={window.print}>Print Coloring Page</button>
        </div>
      </div>

      <div className="main-content">
        <canvas
          ref={canvasRef}
          width={816}
          height={1056}
        ></canvas>
      </div>
    </div>
  );
}

export default App;
