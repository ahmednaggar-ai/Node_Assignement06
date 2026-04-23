import { Router } from "express";
import { getProducts, getProductsById, createProduct, updateProduct, deleteProduct } from "./products.controller.js";

const router = Router();

router.get('/products', getProducts);

router.get('/products/:id', getProductsById);

router.post('/products', createProduct);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

export default router;