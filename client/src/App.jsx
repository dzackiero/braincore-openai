import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="h-dvh grid place-items-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-2xl">Hello World!</h1>
          {JSON.stringify(import.meta.env)}
          <button
            className="btn"
            onClick={() => setCount((count) => count + 1)}
          >
            Count : {count}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
