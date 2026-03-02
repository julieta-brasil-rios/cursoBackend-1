import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const manager = new ProductManager("./src/data/products.json");

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

  const products = await manager.getProducts();
  socket.emit("updateProducts", products);

  socket.on("addProduct", async (product) => {
    await manager.addProduct(product);
    const updatedProducts = await manager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(id);
    const updatedProducts = await manager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});


server.listen(8080, () => {
  console.log("🚀 Servidor escuchando en puerto 8080");
});