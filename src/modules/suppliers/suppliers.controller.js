import { connection } from "../../database/connection.js";
import { existSupplier } from "./suppliers.service.js";

const getSuppliers = (req, res)=>{
    connection.query("select * from suppliers", (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error fetching suppliers",
                error: err
            })
        }else{
            res.status(200).send({
                message: "Suppliers fetched successfully",
                data: result
            });
        }
    });
}

const getSupplierById = (req, res)=>{
    let {id} = req.params;
    connection.query("select * from suppliers where id = ?", [id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error fetching supplier",
                error: err
            })
        }else{
            res.status(200).send({
                message: "Supplier fetched successfully",
                data: result
            });
        }
    });
}

const createSupplier = async (req, res)=>{
    let {name, phone} = req.body;
    let exists = await existSupplier(phone);
    if(exists){
        return res.status(400).send({
            message: "Supplier already exists",
        });
    }
    connection.query("insert into suppliers (name, phone) values (?, ?)", [name, phone], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error creating supplier",
                error: err
            })
        }else{
            connection.query("select * from suppliers where id = ?", [result.insertId], (err, supplierResult)=>{
                if(err){
                    res.status(500).send({
                        message: "Error fetching supplier",
                        error: err
                    })
                }else{
                    res.status(200).send({
                        message: "Supplier fetched successfully",
                        data: supplierResult
                    });
                }
            })
        }
    });
}

const updateSupplier = async (req, res)=>{
    let {id} = req.params;
    let {name, phone} = req.body;
    let exists = await existSupplier(phone);
    if(exists){
        return res.status(400).send({
            message: "This phone number is already in use",
        });
    }
    connection.query("update suppliers set name = ?, phone = ? where id = ?", [name, phone, id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error updating supplier",
                error: err
            })
        }else{
            connection.query("select * from suppliers where id = ?", [id], (err, supplierResult)=>{
                if(err){
                    res.status(500).send({
                        message: "Error fetching supplier",
                        error: err
                    })
                }else{
                    if(supplierResult.length === 0){
                        res.status(404).send({
                            message: "Supplier not found",
                        });
                    }else{
                        res.status(200).send({
                            message: "Supplier updated successfully",
                            data: supplierResult
                        });
                    }
                }
            })
        }
    });
}

const deleteSupplier = (req, res)=>{
    let {id} = req.params;
    connection.query("delete from suppliers where id = ?", [id], (err, result)=>{
        if(err){
            res.status(500).send({
                message: "Error deleting supplier",
                error: err
            })
        }else{
            if(result.affectedRows === 0){
                res.status(404).send({
                    message: "Supplier not found",
                });
            }else{
                res.status(200).send({
                    message: "Supplier deleted successfully",
                    data: Number(id)
                });
            }
        }
    });
}

export {getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier};