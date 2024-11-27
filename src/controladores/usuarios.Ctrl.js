import { conmysql } from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsuarios =
async (req, res) => {
    try {
        const [result] = await conmysql.query('select * from usuarios')
        res.json(result)
    } catch (error) {
        return res.status(500).json({ message: 'Errod del lado del servidor' })
    }

}

//función que retorna un usuarios c id
export const getUsarioxid =
async (req, res) => {
    try {
        // console.log(req.params.id)
        const [result] = await conmysql.query('select * from usuarios where usr_id=?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            id: 0,
            messge: "Usuario no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: 'somenting goes wrong' })
    }

}


export const postUsuarios = 
async (req, res) => {
    try {
        const { usr_nombres, usr_apellidos, usr_correo, usr_usuario, usr_clave, FechaRegistro } = req.body;

        // Encriptar la contraseña
        const saltRounds = 10; // Número de rondas para el hash
        const hashedPassword = await bcrypt.hash(usr_clave, saltRounds);

        const [rows] = await conmysql.query('INSERT INTO usuarios (usr_nombres, usr_apellidos, usr_correo, usr_usuario, usr_clave, FechaRegistro) VALUES (?, ?, ?, ?, ?, ?)', 
            [usr_nombres, usr_apellidos, usr_correo, usr_usuario, hashedPassword, FechaRegistro]);

        res.send({ id: rows.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};

export const login = async (req, res) => {
    const { usr_usuario, usr_clave } = req.body;
    
    if (!usr_usuario || !usr_clave) {
        return res.status(400).json({ message: 'Por favor ingrese usuario y contraseña' });
    }

    try {
        const [user] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ?', [usr_usuario]);
        
        if (!user.length) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(usr_clave, user[0].usr_clave);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña inválida' });
        }

        // Crear el token
        const token = jwt.sign({ id: user[0].usr_id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Enviar el token y el id del usuario en la respuesta
        res.status(200).json({ auth: true, token, usr_id: user[0].usr_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del lado del servidor' });
    }
};
