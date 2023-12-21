import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import productsRoute from "./Routes/productsRoute.js";
import cartRoute from "./Routes/cartRoute.js";
import viewRouter from "./Routes/viewRouter.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import MessagesDao from "./daos/dbManager/messages.dao.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
.then(() => {
  console.log("Connected DB");
})
.catch((error) => {
  console.log(error);
});

const io = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);
app.use("/api", viewRouter);

const users = [];
const messages = [];

io.on("connection", (socket) => {
  console.log("New user connect");

  socket.on("message", async (data) => {
    try {
      const newMessage = await MessagesDao.addMessage(data.user, data.message);
      io.emit("messages", await MessagesDao.getAllMessages());
    } catch (error) {
      console.error(
        `Error processing the form.: ${error.message}`
      );
    }
  });

  socket.on("init", async (data) => {
    io.emit("messages", await MessagesDao.getAllMessages());
    socket.broadcast.emit("connected", data);
  });
});

