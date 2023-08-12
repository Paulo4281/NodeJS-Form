
// PACOTES NECESSÁRIOS //

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ** //

// ARQUIVO JSON DE CONFIGURACOES //

const configData = fs.readFileSync('../config.json', 'utf8');
const config = JSON.parse(configData);

// ** //


// CONFIGURAÇÃO DO SERVIDOR NODE //

const app = express();
const port = config.port;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// ** //

// CONEXÃO COM O BANCO DE DADOS MYSQL //

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database || ''
});

// ** //

// MIDDLEWARES UTILIZADOS //

app.use(cors());
app.use(bodyParser.urlencoded({ extended: config.extended }));
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `${config.origin}`);
    res.setHeader('Access-Control-Allow-Method', `${config.methods}`);
    res.setHeader('Access-Control-Allow-Headers', `${config.content}`);
    next();
});

// ** //

// ROUTES //

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../config.json'));
});

app.post('/cadastro', async (req, res) => {

    let nome = req.body.nome;
    let sobrenome = req.body.sobrenome;
    let nascimento = req.body.nascimento;
    let genero = req.body.genero;
    let descricao = req.body.descricao;
    let linguagem = req.body.linguagem;

    const query = `INSERT INTO ${config.table} (nome, sobrenome, nascimento, genero, descricao, linguagem) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const result = await connection.promise().query(query, [nome, sobrenome, nascimento, genero, descricao, linguagem]);
                if (result[0].affectedRows == 1) {
                    res.status(200).send([{'status':'1','message':'Dados inseridos com sucesso!'}]);
                } else if (result[0].affectedRows == 0) {
                    res.status(500).send([{'status':'0','message':'Ocorreu algum erro durante a inserção dos dados'}]);
                }
        } catch (error) {
            res.status(500).send([{'status':'0','message':`Error: ${error}`}]);
        }

});

// ** //