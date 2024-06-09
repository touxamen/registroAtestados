import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Función para abrir la conexión a la base de datos
async function openDb() {
    return open({
        filename:  './web/db/app.db',
        driver: sqlite3.Database
    });
}

export const metodosTipo = {
    // Función asíncrona para registrar un nuevo atestado
    altaTipo: async (req, res) => {
        const {tipo} = req.body;
        const db = await openDb();
        console.log("Abierta BBDD");
        console.log(tipo);

        try {
            
            const tipoExiste = await db.get('SELECT * FROM tipos WHERE tipo = ?', [tipo]);
            
            if (tipoExiste) {
                res.status(409).json({ message: 'Ese tipo penal ya existe' });
                return;
            }
            // Insertar el nuevo atesatado en la base de datos
            //OJO POR AQUI
           await db.run('INSERT INTO tipos (tipo) VALUES (?)', [tipo]);
            res.json({ message: "Nuevo tipo penal registrado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el nuevo tipo penal', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    buscaTipo: async (req, res) => {
        const db = await openDb();
        try {
            // Obtener todos los tipos de la base de datos
            const tipo = await db.all('SELECT * FROM tipos');
            res.json(tipo);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los tipos penales', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    bajaTipo: async (req, res) => {
        const { id } = req.body;
        console.log (id);
        const db = await openDb();
        try {
            // Verificar si el tipo existe
            const tipo = await db.get('SELECT * FROM tipos WHERE id = ?', [id]);
            if (!tipo) {
                res.status(404).json({ message: 'Tipo penal no encontrado' });
                console.log (tipo);
                return;
            }
            // Eliminar el tipo de la base de datos
            await db.run('DELETE FROM tipos WHERE id = ?', [id]);
            res.json({ message: "Tipo penal eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el tipo penal', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    }
};