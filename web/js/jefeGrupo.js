window.addEventListener('DOMContentLoaded', function() {
    // Obtén los elementos del menú desplegable y los contenidos a mostrar
    const token = localStorage.getItem("token");
    console.log(token);
    const grabacion = document.getElementById('grabacion');
    const consulta = document.getElementById('consulta');
    const misInvestigaciones = document.getElementById('misInvestigaciones');
    const contenidoGrabacion = document.getElementById('contenidoGrabacion');
    const contenidoConsulta = document.getElementById('contenidoConsulta');
    const contenidoResultadoConsulta = document.getElementById('contenidoResultadoConsulta');
    const contenidoMisInvestigaciones = document.getElementById('contenidoMisInvestigaciones');
    let busquedaRecarga = {};
    // Agrega eventos clic a los elementos del menú desplegable

    grabacion.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el grabación de atestado
        // Realizar una solicitud GET para obtener los usuarios para listarlos en el select
        //busca usuarios
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
        // Iterar sobre los usuarios y meterlos en una tabla bulmacs
        const asignadaA = document.getElementById("asignadaA");
        asignadaA.innerHTML = "";
        data.forEach(usuario => {
            const option = document.createElement('option');
            option.textContent = usuario.nombre;
            option.value = usuario.nombre;
            asignadaA.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
        //introducimos los valores en el select de tipos:
        //busca usuarios
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
        // Iterar sobre los usuarios y meterlos en una tabla bulmacs
        const asignadaA = document.getElementById("asignadaA");
        asignadaA.innerHTML = "";
        data.forEach(usuario => {
            const option = document.createElement('option');
            option.textContent = usuario.nombre;
            option.value = usuario.nombre;
            asignadaA.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
        //introducimos los valores en el select de tipos:
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
        throw new Error('Error al obtener los usuarios');
        })
        .then(data => {   
        // Iterar sobre los usuarios y meterlos en una tabla bulmacs
        const selectTipos = document.getElementById("tipo");
        tipo.innerHTML = "";
        data.forEach(tipo => {
            const option = document.createElement('option');
            option.textContent = tipo.tipo;
            option.value = tipo.tipo;
            selectTipos.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
        
        //introducimos los valores en el select de modus:
        
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
        throw new Error('Error al obtener los usuarios');
        })
        .then(data => {   
        // Iterar sobre los usuarios y meterlos en una tabla bulmacs
        const selectModus = document.getElementById("modus");
        modus.innerHTML = "";
        data.forEach(modus => {
            const option = document.createElement('option');
            option.textContent = modus.modo;
            option.value = modus.modo;
            selectModus.appendChild(option);
        });
        })
        .catch(error => {
        // Manejar errores si ocurren durante la solicitud
        console.error('Error:', error);
        // Por ejemplo, mostrar un mensaje de error al usuario
        alert('Hubo un error al obtener los usuarios.');
        });
        ocultarTodosContenidos();
        fetch('/api/ultimoAtestado')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el último número de atestado');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.nextAsunto);
            document.getElementById('numeroAsunto').value = data.nextAsunto; // Asegúrate de que el ID del campo de entrada es correcto
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo cargar el número de asunto');
        });        
        contenidoGrabacion.style.display = 'block';
        document.getElementById("formAtestadoAlta").addEventListener("submit",async(e)=>{
            e.preventDefault();
            //console.log(e);
            const numeroAsunto = document.getElementById("numeroAsunto").value;
            const asignadaAElement = document.getElementById("asignadaA");
            const asignadaA = asignadaAElement.options[asignadaAElement.selectedIndex].value;
            const fecha = document.getElementById("fecha").value;
            const numeroAtestado = document.getElementById("numeroAtestado").value;
            const plantilla = document.getElementById("plantilla").value;
            const ubicacion = document.getElementById("ubicacion").value;
            const nombre = document.getElementById("nombre").value;
            const apellido1 = document.getElementById("apellido1").value;
            const apellido2 = document.getElementById("apellido2").value;
            const subgrupoElement = document.getElementById("subgrupo");
            const subgrupo = subgrupoElement.options[subgrupoElement.selectedIndex].value;
            const tipoElement = document.getElementById("tipo");
            const tipo = tipoElement.options[tipoElement.selectedIndex].value;
            const modusElement = document.getElementById("modus");
            const modus = modusElement.options[modusElement.selectedIndex].value;
            const resumen = document.getElementById("resumen").value;
            const numeroInvestiga = document.getElementById("numeroInvestiga").value;
            const nombreInvestigacion = document.getElementById("nombreInvestigacion").value;
            const cruceElement = document.getElementById("cruce");
            const cruce = cruceElement.options[cruceElement.selectedIndex].value;
            const juzgadoElement = document.getElementById("juzgado");
            const juzgado = juzgadoElement.options[juzgadoElement.selectedIndex].value;
            const diligenciasPrevias = document.getElementById("diligenciasPrevias").value;
            const numeroOficio = document.getElementById("numeroOficio").value;
            const gestiones = document.getElementById("gestiones").value;
            try{   
                const response =  await fetch("http://localhost:3000/api/altaAtestado",{
                    method: "POST",
                    headers:{
                        "Content-Type" : "application/json",
                        "Authorization" : token
                    },
                    body:JSON.stringify({
                        numeroAsunto : numeroAsunto,
                        asignadaA : asignadaA,
                        fecha : fecha,
                        numeroAtestado: numeroAtestado,
                        plantilla : plantilla,
                        ubicacion : ubicacion,
                        nombre: nombre,
                        apellido1: apellido1,
                        apellido2:apellido2,
                        subgrupo:subgrupo,
                        tipo:tipo,
                        modus:modus,
                        resumen:resumen,
                        numeroInvestiga:numeroInvestiga,
                        nombreInvestigacion:nombreInvestigacion,
                        cruce : cruce,
                        juzgado:juzgado,
                        diligenciasPrevias:diligenciasPrevias,
                        numeroOficio:numeroOficio,
                        gestiones:gestiones
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    alert(data.message); // Mensaje del servidor
                    const formulario = document.getElementById('formAtestadoAlta');
                    formulario.reset();
                } else {
                    throw new Error('Error al registrar el atestado');
                }
            } catch (error) {
                console.log(error);
                console.error('Error:', error);
                alert('Hubo un error al registrar el atestado');
            }
        });
    });
    consulta.addEventListener('click', function() {

        ocultarTodosContenidos();
        contenidoConsulta.style.display = 'block';
        //listo los usuarios en el select diseñado al efecto:
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
            // Iterar sobre los usuarios y meterlos en una tabla bulmacs
            const selectUsuarioBusca = document.getElementById("selectUsuarioBusca");
            selectUsuarioBusca.innerHTML = "";
            data.forEach(usuario => {
                const option = document.createElement('option');
                option.textContent = usuario.nombre;
                option.value = usuario.nombre;
                selectUsuarioBusca.appendChild(option);
            });
            const option = document.createElement('option');
            option.textContent = '';
            option.value = '';
            selectUsuarioBusca.appendChild(option);
            })
            .catch(error => {
            // Manejar errores si ocurren durante la solicitud
            console.error('Error:', error);
            // Por ejemplo, mostrar un mensaje de error al usuario
            alert('Hubo un error al obtener los usuarios.');
        });
        
        //aquí pasamos a leer los elementos de la búsqueda. 
        const form = document.getElementById("formContenidoConsulta");
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Evita el comportamiento predeterminado de enviar el formulario
            // Crear un objeto para almacenar los valores de los campos, controlando que no estén vacíos.
            const busqueda = {
                numAsuntoBusca: document.getElementById("numAsuntoBusca").value || 0, 
                atestadoBusca: document.getElementById("atestadoBusca").value || '',
                diligenciasBusca: document.getElementById("diligenciasBusca").value || '',
                nombreBusca: document.getElementById("nombreBusca").value || '',
                apellido1Busca: document.getElementById("apellido1Busca").value || '',
                apellido2Busca: document.getElementById("apellido2Busca").value || '',
                investigacionBusca: document.getElementById("investigacionBusca").value || '',
                selectUsuarioBusca: document.getElementById("selectUsuarioBusca").value || ''
            };
            console.log (busqueda);
            buscarAtestados(busqueda);
        });
        
    });

    function buscarAtestados(busqueda) {
        const datos = busqueda;
        busquedaRecarga = busqueda;
        fetch('/api/busquedaMultipleAtestados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : token
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            // Aquí puedes manejar la respuesta de la API
            console.log(data.atestados);
            renderizarTabla(data.atestados);
        })
        .catch(error => {
            // Aquí puedes manejar los errores
            console.error('Error:', error);
        });
        }          
        function renderizarTabla(elementos) {
        //
            ocultarTodosContenidos();
            contenidoResultadoConsulta.style.display = 'block';
            const tablaRespuesta = document.getElementById("tablaRespuesta");
            tablaRespuesta.innerHTML = ""; // Limpiamos la tabla antes de mostrar los nuevos datos
            console.log(elementos);
            elementos.forEach(elemento => {
                const row = `
                    <tr data-asunto="${elemento.asunto}"> <!-- Agregamos un atributo data-asunto con el valor del campo "asunto" -->
                        <td>${elemento.asunto}</td>
                        <td>${elemento.numero_atestado}</td>
                        <td>${elemento.diligencias_previas}</td>
                        <td>${elemento.nombre_den}</td>
                        <td>${elemento.apellido_den}</td>
                        <td>${elemento.apellido2_den}</td>
                        <td>${elemento.operacion}</td>
                        <td>${elemento.asignacion}</td>
                    </tr>
                `;
                tablaRespuesta.innerHTML += row;
            });
            const filasTabla = document.querySelectorAll("#tablaRespuesta tr");
            filasTabla.forEach(fila => {
                fila.addEventListener("click", () => {
                    const asunto = fila.dataset.asunto; // obtenemos el asunto.
                    abrirVentanaDetalles1(asunto, elementos); // Llamamos a la función para abrir la ventana con los detalles
                });
            });
        }
        function abrirVentanaDetalles1(asunto, elementos) {
            const url = `../pages/modificaAtestado.html?asunto=${encodeURIComponent(asunto)}&elementos=${encodeURIComponent(JSON.stringify(elementos))}`;
            const ventanaResultado = window.open(url, "_blank");
            ventanaResultado.elementos = elementos; // Pasar los elementos a la nueva ventana
            ventanaResultado.onbeforeunload = function() {
                // Cuando la ventana de detalle se cierra, notificamos a la ventana principal
                buscarAtestados(busquedaRecarga);
            };
        }

    //contenido para mostrar las investigaciones que corresponden con el jefe de grupo identificado.
    misInvestigaciones.addEventListener('click', function() {
        ocultarTodosContenidos();
        obtenerMisInvestigaciones();
        //abrimos ventana de detalle   
    });
    function obtenerMisInvestigaciones(){
        fetch('/api/buscaAtestadosPorUsuario',{
            headers: {
                "Authorization": token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los atestados del usuario');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.atestados.length === 0) {
                alert('Actualmente, no tiene ninguna investigación asignada.');
            } else {
                mostrarTabla(data.atestados);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo cargar el número de asunto');
        });
    }
    function mostrarTabla(atestados) {
        ocultarTodosContenidos();
        contenidoMisInvestigaciones.style.display='block'
        const tablaInvestigaciones = document.getElementById("tablaInvestigaciones");
        tablaInvestigaciones.innerHTML="";
        atestados.forEach(atestado => {
            const row = `
                <tr data-asunto="${atestado.asunto}"> <!-- Agregamos un atributo data-asunto con el valor del campo "asunto" -->
                    <td>${atestado.asunto}</td>
                    <td>${atestado.numero_atestado}</td>
                    <td>${atestado.diligencias_previas}</td>
                    <td>${atestado.nombre_den}</td>
                    <td>${atestado.apellido_den}</td>
                    <td>${atestado.apellido2_den}</td>
                    <td>${atestado.operacion}</td>
                    <td>${atestado.investiga}</td>
                </tr>
            `;
            tablaInvestigaciones.innerHTML += row;
        });
        const filasTabla = document.querySelectorAll("#tablaInvestigaciones tr");
        filasTabla.forEach(fila => {
            fila.addEventListener("click", () => {
                const asunto = fila.dataset.asunto; // obtenemos el asunto.
                abrirVentanaDetalles(asunto, atestados); // Llamamos a la función para abrir la ventana con los detalles
            });
        });  
    }
    function abrirVentanaDetalles(asunto, elementos) {
        const url = `../pages/modificaAtestado.html?asunto=${encodeURIComponent(asunto)}&elementos=${encodeURIComponent(JSON.stringify(elementos))}`;
        const ventanaResultado = window.open(url, "_blank");
        ventanaResultado.elementos = elementos;
        ventanaResultado.onbeforeunload = function() {
            // Cuando la ventana de detalle se cierra, notificamos a la ventana principal
            obtenerMisInvestigaciones();
        };
    }
    

    // Función para ocultar todos los contenidos
    function ocultarTodosContenidos() {
        contenidoMisInvestigaciones.style.display = 'none';
        contenidoConsulta.style.display = 'none';
        contenidoGrabacion.style.display = 'none';
        contenidoResultadoConsulta.style.display = 'none';
    }

})