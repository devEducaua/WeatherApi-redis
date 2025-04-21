import express from 'express'
import { requestData } from './controllers/controller.ts';
import { rateLimit } from "express-rate-limit"

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
})

app.use(express.json());

app.use(limiter);

app.get('/', requestData);

app.listen( 3000, () => console.log("Server running"));
