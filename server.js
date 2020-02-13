const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PROT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/customers', (req, res) => {
    res.send([
        {
            'id' : 1,
            'image' : 'https://placeimg.com/64/64/1',
            'name' : '홍길동',
            'birthday' : '951222',
            'gender' : '남성',
            'job' : '대학생'
        },
        {
            'id' : 2,
            'image' : 'https://placeimg.com/64/64/2',
            'name' : '홍길동2',
            'birthday' : '951222',
            'gender' : '남성',
            'job' : '대학생'
        },
        {
            'id' : 3,
            'image' : 'https://placeimg.com/64/64/3',
            'name' : '홍길동3',
            'birthday' : '951222',
            'gender' : '남성',
            'job' : '대학생'
        }
    ]);

});

app.listen(port, () => console.log(`Listenen on ${port} port!`))