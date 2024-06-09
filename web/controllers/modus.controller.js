import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Función para abrir la conexión a la base de datos
async function openDb() {
    return open({
        filename:  './web/db/app.db',
        driver: sqlite3.Database
    });
}

export const metodosModus = {
    // Función asíncrona para registrar un nuevo atestado
    altaModus: async (req, res) => {
        const { modus} = req.body;
        const db = await openDb();
        console.log("Abierta BBDD");
        console.log(modus);

        try {
            const modusExiste = await db.get('SELECT * FROM modus WHERE modo = ?', [modus]);
            if (modusExiste) {
                res.status(409).json({ message: 'Ese modus operandi ya existe' });
                return;
            }
           await db.run('INSERT INTO modus (modo) VALUES (?)', [modus]);
            res.json({ message: "Nuevo modus operandi registrado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el nuevo modus', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    buscaModus: async (req, res) => {
        const db = await openDb();
        try {
            // Obtener todos los modus operandi de la base de datos
            const modus = await db.all('SELECT * FROM modus');
            res.json(modus);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los modus operandi', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    
    bajaModus: async (req, res) => {
        const { id } = req.body;
        console.log (id);
        const db = await openDb();
        try {
            // Verificar si el tipo existe
            const tipo = await db.get('SELECT * FROM modus WHERE id = ?', [id]);
            if (!tipo) {
                res.status(404).json({ message: 'Modus Operandi no encontrado' });
                console.log (tipo);
                return;
            }
            // Eliminar el tipo de la base de datos
            await db.run('DELETE FROM modus WHERE id = ?', [id]);
            res.json({ message: "Modus Operandi eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el modus operandi', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    }
};
