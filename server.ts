import createDatabasePool from './libs/config/db.config';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import signin_up from './routers/userRoutes'


dotenv.config();
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/json'}));

const corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(morgan("dev"))
app.use(cors(
 corsOption   
))
app.get("/", (req, res) => {
    res.json("Hi folks !")
})
app.use('/api' , signin_up)

createDatabasePool()
    .then(pool => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to establish database connection:', err.message);
        process.exit(1);
    });