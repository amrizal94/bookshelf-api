import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
// eslint-disable-next-line import/extensions
import router from './router.js';

const app = express();

/** app middleware */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
config();

/** application port */
const port = process.env.PORT || 9000;

/** routes */
app.use(router);

app.get('/', (req, res) => {
  try {
    res.json('Get Request');
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`server connected to http://localhost:${port}`);
});
