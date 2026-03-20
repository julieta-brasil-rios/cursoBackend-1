import { Router } from "express";
import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  const newCart = await CartModel.create({ products: [] });
  res.status(201).json(newCart);
});

// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product");
 
    if (!cart) {
  return res.status(404).json({ error: "Carrito no encontrado" });
}
  res.json(cart);
});

// Agregar producto 
router.post("/:cid/products/:pid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
  const existingProduct = cart.products.find(
    p => p.product.toString() === req.params.pid
  );
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({
      product: req.params.pid,
      quantity: 1
    });
  }

  await cart.save();
  

  res.json(cart);
});

//Eliminar producto 
router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  cart.products = cart.products.filter(
    p => p.product.toString() !== req.params.pid
  );

  await cart.save();
  
  res.json(cart);
});

// Actualizar todo el carrito
router.put("/:cid", async (req, res) => {
  const { products } = req.body;

  const updatedCart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(updatedCart);
});
// Actualizar cantidad de a uno
router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;

  const cart = await CartModel.findById(req.params.cid);
  if (!product) {
  return res.status(404).json({ error: "Producto no encontrado en el carrito" });
}
  if (!cart) {
  return res.status(404).json({ error: "Carrito no encontrado" });
}

  const product = cart.products.find(
    p => p.product.toString() === req.params.pid
  );

  if (product) {
    product.quantity = quantity;
  }

  await cart.save();
  if (!cart) {
  return res.status(404).json({ error: "Carrito no encontrado" });
}
  res.json(cart);
});

//Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const cart = await CartModel.findByIdAndUpdate(
    req.params.cid,
    { products: [] },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json({ status: "success" });
});

export default router;