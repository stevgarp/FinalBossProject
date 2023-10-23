const express = require('express');
const mongoose = require('mongoose');
const {Auth, isAuthenticated}  = require('./auth.js');
const AllUsers = require('./getUserController.js');

const app = express();
app.use(express.json());
const port = 3000;

async function conectarDB() {
  try {
    await mongoose.connect(`mongodb+srv://stevgtpayes:root1234@cluster0.ohcx1sx.mongodb.net/prueba?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB con Mongoose');
  } catch (error) {
    console.error('Error al conectar a MongoDB con Mongoose:', error);
  }
}
conectarDB();

app.post('/registrar-usuario', Auth.register);
app.post('/login', Auth.login);
app.post('/usuario-completo', AllUsers.registerUser);
app.get('/usuarios', isAuthenticated, AllUsers.getAllUsers);
app.get('/usuario/:id', isAuthenticated, AllUsers.getUser);
app.put('/actualizar-usuario/:id', isAuthenticated, AllUsers.updateUser);
app.delete('/eliminar-usuario/:id', isAuthenticated, AllUsers.deleteUser);

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get('*', (req, res) => {
    res.status(404).send('404 not found');
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});