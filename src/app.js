import __dirname from "./utils.js";
import path from "path";
import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import mongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import socketIo from "./socketIo.js";
import { loggerMiddleware } from "./utils.js";
import productRouter from "./router/products.router.js";
import cartRouter from "./router/cart.router.js";
import viewsRouter from "./router/vistasRouter.js";
import sessionsRouter from "./router/sessions.router.js";
import userRouter from "./router/user.router.js";
import inicializarPassport from "./middleware/passport.middleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import handlebars from "handlebars"

const app = express();
const PORT = 8080;

const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.lskftra.mongodb.net/?retryWrites=true&w=majority`;

// Swagger Configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API E-commerce",
      version: "1.0.0",
      description: "API e-commerce de Evelina Niemann",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Session Configuration
const sessionStore = mongoStore.create({
  mongoUrl,
  mongoOptions: {
    dbName: process.env.MONGO_DATABASE_SESSIONS,
  },
});

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY, // Use a secure secret
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

inicializarPassport();
app.use(passport.initialize());
app.use(passport.session());



// Set up the view engine using the engine function
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// Add handlebars helpers
handlebars.registerHelper('get', function(obj, key) {
  return obj[key];
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(loggerMiddleware);

// Routes
app.use("/api/products", productRouter(socketIo));
app.use("/api/cart", cartRouter);
app.use("/api/user", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use(errorHandler);

// Error Handler
app.use(errorHandler);

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Current environment: ${process.env.MODE}`);
  console.log(`Server running on PORT: ${PORT}`);
});

// Socket.io Initialization
const io = socketIo(server);

// Log Registered Routes
app._router.stack.forEach((route) => {
  if (route.route && route.route.path) {
    console.log(`Registered route: ${route.route.path}`);
  }
});

// Logger Test Route
app.get("/loggerTest", (req, res) => {
  req.logger.info("Este es un mensaje de info");
  req.logger.warn("Este es un mensaje de advertencia");
  req.logger.error("Este es un mensaje de error");
  res.send("Prueba de logs completa en las vistas");
});

// Database Connection
try {
  await mongoose.connect(mongoUrl, { dbName: process.env.MONGO_DATABASE_ECOMMERCE });
} catch (error) {
  console.error("Error connecting to the database:", error);
}
