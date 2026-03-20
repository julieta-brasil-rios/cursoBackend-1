import { Router } from "express";
import ProductModel from "../models/ProductModel.js";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};

    // filtro por categoría 
    if (query) {
      filter.category = query;
      // o también podrías hacer:
      // filter.stock = { $gt: 0 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    
    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `http://localhost:8080/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `http://localhost:8080/api/products?page=${result.nextPage}`
        : null
    });

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});



router.get("/:pid",async(req,res)=>{

const product=await ProductModel.findById(req.params.pid);

if(!product){
return res.status(404).json({error:"producto no encontrado"});
}

res.json(product);

});

router.post("/",async(req,res)=>{

const newProduct=await ProductModel.create(req.body);

res.status(201).json(newProduct);

});

router.put("/:pid",async(req,res)=>{

const updated=await ProductModel.findByIdAndUpdate(
req.params.pid,
req.body,
{new:true}
);

res.json(updated);

});

router.delete("/:pid",async(req,res)=>{

await ProductModel.findByIdAndDelete(req.params.pid);

res.json({message:"producto eliminado"});

});

export default router;
