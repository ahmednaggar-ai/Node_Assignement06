import { Router } from "express";
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from "./suppliers.controller.js";

const router = Router();

router.get('/suppliers', getSuppliers);

router.get('/suppliers/:id', getSupplierById);

router.post('/suppliers', createSupplier);

router.put('/suppliers/:id', updateSupplier);

router.delete('/suppliers/:id', deleteSupplier);

export default router;