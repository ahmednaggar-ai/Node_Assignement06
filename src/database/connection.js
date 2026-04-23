import mysql from 'mysql2';


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'assignment_06'
});

connection.connect((err)=>{
    if(err){
        console.log('Error connecting to database', err);
    }else{
        console.log('Connected to database');
    }
});


export {connection};