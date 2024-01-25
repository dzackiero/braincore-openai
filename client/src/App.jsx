import { useEffect, useState } from 'react';

function fetchResponse(messages) {
  // Replace the URL and API key with your actual values
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchResponse(messages);
        const apiResponse = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: apiResponse.choices[0].message.content,
          },
        ]);
      } catch (error) {
        console.error('Error fetching response:', error);
        // Handle error
      }
    };

    if (messages.length > 1 && messages[messages.length - 1].role === 'user') {
      fetchData();
    }
  }, [messages]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        content: data.query,
      },
    ]);

    setText('');
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
