document.addEventListener('DOMContentLoaded', function() {
    // Obtén los elementos del menú desplegable y los contenidos a mostrar
    const userAlta = document.getElementById('userAlta');
    const contenidoUserAlta = document.getElementById('contenidoUserAlta');
    const userBaja = document.getElementById('userBaja');
    const contenidoUserBaja = document.getElementById('contenidoUserBaja');
    const userModi = document.getElementById('userModi');
    const contenidoModiUser = document.getElementById('contenidoModiUser');
    const tipoAlta = document.getElementById('tipoAlta');
    const contenidoTipoAlta = document.getElementById('contenidoTipoAlta');
    const tipoBaja = document.getElementById('tipoBaja');
    const contenidoTipoBaja = document.getElementById('contenidoTipoBaja');
    const modusAlta = document.getElementById('modusAlta');
    const contenidoModusAlta = document.getElementById('contenidoModusAlta');
    const modusBaja = document.getElementById('modusBaja');
    const contenidoModusBaja = document.getElementById('contenidoModusBaja');
    //recuperamos el token de sesión, para lanzarlo a las peticiones
    const token = localStorage.getItem("token");
    // Agrega eventos clic a los elementos del menú desplegable
    userAlta.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del dar de alta el usuario
        ocultarTodosContenidos();
        contenidoUserAlta.style.display = 'block';
        buscarUsuarios();
    });
    // Función para buscar y llenar la tabla de usuarios
    function buscarUsuarios() {
        fetch('http://localhost:3000/api/busquedaUsuarios', {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            // Verificar si la respuesta es exitosa (código de estado 200)
            if (response.ok) {
                // Convertir la respuesta a formato JSON
                return response.json();
            }
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('Error al obtener los usuarios');
        })
        .then(data => {
            // Iterar sobre los usuarios y meterlos en una tabla
            const tablaUsuarios = document.getElementById("tablaUsuarios");
            tablaUsuarios.innerHTML = "";
            data.forEach(usuario => {
                const fila = document.createElement("tr");
                const celdaNombre = document.createElement("td");
                const celdaPerfil = document.createElement("td");
                celdaNombre.textContent = usuario.nombre;
                celdaPerfil.textContent = usuario.perfil;
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaPerfil);
                tablaUsuarios.appendChild(fila);
            });
            
            // Actualizar el select del formulario
            //actualizarSelectUsuarios(data);
        })
        .catch(error => {
            // Manejar errores si ocurren durante la solicitud
            console.error('Error:', error);
            // Por ejemplo, mostrar un mensaje de error al usuario
            alert('Hubo un error al obtener los usuarios.');
        });
    }
    // Manejador de evento submit del formulario de alta
    document.getElementById("formUserAlta").addEventListener("submit", async (e) => {
        e.preventDefault();
        //console.log(e);
        const usuario = document.getElementById("nuevoUsuario").value;
        const perfil = document.getElementById("perfil").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    nombre: usuario,
                    password: password,
                    perfil: perfil
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formUserAlta');
                formulario.reset();
                buscarUsuarios();
            } else {
                throw new Error('Error al registrar usuario');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al registrar el usuario');
        }
    });

    userModi.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del Elemento 2
        ocultarTodosContenidos();
        contenidoModiUser.style.display = 'block';
        // Realizar una solicitud GET para obtener los usuarios desde el servidor
        fetch('http://localhost:3000/api/busquedaUsuarios',{
            headers:{
                "Authorization": token
            }
        })
        .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            return response.json();
        }
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('Error al obtener los usuarios');
        })
        .then(data => {
        // Manipulamos los datos recibidos para actualizar el select.
        
        const selectModiUsuarios = document.getElementById('selectModiUsuarios');
        
        // Limpiamos el select y almacenamos en array los usuarios
        selectModiUsuarios.innerHTML = '';
        
        // Iterar sobre los modus operandi y agregar opciones al select
    
        data.forEach(usuario => {
            const option = document.createElement('option');
            option.textContent = usuario.nombre; // Suponiendo que el nombre del campo en la base de datos es "modo"
            option.value = usuario.id; // Suponiendo que el campo id de la tabla es "id"
            selectModiUsuarios.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
        //Los perfiles son fijos, y la contraseña la pedimos. procedemos por tanto a la actualizacion en tabla
    });
    document.getElementById("formModiUser").addEventListener("submit",async(e)=>{
        e.preventDefault();
        const id = document.getElementById("selectModiUsuarios").value;
        const perfil = document.getElementById("selectPerfilUsuarios").value;
        const password = document.getElementById("contrasenaUsuario").value;
        try{   
            const response =  await fetch("http://localhost:3000/api/modificaUsuarios",{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization": token  // Incluir el token en el encabezado
                },
                body:JSON.stringify({
                    id : id,
                    password : password,
                    perfil : perfil
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formModiUser');
                formulario.reset();
            } else {
                throw new Error('Error al modificar el usuario');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al modificar el usuario');
        }
    });
    userBaja.addEventListener('click', function() {
        
        ocultarTodosContenidos();
        contenidoUserBaja.style.display = 'block';
        // Realizar una solicitud GET para obtener los usuarios para listarlos en el select
        actualizaSelectUsuarios();
        
    });
    function actualizaSelectUsuarios(){
        fetch('http://localhost:3000/api/busquedaUsuarios',{
            headers:{
                "Authorization": token
            }
        })
        .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            return response.json();
        }
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('Error al obtener los usuarios');
        })
        .then(data => {   
        // Iterar sobre los usuarios y meterlos en select
        
        const selectBajaUsuarios = document.getElementById("selectBajaUsuarios");
        selectBajaUsuarios.innerHTML = "";
        data.forEach(usuario => {
            const option = document.createElement('option');
            option.textContent = usuario.nombre;
            option.value = usuario.id;
            selectBajaUsuarios.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
    }
    //Aquí procedo a la baja del usuario al leer el valor del select.
    document.getElementById("formUserBaja").addEventListener("submit",async(e)=>{
        e.preventDefault();
        //console.log(e);
        const id = document.getElementById("selectBajaUsuarios").value;
        try{   
            const response =  await fetch("http://localhost:3000/api/bajaUsuarios",{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body:JSON.stringify({
                    id : id
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formUserBaja');
                formulario.reset();
                actualizaSelectUsuarios();
            } else {
                throw new Error('Error al eliminar el usuario.');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al eliminar el usuario');
        }
    });

    tipoAlta.addEventListener('click', function() {
        ocultarTodosContenidos();
        contenidoTipoAlta.style.display = 'block';
        actualizarTablaTipos();
    });
    //Actualizamos los datos de la tabla de tipos:
    function actualizarTablaTipos() {
        fetch('http://localhost:3000/api/busquedaTipo', {
            headers: {
                "Authorization": token
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los tipos penales');
            return response.json();
        })
        .then(data => {
            const tablaTipos = document.getElementById("tablaTipos");
            tablaTipos.innerHTML = "";
            data.forEach(tipo => {
                const fila = document.createElement("tr");
                const celdaTipo = document.createElement("td");
                celdaTipo.textContent = tipo.tipo;
                fila.appendChild(celdaTipo);
                tablaTipos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener los tipos penales.');
        });
    }
    //realizamos el alta del nuevo tipo penal
    document.getElementById("formTipoAlta").addEventListener("submit", async (e) => {
        e.preventDefault();
        const tipo = document.getElementById("nuevoTipo").value;
        console.log (tipo);
        try {
            const response = await fetch("http://localhost:3000/api/registroTipo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    tipo: tipo
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formTipoAlta');
                formulario.reset();
                actualizarTablaTipos();
            } else {
                throw new Error('Error al registrar el nuevo tipo penal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar el nuevo tipo penal');
        }
    });

    tipoBaja.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del Elemento 2
        ocultarTodosContenidos();
        contenidoTipoBaja.style.display = 'block';
        actualizaSelectTipos();
        
    });
    function actualizaSelectTipos(){
        // Realizar una solicitud GET para obtener los modus operandi desde el servidor
        fetch('http://localhost:3000/api/busquedaTipo',{
            headers:{
                "Authorization": token
            }
        })
        .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            return response.json();
        }
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('Error al obtener los tipos penales');
        })
        .then(data => {
        // Manipulamos los datos recibidos para actualizar el select.
        
        const selectTipoBaja = document.getElementById('selectTipoBaja');
        // Limpiamos el select
        selectTipoBaja.innerHTML = '';
        // Iterar sobre los modus operandi y agregar opciones al select
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.textContent = tipo.tipo; // Suponiendo que el nombre del campo en la base de datos es "modo"
            option.value = tipo.id; // Suponiendo que el campo id de la tabla es "id"
            selectTipoBaja.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los tipos penales');
        });
    }
    //Aquí procedo a la baja del tipo al leer el valor del select.
    document.getElementById("formTipoBaja").addEventListener("submit",async(e)=>{
        e.preventDefault();
        //console.log(e);
        const id = document.getElementById("selectTipoBaja").value;
        try{   
            const response =  await fetch("http://localhost:3000/api/bajaTipos",{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body:JSON.stringify({
                    id : id
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formTipoBaja');
                formulario.reset();
                actualizaSelectTipos();
            } else {
                throw new Error('Error al eliminar el Tipo Penal.');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al eliminar el Tipo Penal');
        }
    });

    modusAlta.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del dar de alta el usuario
        ocultarTodosContenidos();
        contenidoModusAlta.style.display = 'block';
        actualizarTablaModus();
    });
    function actualizarTablaModus(){
        //listamos modus en tabla
        fetch('http://localhost:3000/api/busquedaModus',{
            headers:{
                "Authorization": token
            }
        })
        .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            return response.json();
        }
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('Error al obtener los modus operandi');
        })
        .then(data => {   
        // Iterar sobre los modus y meterlos en una tabla bulmacs
        const tablaModus = document.getElementById("tablaModus");
        tablaModus.innerHTML = "";
        data.forEach(modus => {
            const fila = document.createElement("tr");
            const celdaModus = document.createElement("td");
            celdaModus.textContent = modus.modo;
            fila.appendChild(celdaModus);
            tablaModus.appendChild(fila);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los modus operandi.');
        });
    }
    //alta en BBDD de nuevo modus
    document.getElementById("formModusAlta").addEventListener("submit",async(e)=>{
        e.preventDefault();
        const modus = document.getElementById("nuevoModus").value;
        try{   
            const response =  await fetch("http://localhost:3000/api/registroModus",{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body:JSON.stringify({
                    modus : modus
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formModusAlta');
                formulario.reset();
                actualizarTablaModus();
            } else {
                throw new Error('Error al registrar el nuevo modus');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al registrar el modus');
        }
    });
    modusBaja.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del baja.
        ocultarTodosContenidos();
        contenidoModusBaja.style.display = 'block';
        actualizarSelectModus();  
    });
    function actualizarSelectModus(){
        // Realizar una solicitud GET para obtener los modus operandi desde el servidor
        fetch('http://localhost:3000/api/busquedaModus',{
            headers:{
                "Authorization": token
            }
        })
        .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200)
        if (response.ok) {
            // Convertir la respuesta a formato JSON
            return response.json();
        }
        // Si la respuesta no es exitosa, lanzar un error
        throw new Error('Error al obtener los modus operandi');
        })
        .then(data => {
        // Manipulamos los datos recibidos para actualizar el select.
        
        const selectModusBaja = document.getElementById('selectModusBaja');
        // Limpiamos el select
        selectModusBaja.innerHTML = '';
        // Iterar sobre los modus operandi y agregar opciones al select
        data.forEach(modus => {
            const option = document.createElement('option');
            option.textContent = modus.modo; // Suponiendo que el nombre del campo en la base de datos es "modo"
            option.value = modus.id; // Suponiendo que el campo id de la tabla es "id"
            selectModusBaja.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los modus operandi');
        });
    }
    document.getElementById("formModusBaja").addEventListener("submit",async(e)=>{
        e.preventDefault();
        //console.log(e);
        const id = document.getElementById("selectModusBaja").value;
        try{   
            const response =  await fetch("http://localhost:3000/api/bajaModuss",{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body:JSON.stringify({
                    id : id
                })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Mensaje del servidor
                const formulario = document.getElementById('formModusBaja');
                formulario.reset();
                actualizarSelectModus();
            } else {
                throw new Error('Error al eliminar el Modus Operandi.');
            }
        } catch (error) {
            console.log(error);
            console.error('Error:', error);
            alert('Hubo un error al eliminar el Modus Operandi');
        }
    });
    // Función para ocultar todos los contenidos
    function ocultarTodosContenidos() {
        contenidoUserAlta.style.display = 'none';
        contenidoUserBaja.style.display = 'none';
        contenidoModiUser.style.display = 'none';
        contenidoTipoAlta.style.display = 'none';
        contenidoTipoBaja.style.display = 'none';
        contenidoModusAlta.style.display = 'none';
        contenidoModusBaja.style.display = 'none';
    }
});