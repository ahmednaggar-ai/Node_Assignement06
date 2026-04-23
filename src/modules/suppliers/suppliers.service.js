import { connection } from "../../database/connection.js";

const existSupplier = async(phone) =>{
    const [result] = await connection.promise().query("select * from suppliers where phone = ?", [phone]);
    if(result.length > 0){
        return true;
    }else{
        return false;
    }
}


export {existSupplier};