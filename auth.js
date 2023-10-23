const express = require('express');
const bcrypt = require('bcrypt');
const {expressjwt} = require('express-jwt');
const jwt = require('jsonwebtoken');
const User = require('./modelo.js');

const envVariable = "process.env.SECRET";

const validateJWT = expressjwt({ secret: envVariable, algorithms: ['HS256'] });

const signToken = (_id) => jwt.sign({ _id }, envVariable);

const findAndAsignUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.auth._id);
        if (!user) {
            return res.status(403).end();
        }
        req.auth = user;
        next();
    }catch (e) {
        next(e);
    }
  };
  
  const isAuthenticated = express.Router().use(validateJWT, findAndAsignUser);

const Auth = {
    login: async (req, res) => {
        const {body} = req;
        try{
            const user = await User.findOne({correo: body.correo});
            if(!user){
                return res.status(403).send('Usuario y/o Contraseña incorrectos');
            }else{
                const ismatch = await bcrypt.compare(body.contrasena, user.contrasena);
                if(ismatch){
                    const signed = signToken(user._id);
                    res.status(200).send({signed: signed, user: user._id});
                }else   res.status(403).send(`Usuario y/o Contraseña incorrectos`);
            }
        }catch(e){
            console.error(e);
            res.status(500).send(e.message);
        };
    },
    register: async (req, res) => {
        try {
            const {correo, contrasena} = req.body;
        
            if (!correo || !contrasena) {
              console.log('Ningún dato puede ser nulo. Saliendo.');
              return res.status(403).json({ message: 'Los datos no pueden ser nulos.' });
            }
        
            const isUser = await User.findOne({ correo: correo });
            if (isUser) {
              return res.status(403).send('El usuario ya existe.');
            }
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(contrasena, salt);
            const user = await User.create({correo: correo, contrasena: hash, salt});
            const signed = signToken(user._id);
            res.send({signed: signed, user: user._id});
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al registrar el usuario.' });
          }
    },
};

module.exports = { Auth, isAuthenticated };