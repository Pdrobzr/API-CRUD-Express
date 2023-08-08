const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./models/connect');

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/api', async (req, res) => {
    try{
        const [query] = await connection.execute("SELECT * FROM tasks");
        // const nome = query.map((task) => task.nm_task)
        res.json(query);
    } catch (err) {
        res.status(400).json({message: err});
    }
});

app.get('/api/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const query = "SELECT * FROM tasks WHERE id_task = ?";
        const [execute] = await connection.execute(query, [id]);
        if(execute.length > 0){
            res.json(execute);
        } else {
            res.json({message: "Erro ao encontrar essa task!"});
        }
    } catch(err) {
        res.status(400).json({message: err});
    }
});

app.post('/api', async (req, res) => {
    try{
        const { task } = req.body;
        const date = new Date(Date.now()).toLocaleDateString();
        const query = "INSERT INTO tasks(nm_task, nm_situacao, dt_task) VALUES (?, ?, ?)";
        const [execute] = await connection.execute(query, [task, "pendente", date]);
        res.json({message: 'Task adicionada com sucesso!'});
    } catch(err){
        res.status(400).json({message: err});
    }
});

app.put('/api/:id', async (req, res) => {
    try{
        // const { situacao } = req.body;
        const { id } = req.params;
        const query = "UPDATE tasks SET nm_situacao = 'concluida' WHERE id_task = ?";
        const [execute] = await connection.execute(query, [id]);
        if(execute.affectedRows > 0) {
            res.json({message: 'Task concluida com sucesso!'});
        } else {
            res.status(400).json({message: 'Erro ao atualizar a task!'});
        }
    } catch(err){
        res.json({message: err});
    }
});

app.delete('/api/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const query = "DELETE FROM tasks WHERE id_task = ?";
        const [execute] = await connection.execute(query, [id]);
        if(execute.affectedRows > 0){
            res.json({message: 'Task deletada com sucesso!'});
        } else {
            res.status(400).json({message: 'Erro ao deletar a task!'});
        }
    } catch(err){
        res.json({message: err});
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!`));