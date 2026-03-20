import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import "./models/ProductModel.js";
import ProductModel from "./models/ProductModel.js"; 

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import mongoose from "mongoose";

mongoose.connect("mongodb+srv://proyecto:juliproyecto@cluster0.6ohc4gk.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB conectado"))
.catch(error => console.log(error));

const app = express();
const server = http.createServer(app);
const io = new Server(server);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Router de vistas
app.use("/", viewsRouter);

// WebSockets
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  const products = await ProductModel.find().lean();
  socket.emit("updateProducts", products);

  socket.on("addProduct", async (product) => {
    await ProductModel.create(product);
    const updatedProducts = await ProductModel.find().lean();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await ProductModel.findByIdAndDelete(id);
    const updatedProducts = await ProductModel.find().lean();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

server.listen(8080, () => {
  console.log("🚀 Servidor escuchando en puerto 8080");
});