import express, { response } from 'express'
import { requestData } from './controllers/controller.ts';

const app = express();
app.use(express.json());

app.get('/', requestData);

app.listen( 3000, () => console.log("Server running"));
