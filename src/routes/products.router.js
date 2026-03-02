import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, price, category } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = await manager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await manager.updateProduct(req.params.pid, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await manager.deleteProduct(req.params.pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
