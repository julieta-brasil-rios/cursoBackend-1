import { Router } from "express";
import ProductModel from "../models/ProductModel.js";

const router = Router();


router.get("/", async (req, res) => {
  const products = await ProductModel.find().lean();

  res.render("home", { products });
});


router.get("/products", async (req, res) => {

  const page = parseInt(req.query.page) || 1;

  const result = await ProductModel.paginate({}, {
    page,
    limit: 10,
    lean: true
  });

  res.render("home", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  });

});



router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();

  res.render("productDetail", { product });
});


router.get("/realtimeproducts", async (req, res) => {
  const products = await ProductModel.find().lean();

  res.render("realTimeProducts", { products });
});
export default router;