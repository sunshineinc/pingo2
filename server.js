const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Banco de dados simples em memória (somente para testes)
const users = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota de registro
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, error: 'Usuário e senha são obrigatórios' });
  }

  const exists = users.find(user => user.username === username);
  if (exists) {
    return res.json({ success: false, error: 'Usuário já existe' });
  }

  users.push({ username, password });
  return res.json({ success: true });
});

// Comunicação em tempo real
io.on('connection', (socket) => {
  console.log('🟢 Novo usuário conectado');

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuário desconectado');
  });
});

// Inicializa o servidor
http.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
