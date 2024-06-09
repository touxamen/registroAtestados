import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Función para abrir la conexión a la base de datos
async function openDb() {
    return open({
        filename:  './web/db/app.db',
        driver: sqlite3.Database
    });
}

export const metodosAtestados = {
    // Función asíncrona para registrar un nuevo atestado
    registroAtestados: async (req, res) => {
        //extraemos de req.body la información que almacenamos en las constantes definidas.
        const { numeroAsunto, asignadaA, fecha, numeroAtestado, plantilla, ubicacion, nombre, apellido1, apellido2, subgrupo, tipo, modus, resumen, numeroInvestiga, nombreInvestigacion, cruce, juzgado, diligenciasPrevias, numeroOficio, gestiones } = req.body;
        const db = await openDb();
        try {
            const atestadoExiste = await db.get('SELECT * FROM atestados WHERE asunto = ?', [numeroAsunto]);
            //Evitar en cualquier caso duplicidad en campo asunto.
            if (atestadoExiste) {
                res.status(409).json({ message: 'El atestado ya existe' });
                return;
            }
            // Insertar el nuevo atesatado en la base de datos
            await db.run('INSERT INTO atestados (asunto, asignacion, fecha, numero_atestado, plantilla, ubicacion, nombre_den, apellido_den, apellido2_den, subgrupo, tipo, modus, resumen, investiga, operacion, cruce, juzgado, diligencias_previas, oficios, gestiones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [numeroAsunto, asignadaA, fecha, numeroAtestado, plantilla, ubicacion, nombre, apellido1, apellido2, subgrupo, tipo, modus, resumen, numeroInvestiga, nombreInvestigacion, cruce, juzgado, diligenciasPrevias, numeroOficio, gestiones]);
            res.json({ message: "Atestado registrado exitosamente" });
        } catch (error) {
            //filtramos posibles errores en grabación
            res.status(500).json({ message: 'Error al registrar el atestado', error: error.message });
        } finally {
            // Cierre de la conexión a la base de datos
            await db.close();
        }
    },
    actualizaAtestado: async (req, res) => {
        //extraemos de req.body la información que almacenamos en las constantes definidas.
        const { numeroAsunto, asignadaA, fecha, numeroAtestado, plantilla, ubicacion, nombre, apellido1, apellido2, subgrupo, tipo, modus, resumen, numeroInvestiga, nombreInvestigacion, cruce, juzgado, diligenciasPrevias, numeroOficio, gestiones } = req.body;
        const db = await openDb();
        try {
            // Verificar si el atestado existe
            const atestadoExiste = await db.get('SELECT * FROM atestados WHERE asunto = ?', [numeroAsunto]);
            if (!atestadoExiste) {
                res.status(404).json({ message: 'El atestado no existe' });
                return;
            }
    
            // Actualizar el atestado en la base de datos
            await db.run(`
                UPDATE atestados SET 
                asignacion = ?, 
                fecha = ?, 
                numero_atestado = ?, 
                plantilla = ?, 
                ubicacion = ?, 
                nombre_den = ?, 
                apellido_den = ?, 
                apellido2_den = ?, 
                subgrupo = ?, 
                tipo = ?, 
                modus = ?, 
                resumen = ?, 
                investiga = ?, 
                operacion = ?, 
                cruce = ?, 
                juzgado = ?, 
                diligencias_previas = ?, 
                oficios = ?, 
                gestiones = ? 
                WHERE asunto = ?`,
                [asignadaA, fecha, numeroAtestado, plantilla, ubicacion, nombre, apellido1, apellido2, subgrupo, tipo, modus, resumen, numeroInvestiga, nombreInvestigacion, cruce, juzgado, diligenciasPrevias, numeroOficio, gestiones, numeroAsunto]);
    
            res.json({ message: "Atestado actualizado exitosamente" });
        } catch (error) {
            //Filtrar posibles errores en la grabación.
            res.status(500).json({ message: 'Error al actualizar el atestado', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    }, 
    //Método que devuelve el número que debe tener el atestado a grabar.   
    buscaUltimoAtestado: async (req, res) => {
        const db = await openDb();
        try {
            // Obtener un número de atestado inmediatamente consecutivo al último grabado en BBDD
            const ultimoAtestado = await db.all("SELECT asunto FROM atestados ORDER BY asunto DESC LIMIT 1");
            // Incrementa o empieza en 1 si no hay registros
            const nextAsunto = ultimoAtestado.length > 0 ? ultimoAtestado[0].asunto + 1 : 1; 
            res.json({ nextAsunto: nextAsunto });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el último atestado', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },
    //Método que devuelve las investigaciones asignadas a un usuario (el que está identificado)
    atestadoPorUsuario: async (req, res, usuarioInvestigaciones) => {
        const db = await openDb();
        try {
            // Obtener todos los atestados de la base de datos
            const atestados = await db.all('SELECT * FROM atestados WHERE asignacion = ?', [usuarioInvestigaciones]);
            res.json({ atestados: atestados });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los atestados del usuario', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    },

    //Búsqueda por criterios múltiples:
    busquedaMultiple: async (req, res) => {
        //se reciben todos los elementos del formulario, fuesen rellenados o no.
        const { numAsuntoBusca, atestadoBusca, diligenciasBusca, nombreBusca, apellido1Busca, apellido2Busca, investigacionBusca, selectUsuarioBusca } = req.body;
        const db = await openDb();
        try {
            // Construimos el objeto de consulta para la base de datos
            const queryObj = {};
            // Comprobamos qué campos no son nulos y los agregarmos al objeto de consulta
            if (numAsuntoBusca !== null && numAsuntoBusca !== undefined && numAsuntoBusca !== 0) {
                queryObj.asunto = numAsuntoBusca;
            }
            if (atestadoBusca !== null && atestadoBusca !== undefined && atestadoBusca.trim() !== '') {
                queryObj.numero_atestado = atestadoBusca;
            }
            if (diligenciasBusca !== null && diligenciasBusca !== undefined && diligenciasBusca.trim() !== '') {
                queryObj.diligencias_previas = diligenciasBusca;
            }
            if (nombreBusca !== null && nombreBusca !== undefined && nombreBusca.trim() !== '') {
                queryObj.nombre_den = nombreBusca;
            }
            if (apellido1Busca !== null && apellido1Busca !== undefined && apellido1Busca.trim() !== '') {
                queryObj.apellido1_den = apellido1Busca;
            }
            if (apellido2Busca !== null && apellido2Busca !== undefined && apellido2Busca.trim() !== '') {
                queryObj.apellido2_den = apellido2Busca;
            }
            if (investigacionBusca !== null && investigacionBusca !== undefined && investigacionBusca.trim() !== '') {
                queryObj.operacion = investigacionBusca;
            }
            if (selectUsuarioBusca !== null && selectUsuarioBusca !== undefined && selectUsuarioBusca.trim() !== '') {
                queryObj.asignacion = selectUsuarioBusca;
            }
            // Realizamos la consulta a la base de datos utilizando el objeto de consulta construido
            let atestados;
            if (Object.keys(queryObj).length === 0) {
                // Si no hay parámetros de búsqueda, devolvemos todos los registros
                atestados = await db.all('SELECT * FROM atestados');
            } else {
                // Realizamos la consulta a la base de datos utilizando el objeto de consulta construido
                atestados = await db.all('SELECT * FROM atestados WHERE ' +
                    Object.keys(queryObj).map(key => `${key} = ?`).join(' AND '), Object.values(queryObj));
            }
            res.json({ atestados: atestados });
        } catch (error) {
            res.status(500).json({ message: 'Error al realizar la búsqueda múltiple', error: error.message });
        } finally {
            // Cerrar la conexión a la base de datos
            await db.close();
        }
    }
};
