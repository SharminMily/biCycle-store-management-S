import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import router from './app/routes';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(
  cors({
    origin: [
     "http://localhost:5173", // Add another origin here
      "https://bicycle-store-fontend.vercel.app",
    ],
    credentials: true,
  })
);

//aplication router
app.use('/api', router);


const getAController = (req: Request, res: Response) => {
  res.send();
};

app.get('/', getAController);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


export default app;
