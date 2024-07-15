const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.get('/', (req, res) => {
    const success = req.query.success;
    const editSuccess = req.query.editSuccess;
    const sql = 'SELECT * FROM item';
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('home', {
            success: success,
            editSuccess: editSuccess,
            items: results
        });
    });
});



app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const { nome, info, quant, preco, image } = req.body;
    const sql = `INSERT INTO item (nome, info, quant, preco, image) VALUES (?, ?, ?, ?, ?)`;

    conn.query(sql, [nome, info, quant, preco, image], (err) => {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/?success=true');
    });
});

app.get('/item/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM item WHERE id = ?';
    
    conn.query(sql, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('item', { item: results[0] });
        } else {
            res.send('Item não encontrado');
        }
    });
});


app.get('/list', (req, res) => {
    let sql = 'SELECT * FROM item';
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('list', {
            item: results
        });
    });
});

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM item WHERE id = ?`;

    conn.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.render('edit', {
            item: result[0]
        });
    });
});

app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { nome, info, quant, preco, image } = req.body;
    const sql = `UPDATE item SET nome = ?, info = ?, quant = ?, preco = ?, image = ? WHERE id = ?`;

    conn.query(sql, [nome, info, quant, preco, image, id], (err) => {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/?editSuccess=true');
    });
});


app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM item WHERE id = ?`;

    conn.query(sql, [id], (err) => {
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/');
    });
});



// Conexão com o Banco de Dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'produtos'
});

// Conectando ao Banco de Dados
conn.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Conectou ao MySQL');
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
});