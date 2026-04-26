import { connection } from "../../database/connection.js";
import { isExistProduct, isExistSupplier } from "./products.service.js";

const PRODUCT_WITH_SUPPLIER_QUERY = "select p.id, p.name as productName, p.price, p.quantity, s.name as supplierName, s.phone from products p join suppliers s on p.supplierId = s.id";

const getProducts = (req, res)=>{
    connection.query(PRODUCT_WITH_SUPPLIER_QUERY, (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error fetching products",
                error: err
            })
        }
        else{
            res.status(200).send({
                message: "Products fetched successfully",
                data: result
            });
        }
    })
}

const getProductsById = (req, res)=>{
    let {id} = req.params;
    connection.query(`${PRODUCT_WITH_SUPPLIER_QUERY} where p.id = ?`, [id], (err, result)=>{
        if(err){
            return res.status(500).send({
                message: "Error fetching product",
                error: err
            });
        }
        else{
            if(result.length === 0){
                return res.status(404).send({
                    message: "Product not found",
                });
            }
            else{
                return res.status(200).send({
                    message: "Product fetched successfully",
                    data: result
                });
            }
        }
    })
}

const createProduct = async (req, res)=>{
    let {name, price, quantity, supplierId} = req.body;
    let exists = await isExistProduct(name);
    if(exists){
        return res.status(400).send({
            message: "There is a product with the same name",
        });
    }
    const supplierExists = await isExistSupplier(supplierId);
    if(!supplierExists){
        return res.status(400).send({
            message: "This supplier does not exist",
        });
    }
    connection.query("insert into products (name, price, quantity, supplierId) values (?, ?, ?, ?)", [name, price, quantity, supplierId], (err, result)=>{
        if(err){
            return res.status(500).send({
                message: "Error creating product",
                error: err
            });
        }
        connection.query(`${PRODUCT_WITH_SUPPLIER_QUERY} where p.id = ?`, [result.insertId], (err, productResult)=>{
            if(err){
                return res.status(500).send({
                    message: "Error fetching product",
                    error: err
                });
            }
            else{
                return res.status(200).send({
                    message: "Product created successfully",
                    data: productResult
                });
            }
        })
    })
}

const updateProduct = async (req, res)=>{
    let {id} = req.params;
    let {name, price, quantity, supplierId} = req.body;
    let existsSupplier = await isExistSupplier(supplierId);
    if(!existsSupplier){
        return res.status(400).send({
            message: "This supplier does not exist",
        });
    }
    let existsProduct = await isExistProduct(name);
    if(existsProduct){
        return res.status(400).send({
            message: "There is a product with the same name",
        });
    }
    connection.query("update products set name = ?, price = ?, quantity = ?, supplierId = ? where id = ?", [name, price, quantity, supplierId, id], (err, result)=>{
        if(err){
            return res.status(500).send({
                message: "Error updating product",
                error: err
            });
        }
        else{
            if(result.affectedRows === 0){
                return res.status(404).send({
                    message: "Product not found",
                });
            }
            else{
                connection.query(`${PRODUCT_WITH_SUPPLIER_QUERY} where p.id = ?`, [id], (err, productResult)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Error fetching product",
                            error: err
                        });
                    }
                    else{
                        return res.status(200).send({
                            message: "Product updated successfully",
                            data: productResult
                        });
                    }
                })
            }
        }
    })
}

const deleteProduct = (req, res)=>{
    let { id } = req.params;
    connection.query("delete from products where id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).send({
                message: "Error deleting product",
                error: err
            });
        }
        else{
            if(result.affectedRows === 0){
                return res.status(404).send({
                    message: "Product not found",
                    data: Number(id)
                });
            }
        }
    })
};

export {getProducts, getProductsById, createProduct, updateProduct, deleteProduct};