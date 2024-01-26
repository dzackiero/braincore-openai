import express from 'express';
import 'dotenv/config';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
const openai = new OpenAI();

// Middleware
app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
  const messages = req.body.messages;
  if (messages) {
    try {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
        stream: true,
      });

      for await (const chunk of completion) {
        if (
          chunk.choices &&
          chunk.choices[0] &&
          chunk.choices[0].delta &&
          chunk.choices[0].delta.content
        ) {
          res.write(chunk.choices[0].delta.content);
        } else {
          console.error('Invalid chunk structure:', chunk);
        }
      }

      res.end();
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.get('/', async (req, res) => {
  res.send('mantap');
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
