const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PROT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

/*const connection = mysql.createConnection();*/

let pool = mysql.createPool({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

const multer = require('multer');
const upload = multer({dest: './upload'});

app.get('/api/customers', (req, res) => {
    pool.getConnection(function(err, connection){
        if (err) {
            console.error('mysql connection error :' + err);
        } else {
            connection.query(
                "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
                (err, rows, fields) => {
                    res.send(rows);
                }
            );
            console.info('data loaded from mysql successfully.');
            connection.release();
        }
    });
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params=[image, name, birthday, gender, job];

    pool.getConnection(function(err, connection){
        if (err) {
            console.error('mysql connection error :' + err);
        } else {
            connection.query(sql, params, (err, rows, field) => {
                res.send(rows);
            });
            console.info('data added to mysql successfully');
            connection.release();
        }
    });
});

app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    pool.getConnection(function(err, connection){
        if (err) {
            console.error('mysql connection error :' + err);
        } else {
            connection.query(sql, params, (err, rows, field) => {
                res.send(rows);
            });
            console.info('data removed from mysql successfully.');
            connection.release();
        }
    });
});

app.listen(port, () => console.log(`Listenen on ${port} port!`));
