import express from 'express';
import { config } from 'dotenv'
import xss from 'xss-clean'
import bodyParser from "body-parser";
import router from "./routes/index.js";
import morgan from 'morgan';
import { initializeKeyPair } from './controller/JWEController.js'

config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
await initializeKeyPair();
app.use(xss());
app.use(morgan('dev'));
app.use(router)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
