const { Pool } = require('pg');

const DB = new Pool({
    user: 'postgres',
    password: '783836',
    host: 'localhost',
    port: '5432',
    database: 'postgres',
  });

  const AllUsers = {
    registerUser: async (req, res) => {
        const {id, nombre, apellido, gustos, fechaNacimiento} = req.body;
        const response = await DB.query(`INSERT INTO Usuarios (id, nombre, apellido, gustos, fecha_nacimiento) VALUES ('${id}', '${nombre}', '${apellido}', '${gustos}', '${fechaNacimiento}')`);
        res.status(200).send('Usuario registrado con éxito');
    },
    getUser: async (req, res) => {
        const id = req.params.id;
        const response = await DB.query(`Select * from Usuarios where id = '${id}'`);
        res.status(200).send(response.rows);
    },
    getAllUsers: async (req, res) => {
        const response = await DB.query('Select * from Usuarios');
        res.status(200).send(response.rows);
    },
    updateUser: async(req, res) => {
        const id = req.params.id;
        const {nombre, apellido, gustos, fechaNacimiento} = req.body;
        const response = await DB.query(`UPDATE Usuarios SET nombre = '${nombre}', apellido = '${apellido}', gustos = '${gustos}', fecha_nacimiento = '${fechaNacimiento}' WHERE id = '${id}'`);
        res.status(201).send('Usuario actualizado con éxito');
    },
    deleteUser: async(req, res) => {
        const id = req.params.id;
        const response = await DB.query(`DELETE FROM Usuarios WHERE id = '${id}'`);
        res.status(201).send('Usuario eliminado con éxito');
    },
  };


    module.exports = AllUsers;
