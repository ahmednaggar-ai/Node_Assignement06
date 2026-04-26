import { connection } from "../../database/connection.js";
import { isExistProductById } from "../products/products.service.js";

const SALES_WITH_PRODUCT_QUERY = "select s.id, s.quantity, s.salesDate As date, p.name as productName, p.price as productPrice from sales s join products p on s.productId = p.id";

const getSales = (req, res)=>{
    connection.query(SALES_WITH_PRODUCT_QUERY, (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error fetching sales",
                error: err
            })
        }
        else{
            res.status(200).send({
                message: "Sales fetched successfully",
                data: result
            })
        }
    })
}

const getSaleById = (req, res)=>{
    let {id} = req.params;
    connection.query(`${SALES_WITH_PRODUCT_QUERY} where s.id = ?`, [id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error fetching sale",
                error: err
            })
        }
        else{
            if(result.length === 0){
                res.status(404).send({
                    message: "Sale not found",
                })
            }
            else{
                res.status(200).send({
                    message: "Sale fetched successfully",
                    data: result[0]
                })
            }
        }
    })
}

const createSale = async (req, res)=>{
    let {productId, quantity} = req.body;
    let existsProduct = await isExistProductById(productId);
    if(!existsProduct){
        return res.status(400).send({
            message: "Product not found",
        });
    }
    connection.query("insert into sales (productId, quantity, salesDate) values (?, ?, ?)", [productId, quantity, new Date()], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error creating sale",
                error: err
            })
        }
        else{
        connection.query(`${SALES_WITH_PRODUCT_QUERY} where s.id = ?`, [result.insertId], (err, saleResult)=>{
            if(err){
                res.status(500).send({
                    message: "Error fetching sale",
                    error: err
                })
            }
            else{
                res.status(200).send({
                    message: "Sale created successfully",
                    data: saleResult
                })
            }
        })
        }
    })
}

const updateSale = async (req, res)=>{
    let {id} = req.params;
    let {productId, quantity} = req.body;
    let existsProduct = await isExistProductById(productId);
    if(!existsProduct){
        return res.status(400).send({
            message: "Product not found",
        });
    }
    connection.query("UPDATE sales SET productId = ?, quantity = ? WHERE id = ?", [productId, quantity, id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error updating sale",
                error: err
            })
        }else{
            connection.query(`${SALES_WITH_PRODUCT_QUERY} where s.id = ?`, [id], (err, saleResult)=>{
                if(err){
                    res.status(500).send({
                        message: "Error fetching sale",
                        error: err
                    })
                }else{
                    if(saleResult.length === 0){
                        res.status(404).send({
                            message: "Sale not found",
                        })
                    }else{
                        res.status(200).send({
                            message: "Sale updated successfully",
                            data: saleResult
                        })
                    }
                }
            })
        }
    })
}

const deleteSale = (req, res)=>{
    let {id} = req.params;
    connection.query("DELETE FROM sales WHERE id = ?", [id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error deleting sale",
                error: err
            })
        }else{
            if(result.affectedRows === 0){
                res.status(404).send({
                    message: "Sale not found",
                })
            }else{
                res.status(200).send({
                    message: "Sale deleted successfully",
                    data: Number(id)
                })
            }
        }
    })
}

export {getSales, getSaleById, createSale, updateSale, deleteSale};