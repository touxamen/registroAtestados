import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
//declaro la clave del token de sesión.
const secretKey = 'grupoGit';

// Función para abrir la conexión a la base de datos
async function openDb() {
    return open({
        filename:  './web/db/app.db',
        driver: sqlite3.Database
    });
}
// Función para hashear la contraseña
    async function hashPassword(password) {
        try {
            const saltRounds = 10;
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
            console.log('Contraseña hasheada:', hashedPassword);
            return hashedPassword;
        } catch (error) {
            console.log(error);
            throw new Error('Error al hashear la contraseña');
        }
    }

export const methods = {
    // Función asíncrona para registrar un nuevo usuario
    register: async (req, res) => {
        const { nombre, perfil, password } = req.body;
        console.log(req.body);
        const db = await openDb();
        try {
            // Comprobar si el usuario ya existe
            const userExists = await db.get('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
            if (userExists) {
                res.status(409).json({ message: 'El usuario ya existe', error: error.message });
                return;
            }
            // Insertamos el nuevo usuario en la base de datos
            // Generamos un hash para la contraseña
            const hashedPassword = await hashPassword(password);
            console.log(hashedPassword);
            await db.run('INSERT INTO usuarios (nombre, perfil, password) VALUES (?, ?, ?)', [nombre,perfil, hashedPassword]);
            res.json({ message: "Usuario registrado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    // Función asíncrona para iniciar sesión
    login: async (req, res) => {
        const { usuario, password } = req.body;
        console.log(usuario);
        console.log(password);
        const db = await openDb();
        try {
            // Obtener el usuario de la base de datos
            const user = await db.get('SELECT * FROM usuarios WHERE nombre = ?', [usuario]);
            if (user) {
                // Comparar la contraseña proporcionada con el hash almacenado
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    // Crear un token de sesión y redirigir según el perfil del usuario
                    const token = jwt.sign({ usuario: user.nombre, perfil: user.perfil }, secretKey, { expiresIn: '1h' });
                    let redirectUrl = '/pages/login.html'; // Página predeterminada para redireccionar
                    if (user.perfil === 'Administrador') {
                        redirectUrl = '/pages/administracion.html';
                    } else if (user.perfil === 'Investigador') {
                        redirectUrl = '/pages/investigador.html';
                    } else if (user.perfil === 'Comisario') {
                        redirectUrl = '/pages/comisario.html';
                    } else if (user.perfil === 'Jefe de grupo') {
                        redirectUrl = '/pages/jefeGrupo.html';
                    }
                    res.json({ message: 'Inicio de sesión exitoso', user, redirect: redirectUrl, token });
                } else {
                    res.status(401).json({ message: 'Credenciales incorrectas.' });
                }
            } else {
                res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al intentar iniciar sesión', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
        
    buscaUsuarios: async (req, res) => {
        const db = await openDb();
        try {
            // Obtener todos los modus operandi de la base de datos
            const usuarios = await db.all('SELECT * FROM usuarios');
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    bajaUsuario: async (req, res) => {
        const { id } = req.body;
        console.log (id);
        const db = await openDb();
        try {
            // Verificar si el usuario existe
            const user = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                console.log (user);
                return;
            }
            // Eliminar el usuario de la base de datos
            await db.run('DELETE FROM usuarios WHERE id = ?', [id]);
            res.json({ message: "Usuario eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    modificaUsuario: async (req, res) => {
        const { id, perfil, password } = req.body;
        const db = await openDb();
    
        try {
            // Comprobar si el usuario existe
            const userExists = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
            if (!userExists) {
                res.status(404).json({ message: 'El usuario no existe' });
                return;
            }
            // Actualizar los datos del usuario en la base de datos
            await db.run('UPDATE usuarios SET perfil = ?, password = ? WHERE id = ?', [perfil, password, id]);
            res.json({ message: "Usuario modificado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el usuario', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    }
    
};
