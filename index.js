import express from 'express';
import { config } from 'dotenv'
import { headerVerify } from './middleware/headerMiddleware.js';
import xss from 'xss-clean'
import bodyParser from "body-parser";
import router from "./routes/index.js";
import morgan from 'morgan';

config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xss());
app.use(headerVerify)
app.use(morgan('dev'));
app.use(router)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
