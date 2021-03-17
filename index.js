const port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fileUpload = require("express-fileupload")
var crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static(__dirname + '/uploadImages'));

// var sql = mysql.createConnection({
//     host: "sql12.freesqldatabase.com",
//     user: "sql12393481",
//     password: "zfl1FvP5LA",
//     database: 'sql12393481'
// });

// sql.connect(function(err) {
//     if (err) throw err;
// });

//home
// Show HTML show_product_v2
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/view/" + "show_product_v2.html");
})

//login
app.post('/login', function(req, res) {
    let mykey = crypto.createCipher('aes-128-cbc', 'mamatha123');
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;


    let passCrypto = mykey.update(`${password}`, 'utf8', 'hex')
    passCrypto += mykey.final('hex');

    const selectQuery = `SELECT * FROM User WHERE email='${email}'`;

    sql.query(selectQuery, function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            if(result[0].password!==passCrypto){
                UpdatePassword(passCrypto,result[0].id)
            }
            res.send({
                status: true,
                msg: "User exist",
                email: email,
                result: result,
                id:result[0].id,
                name:name
            })
        } else {
            const insertQuery = `INSERT INTO User (name, email, password) VALUES ('${name}', '${email}', '${passCrypto}');`;

            sql.query(insertQuery, function(err, resultInserted) {
                if (err) throw err;
                res.send({
                    status: true,
                    msg: "User Added",
                    email: email,
                    result: resultInserted, 
                    id:resultInserted.insertId,
                    name:name
                })
            });
        }
    });
})

app.listen(port, function() {
    console.log("APP is running on 8081")
})
