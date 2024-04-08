import createDatabasePool from "./libs/config/db.config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import signin_up from "./routers/userRoutes";
import companyApis from "./routers/companyRoute";
import customerRoutes from "./routers/customerRoute";
import productRoute from "./routers/productRoute";
import docsRoute from "./routers/docsRoute";
import swaggerDocs from "./swagger";
import path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({type: 'application/json'}));
app.disable('etag');

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(morgan("dev"));
app.use(cors(corsOption));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.json("Hi folks !");
});
app.use(
  "/api",
  signin_up,
  companyApis,
  customerRoutes,
  productRoute,
  docsRoute
);

createDatabasePool()
  .then((pool) => {
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    swaggerDocs(app, port);
  })
  .catch((err) => {
    console.error("Failed to establish database connection:", err.message);
    process.exit(1);
  });
