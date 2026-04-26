import { connection } from "../../database/connection.js";

const isExistProduct = async(name) =>{
    const [result] = await connection.promise().query("select * from products where name = ?", [name]);
    if(result.length > 0){
        return true;
    }else{
        return false;
    }
}

const isExistProductById = async(id) =>{
    const [result] = await connection.promise().query("select * from products where id = ?", [id]);
    if(result.length > 0){
        return true;
    }else{
        return false;
    }
}

const isExistSupplier = async(id) =>{
    const [result] = await connection.promise().query("select * from suppliers where id = ?", [id]);
    if(result.length > 0){
        return true;
    }else{
        return false;
    }
}

export {isExistProduct, isExistSupplier, isExistProductById};