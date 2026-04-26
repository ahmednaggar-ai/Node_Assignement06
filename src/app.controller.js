import express from 'express';
import { connection } from './database/connection.js';
import suppliersRouter from './modules/suppliers/suppliers.route.js';
import productsRouter from './modules/products/products.route.js';
import salesRouter from './modules/sales/sales.route.js';

export const bootstrap = ()=>{

    const app = express();
    app.use(express.json());

    app.use('/api', suppliersRouter);
    app.use('/api', productsRouter);
    app.use('/api', salesRouter);
    app.get('/', (req, res)=>{
        connection.query('SELECT 1 + 1 as result', (err, result)=>{
            if(err){
                res.status(500).send('Error connecting to database');
            }else{
                res.send(result);
            }
        })
    });

    app.listen(3000, ()=>{
        console.log('Server is running on http://localhost:3000');
    });
}