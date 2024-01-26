import { useState } from 'react';

function getChatResponse(messages) {
  return fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: messages }),
  });
}

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
  ]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setText('');

    // Adding user Input + template for assistant to State
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        content: data.query,
      },
      {
        role: 'assistant',
        content: '',
      },
    ]);

    // Making Request to API
    const response = await getChatResponse([
      ...messages,
      {
        role: 'user',
        content: data.query,
      },
    ]);

    // Check if response have body
    if (!response.body) return;

    // Creating Reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isFinished = false;

    while (!isFinished) {
      const { done, value } = await reader.read();

      isFinished = done;
      const decodeValue = decoder.decode(value);
      if (!decodeValue) break;

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        {
          role: 'assistant',
          content: `${
            prevMessages[prevMessages.length - 1].content
          }${decodeValue}`,
        },
      ]);
    }
  };

  const resizeInput = (el) => {
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  };

  return (
    <>
      <div className="h-dvh p-8">
        <div className="flex flex-col h-full">
          <div className="flex flex-col flex-end justify-end py-8 flex-grow">
            <ul>
              {messages.map((data, index) =>
                data.role === 'system' ? (
                  ''
                ) : (
                  <li key={index}>
                    <b>{data.role}</b> : {data.content}
                  </li>
                )
              )}
            </ul>
          </div>
          <form className="flex gap-4" onSubmit={handleFormSubmit}>
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
