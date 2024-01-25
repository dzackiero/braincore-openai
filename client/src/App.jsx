import { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
  ]);

  function resizeInput(el) {
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }

  function fetchResponse(messages) {
    return fetch(import.meta.env.VITE_REACT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_REACT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });
  }

  return (
    <>
      <div className="h-dvh p-8">
        <div className="flex flex-col h-full">
          <div className="flex flex-col flex-end justify-end py-8 flex-grow">
            <ul>
              {messages.map((data, index) =>
                data.role == 'system' ? (
                  ''
                ) : (
                  <li key={index}>
                    <b>{data.role}</b> : {data.content}
                  </li>
                )
              )}
            </ul>
          </div>
          <form
            className="flex gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              setText('');

              setMessages((msgs) => {
                return [
                  ...msgs,
                  {
                    role: 'user',
                    content: data.query,
                  },
                ];
              });

              const response = await fetchResponse([
                ...messages,
                {
                  role: 'user',
                  content: data.query,
                },
              ]);
              const json = await response.json();

              setMessages((messages) => {
                return [
                  ...messages,
                  {
                    role: 'assistant',
                    content: json.choices[0].message.content,
                  },
                ];
              });
            }}
          >
            <textarea
              name="query"
              className="textarea textarea-bordered w-full max-h-40 h-0 text-lg resize-none grow-0"
              placeholder="Insert your message"
              required
              onChange={(e) => {
                resizeInput(e.target);
                setText(e.target.value);
              }}
              value={text}
            ></textarea>
            <button className="btn btn-success" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
