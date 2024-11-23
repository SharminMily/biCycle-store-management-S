import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  const a = 1;
  console.log(a);
  res.send('Hello World!');
});

export default app;
