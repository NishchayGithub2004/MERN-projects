import express from "express";

import { handleImageUpload, addProduct, editProduct, fetchAllProducts, deleteProduct } from "../../controllers/admin/products-controller";

import { upload } from "../../helpers/cloudinary";  

const adminProductsRouter = express.Router();

adminProductsRouter.post("/upload-image", upload.single("my_file"), handleImageUpload);
adminProductsRouter.post("/add", addProduct);
adminProductsRouter.put("/edit/:id", editProduct);
adminProductsRouter.delete("/delete/:id", deleteProduct);
adminProductsRouter.get("/get", fetchAllProducts);

module.exports = adminProductsRouter;