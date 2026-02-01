import fs from "fs";
import crypto from "crypto";


export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates, id };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

async deleteProduct(id) {
  const products = await this.getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  products.splice(index, 1);

  await fs.promises.writeFile(
    this.path,
    JSON.stringify(products, null, 2)
  );

  return true;
}
}
