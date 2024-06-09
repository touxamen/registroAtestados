import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js";
import {metodosAtestados as atestados} from "./controllers/atestados.controller.js";
import {metodosModus as modus} from "./controllers/modus.controller.js";
import {metodosTipo as tipo} from "./controllers/tipos.controller.js";
import jwt from 'jsonwebtoken';

//iniciamos express:

const secretKey = 'grupoGit';
const app = express();
//Configuración de puerto:
const PORT = process.env.PORT || 3000;
app.set("port", PORT);
app.listen(app.get("port"));
console.log("servidor corriendo en el puerto ", app.get("port"));

//configuración
app.use(express.static(__dirname + ""))
app.use(express.json());
// Middleware para verificar el token de sesión
const verifyToken = (req, res, next) => {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        console.log("No hay token");
        return res.status(403).send({ message: 'No se proporcionó un token de autenticación.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        console.log("A ver que pasa en el usuario");
        console.log (req.user);
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Token no válido.' });
    }
};
const dimeNombre = (req) => {
    if (req && req.user && req.user.usuario) {
        return req.user.usuario;
    }
    return null;
};
//Enrutamiento
app.get("/", (req,res)=> res.sendFile(__dirname + "/pages/login.html"));

//app.post("/api/register", authentication.register);  // Ruta para registro de usuarios (solo desde admin)
app.post("/api/register", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden registrar usuarios.' });
    }
    
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador");
    authentication.register(req,res);
});


app.post("/api/modificaUsuarios", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden modificar usuarios.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para modificar");
    authentication.modificaUsuario(req,res);
});


app.post("/api/bajaUsuarios", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden dar de baja usuarios.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para modificar");
    authentication.bajaUsuario(req,res);
});
//app.post("/api/altaAtestado", atestados.registroAtestados); //ruta para el registro de atestados (solo desde jefe grupo)
app.post("/api/altaAtestado", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Jefe de grupo' && req.user.perfil !== 'Investigador'  ) {
        console.log("no tenemos permiso de jefe de grupo o investigador");
        return res.status(403).json({ message: 'Acceso denegado: solo los jefes de grupo o investigadorespuedes grabar atestados.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permiso para dar el alta");
    atestados.registroAtestados(req,res);
});

app.post("/api/actualizarAtestado", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Jefe de grupo' && req.user.perfil !== 'Investigador'  ) {
        console.log("no tenemos permiso de jefe de grupo o investigador");
        return res.status(403).json({ message: 'Acceso denegado: solo los jefes de grupo o investigadores pueden actualizar atestados.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permiso para dar el alta");
    atestados.actualizaAtestado(req,res);
});

app.post("/api/registroTipo", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden dar de baja tipos.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para dar de alta un tipo");
    tipo.altaTipo(req,res);
});

app.post("/api/bajaTipos", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden dar de baja tipos.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para modificar");
    tipo.bajaTipo(req,res);
});

app.post("/api/bajaModuss", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
       
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden dar de baja tipos.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para modificar");
    modus.bajaModus(req,res);
});

app.post("/api/registroModus", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    console.log(req.user.perfil);
    if (req.user.perfil !== 'Administrador') {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: solo los administradores pueden dar de baja tipos.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de administrador para modificar");
    modus.altaModus(req,res);
});
app.get("/api/ultimoAtestado", atestados.buscaUltimoAtestado); //ruta para buscar los modus y mostrarlos en el select de los formularios.
app.get("/api/busquedaModus", modus.buscaModus); //ruta para buscar los modus y mostrarlos en el select de los formularios.
app.get("/api/busquedaUsuarios", authentication.buscaUsuarios);  // Ruta para registro de usuarios (solo desde admin)
app.get("/api/busquedaTipo", tipo.buscaTipo); //ruta para buscar los tipos y mostrarlos en el select de los formularios.
app.get("/api/buscaAtestadosPorUsuario", verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es investigador
    if (req.user.perfil !== 'Investigador' && req.user.perfil !== 'Jefe de grupo') {
        console.log("no tenemos permiso de investigador o de jefe de grupo");
        return res.status(403).json({ message: 'Acceso denegado: solo los investigadores y los jefes de grupo pueden ver sus investigaciones' });
    }
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de investigador o de jefe de grupo para ver tus investigaciones");
    const usuarioInvestigaciones = dimeNombre(req);
    if (!usuarioInvestigaciones) {
        console.log("No se pudo obtener el nombre de usuario");
        return res.status(401).json({ message: 'Error al obtener el nombre de usuario.' });
    }
    // Si el usuario es un investigador, continuar con la lógica de búsqueda de atestados
    console.log("Usuario autenticado:", usuarioInvestigaciones);
    atestados.atestadoPorUsuario(req, res, usuarioInvestigaciones);
});
//aquí hacemos búsqueda de usuarios por múltiples conceptos:
app.post('/api/busquedaMultipleAtestados', verifyToken, (req, res) => {
    // Verificar si el usuario autenticado es administrador
    
    const pasoDatos= req.body;
    console.log(req.body);
       
    if (req.user.perfil !== 'Jefe de grupo' && req.user.perfil !== 'Investigador' && req.user.perfil !== 'Comisario' ) {
        console.log("no tenemos permiso de administrador");
        return res.status(403).json({ message: 'Acceso denegado: No tiene permisos.' });
    }
        
    // Si el usuario es administrador, continuar con la lógica de registro de usuarios
    console.log("comprobado usuario, tienes permisos de búsqueda");
    console.log(req.body);
    atestados.busquedaMultiple(req,res);
});


app.post('/api/login', authentication.login);//ruta que gestiona el login en la aplicación