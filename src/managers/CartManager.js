import fs from "fs";
import crypto from "crypto";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager("./src/data/products.json");
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: crypto.randomUUID(),
      products: [],
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cid);

    if (!cart) return null;

    const productExists = await this.productManager.getProductById(pid);
    if (!productExists) throw new Error("El producto no existe");

    const productInCart = cart.products.find(p => p.product === pid);

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    return cart;
  }
}
