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

var sql = mysql.createConnection({
    host: "localhost",
    user: "mamtha397",
    password: "Mamatha@1",
    database: 'login_mamtha'
});

sql.connect(function(err) {
    if (err) throw err;
});

// Show HTML login
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/view/" + "login.html");
})

//login
app.post('/login', function(req, res) {
    let mykey = crypto.createCipher('aes-128-cbc', 'mamatha123');
    console.log(req.body.email);
    const email = req.body.email;
    const password = req.body.paw;


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
            })
        } else {
            const insertQuery = `INSERT INTO User (email, password) VALUES ( '${email}', '${passCrypto}');`;

            sql.query(insertQuery, function(err, resultInserted) {
                if (err) throw err;
                res.send({
                    status: true,
                    msg: "User Added",
                    email: email,
                    result: resultInserted, 
                    id:resultInserted.insertId,
                })
            });
        }
    });
})

app.listen(port, function() {
    console.log("APP is running on 3000")
})
