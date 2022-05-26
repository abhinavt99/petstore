const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser')
app.use(bodyparser.json());
const key = 'abhinav'

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root1',
    password: 'root1',
    database: 'petstore',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('Connection Successfull');
    else
        console.log('Not Successfull \n Error: ' + JSON.stringify(err, undefined, 2));
});

app.listen(4000,()=>console.log('Express server is running at port: 4000'));

//Login
app.get('/users/login', (req, res) => {
    mysqlConnection.query('SELECT * from userr WHERE username=? and passwordd=? LIMIT 1',[req.body.username,req.body.passwordd], (err, rows, fields) => {
        if (!err)
            res.send(  
                {
                    success: "true",
                    "message": "Login Successful",
                    key: key
                    } 
            );
        else
            console.log(err);
    })
});

//Get an user by username
app.get('/users/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM userr WHERE username = ?',[req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Create User
app.post('/users', (req, res) => {
    let usr = [req.body.id,req.body.username,req.body.firstName,req.body.lastName,req.body.email,req.body.passwordd,req.body.phone,req.body.userStatus];
    var sql = "insert into userr(id, username, firstName, lastName, email, passwordd, phone, userStatus) values(?, ?, ?, ?, ?, ?, ?, ?)";
    if(req.body.key===key){
        mysqlConnection.query(sql, usr,(err, rows, fields) =>{
            if (!err)
                res.send(rows);
            else
                console.log(err);
        });
    }
    else{
        res.send({
            success: false,
            messsage: 'Wrong credentials, Please login again.'

        })
    }
    });

    //Delete user
app.delete('/users/:id', (req, res) => {
    if(req.body.key === key){
        mysqlConnection.query('DELETE FROM userr WHERE username = ?',[req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('Delete operation sussessful');
            else
                console.log(err);
        })
    }
    else{
        res.send({
            success: false,
            messsage: 'Wrong credentials, Please login again.'

        })
    }
});

 //Update user
 app.put('/users/:id', (req, res) => {
    if(req.body.key === key){
        mysqlConnection.query('update userr set firstName = ? where username = ?',[req.query.firstName,req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('Update operation sussessful');
            else
                console.log(err);
        })
    }
    else{
        res.send({
            success: false,
            messsage: 'Wrong credentials, Please login again.'

        })
    }
   
});

//Insert array of Users
app.post('/users/multiuser', (req, res) => {
    var sql = "insert into userr(id, username, firstName, lastName, email, passwordd, phone, userStatus) values"; 


    req.body.data.map((items) => {
        sql += "("+items.id+",'"+items.username+"','"+items.firstName+"','"+items.lastName+"','"+items.email+"','"+items.passwordd+"','"+items.phone+"',"+items.userStatus+")," 
    })
    
    sql = sql.slice(0, -1) + ';' 
    if(req.body.key===key){
        mysqlConnection.query(sql, (err, rows, fields) =>{
            if (!err)
                res.send(rows);
            else
                console.log(err);
        });
    }
    else{
        res.send({
            success: false,
            messsage: 'Wrong credentials, Please login again.'

        })
    }
    });
