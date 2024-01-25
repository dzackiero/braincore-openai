import { useState } from 'react';

function getChatResponse(messages) {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const apiKey = import.meta.env.VITE_REACT_API_KEY;

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true,
    }),
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

    const response = await getChatResponse([
      ...messages,
      {
        role: 'user',
        content: data.query,
      },
    ]);

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isFinished = false;

    while (!isFinished) {
      const { done, value } = await reader.read();

      isFinished = done;
      const decodeValue = decoder.decode(value);
      if (!decodeValue) break;

      const messages = decodeValue.split('\n\n');
      const chucks = messages
        .filter((msg) => msg && msg !== 'data: [DONE]')
        .map((message) => JSON.parse(message.replace(/^data:/g, '').trim()));

      for (const chunk of chucks) {
        const content = chunk.choices[0].delta.content;

        if (content) {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            {
              role: 'assistant',
              content: `${
                prevMessages[prevMessages.length - 1].content
              }${content}`,
            },
          ]);
        }
      }
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
