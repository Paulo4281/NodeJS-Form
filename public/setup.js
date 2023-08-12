// PACOTES NECESSÁRIOS //

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// ** //

// ARQUIVO JSON DE CONFIGURACOES //

const configFilePath = path.join(__dirname, '../config.json');
const configData = fs.readFileSync(configFilePath, 'utf8');
const config = JSON.parse(configData);

// ** //

// CONEXÃO COM O BANCO DE DADOS MYSQL //

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database || ''
});

// ** //

// QUERIES //

if (connection.config.database === '') {

    const newDatabaseName = "node";
    const newTableName = "cadastros";

    let createDatabaseQuery = `CREATE DATABASE ${newDatabaseName}`;
    connection.query(createDatabaseQuery, (databaseError, databaseResult) => {
        if (!databaseError) {
            let useDatabaseQuery = `USE ${newDatabaseName}`;
            connection.query(useDatabaseQuery, (useDatabaseError, result) => {
                if (!useDatabaseError) {
                    let createTableQuery = `
                    CREATE TABLE IF NOT EXISTS ${newTableName} (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) DEFAULT NULL,
                        sobrenome VARCHAR(255) DEFAULT NULL,
                        nascimento VARCHAR(255) DEFAULT NULL,
                        genero ENUM('Homem', 'Mulher') DEFAULT 'Homem',
                        descricao TEXT DEFAULT NULL,
                        linguagem ENUM('JavaScript', 'PHP', 'Python', 'Java') DEFAULT 'JavaScript'
                    ) DEFAULT CHARSET=utf8
                `;
                connection.query(createTableQuery, (tableError, tableResult) => {
                    if (!tableError) {

                        config.database = newDatabaseName;
                        config.table = newTableName;

                        const updatedConfig = JSON.stringify(config, null, 4);
                        fs.writeFile(configFilePath, updatedConfig, 'utf8', writeFileError => {
                            if (!writeFileError) {
                                console.log(`Base de dados "${newDatabaseName}" criada com sucesso!`);
                            } else {
                                console.error(`Erro ao escrever no arquivo ${configFilePath}: ${writeFileError}`);
                            }
                        });
                    } else {
                        console.error(`Erro ao criar a tabela: ${tableError}`);
                    }
                });
            } else {
                if (databaseError.errno === 1007) {
                    console.error(`Já existe uma base de dados com o nome ${newDatabaseName}`);
                } else {
                    console.error(`Erro ao criar o banco de dados: ${databaseError}`);
                }
            }
        });
        } else {
            console.error(`Error ao utilizar a base de dados "${config.database}"`);
        }
    });
} else {
    console.log(`A base de dados "${config.database}" já foi configurada.`);
}

// ** //
