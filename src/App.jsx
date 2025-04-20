import { useRef, useState, useEffect } from 'react';
import seedrandom from 'seedrandom';
import './App.css';

const Gallery = ({ pages, onLoad, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 9;
  const totalPages = Math.ceil(pages.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, pages.length);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const renderThumbnail = (page) => {
    const canvas = document.createElement('canvas');
    canvas.width = 816;
    canvas.height = 1056;
    const ctx = canvas.getContext('2d');

    // Apply the page settings to generate the thumbnail
    const { settings } = page;
    ctx.font = `${settings.fontSize}px ${settings.font}`;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    if (settings.type === 'letters') {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (settings.isRandom) {
        const rng = seedrandom(settings.randomSeed);
        const positions = [];
        const isOverlapping = (x, y, size) => {
          return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
        };

        letters.split('').forEach((letter) => {
          let x, y;
          let attempts = 0;
          let currentFontSize = settings.fontSize;
          do {
            x = rng() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
            y = rng() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
            attempts++;
            if (attempts > 100) {
              currentFontSize -= 5;
              ctx.font = `${currentFontSize}px ${settings.font}`;
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
        const spacing = (canvas.width - 2 * pageMargin) / settings.lettersPerRow;
        const rows = Math.ceil(letters.length / settings.lettersPerRow);
        const totalHeight = rows * (settings.fontSize * 1.2 + padding);
        const startY = (canvas.height - totalHeight) / 2 + settings.fontSize;

        letters.split('').forEach((letter, i) => {
          const row = Math.floor(i / settings.lettersPerRow);
          const col = i % settings.lettersPerRow;
          const x = pageMargin + col * spacing + spacing / 2;
          const y = startY + row * (settings.fontSize * 1.2 + padding);

          const metrics = ctx.measureText(letter);
          const letterX = x - metrics.width / 2;

          ctx.strokeText(letter, letterX, y);
        });
      }
    } else {
      const numbers = Array.from(
        { length: Math.ceil((settings.endNumber - settings.startNumber + 1) / settings.stepNumber) },
        (_, i) => settings.startNumber + i * settings.stepNumber
      );

      if (settings.isRandom) {
        const rng = seedrandom(settings.randomSeed);
        const positions = [];
        const isOverlapping = (x, y, size) => {
          return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
        };

        numbers.forEach((number) => {
          let x, y;
          let attempts = 0;
          let currentFontSize = settings.fontSize;
          do {
            x = rng() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
            y = rng() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
            attempts++;
            if (attempts > 100) {
              currentFontSize -= 5;
              ctx.font = `${currentFontSize}px ${settings.font}`;
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
        const spacing = (canvas.width - 2 * pageMargin) / settings.numbersPerRow;
        const rows = Math.ceil(numbers.length / settings.numbersPerRow);
        const totalHeight = rows * (settings.fontSize * 1.2 + padding);
        const startY = (canvas.height - totalHeight) / 2 + settings.fontSize;

        numbers.forEach((number, i) => {
          const row = Math.floor(i / settings.numbersPerRow);
          const col = i % settings.numbersPerRow;
          const x = pageMargin + col * spacing + spacing / 2;
          const y = startY + row * (settings.fontSize * 1.2 + padding);

          const metrics = ctx.measureText(number.toString());
          const numberX = x - metrics.width / 2;

          ctx.strokeText(number.toString(), numberX, y);
        });
      }
    }

    return (
      <div key={page.id} className="gallery-item">
        <div className="gallery-item-content">
          <img src={canvas.toDataURL()} alt={page.name} />
          <div className="gallery-item-title">{page.name}</div>
          <div className="gallery-item-actions">
            <button onClick={() => onLoad(page)}>Load</button>
            <button onClick={() => onDelete(page.id)} className="delete">×</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="gallery-container">
      <div className="gallery-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="gallery-nav-button"
        >
          ←
        </button>
        <div className="gallery-status">
          Displaying {startIndex + 1}-{endIndex} of {pages.length} pages
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="gallery-nav-button"
        >
          →
        </button>
      </div>
      <div className="gallery-grid">
        {pages.slice(startIndex, endIndex).map(renderThumbnail)}
      </div>
    </div>
  );
};

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
  const [randomSeed, setRandomSeed] = useState(() => Math.random().toString());
  const [savedPages, setSavedPages] = useState(() => {
    const saved = localStorage.getItem('coloringPages');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPageName, setCurrentPageName] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  // Load saved pages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('coloringPages');
    if (saved) {
      setSavedPages(JSON.parse(saved));
    }
  }, []);

  // Save pages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('coloringPages', JSON.stringify(savedPages));
  }, [savedPages]);

  useEffect(() => {
    if (autoGenerate) handleGenerate();
  }, [autoGenerate, font, fontSize, type, isRandom, randomSeed, startNumber, endNumber, stepNumber, lettersPerRow, numbersPerRow]);

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
    if (event.target.checked) {
      setRandomSeed(Math.random().toString());
    }
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

  const savePage = () => {
    if (!currentPageName.trim()) return;

    const pageSettings = {
      id: Date.now(),
      name: currentPageName,
      settings: {
        font,
        fontSize,
        type,
        isRandom,
        startNumber,
        endNumber,
        stepNumber,
        lettersPerRow,
        numbersPerRow,
        randomSeed
      }
    };

    setSavedPages(prev => [...prev, pageSettings]);
    setCurrentPageName('');
  };

  const loadPage = (page) => {
    const { settings } = page;
    setFont(settings.font);
    setFontSize(settings.fontSize);
    setType(settings.type);
    setIsRandom(settings.isRandom);
    setStartNumber(settings.startNumber);
    setEndNumber(settings.endNumber);
    setStepNumber(settings.stepNumber);
    setLettersPerRow(settings.lettersPerRow);
    setNumbersPerRow(settings.numbersPerRow);
    setRandomSeed(settings.randomSeed);
  };

  const deletePage = (id) => {
    setSavedPages(prev => prev.filter(page => page.id !== id));
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
      const rng = seedrandom(randomSeed);
      const positions = [];
      const isOverlapping = (x, y, size) => {
        return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
      };

      letters.split('').forEach((letter) => {
        let x, y;
        let attempts = 0;
        do {
          x = rng() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
          y = rng() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
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
      const rng = seedrandom(randomSeed);
      const positions = [];
      const isOverlapping = (x, y, size) => {
        return positions.some(([px, py]) => Math.hypot(px - x, py - y) < size * 1.2);
      };

      numbers.forEach((number) => {
        let x, y;
        let attempts = 0;
        do {
          x = rng() * (canvas.width - currentFontSize * 1.5) + currentFontSize * 0.75;
          y = rng() * (canvas.height - currentFontSize * 1.5) + currentFontSize * 0.75;
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

  const handleRegenerateClick = () => {
    if (isRandom) {
      setRandomSeed(Math.random().toString());
    }
  };

  const handleGenerate = () => {
    if (type === 'letters') {
      generateLetters(isRandom);
    } else {
      generateNumbers(endNumber, stepNumber, isRandom);
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
          <button onClick={handleRegenerateClick}>Regenerate</button>
          <button onClick={window.print}>Print Coloring Page</button>
          <button onClick={() => setShowGallery(!showGallery)}>
            {showGallery ? 'Show Canvas' : 'Show Gallery'}
          </button>
        </div>

        <div className="form-section">
          <h3>Saved Pages</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="Page name"
              value={currentPageName}
              onChange={(e) => setCurrentPageName(e.target.value)}
            />
            <button onClick={savePage} disabled={!currentPageName.trim()}>
              Save
            </button>
          </div>
          <div className="saved-pages-list">
            {savedPages.map((page) => (
              <div key={page.id} className="saved-page-item">
                <span>{page.name}</span>
                <div className="saved-page-actions">
                  <button onClick={() => loadPage(page)}>Load</button>
                  <button onClick={() => deletePage(page.id)} className="delete">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-content">
        <canvas
          ref={canvasRef}
          width={816}
          height={1056}
        />
        {showGallery && (
          <Gallery
            pages={savedPages}
            onLoad={(page) => {
              loadPage(page);
              setShowGallery(false);
            }}
            onDelete={deletePage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
