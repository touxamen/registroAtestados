// Obtén los elementos del menú desplegable y los contenidos a mostrar
document.addEventListener('DOMContentLoaded', function() {
    const consulta = document.getElementById('consulta'); 
    const contenidoConsulta = document.getElementById('contenidoConsulta');
    const contenidoResultadoConsulta = document.getElementById('contenidoResultadoConsulta');
    //recuperamos el token de sesión, para lanzarlo a las peticiones
    const token = localStorage.getItem("token");
    // Agrega eventos clic a los elementos del menú desplegable
    
    consulta.addEventListener('click', function() {
        // Oculta todos los contenidos y muestra solo el del Elemento 2
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
            //Introducimos un valor vacío para que no tenga que buscar obligatoriamente por un usuario.
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
    
            const form = document.getElementById("formAtestadoAlta");
        
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
            // Función para manejar el evento click del botón "Cancelar"
            document.getElementById("resetBusqueda").addEventListener("click", function() {
                document.getElementById("formAtestadoAlta").reset();
            });
        
        // Función para llamar buscarAtestados
        function buscarAtestados(busqueda) {
        // Realizar la llamada a la API aquí, pasando los datos de búsqueda como parámetro
        // Por ejemplo:
        const datos = busqueda;
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
                    abrirVentanaDetalles(asunto, elementos); // Llamamos a la función para abrir la ventana con los detalles
                });
            });
        }
        function abrirVentanaDetalles(asunto, elementos) {
        const ventanaResultado = window.open(`../pages/consultaAtestado.html?asunto=${asunto}`, "_blank");
        ventanaResultado.onload = function() {
            const checkReadyState = setInterval(() => {
                if (ventanaResultado.document.readyState === 'complete') {
                    clearInterval(checkReadyState);
                    const asuntoEncontrado = elementos.find(elemento => Number(elemento.asunto) === Number(asunto));
                    if (asuntoEncontrado) {
                        console.log("Elemento encontrado:", asuntoEncontrado);
                        const formulario = ventanaResultado.document.getElementById("formularioResultado");
                        if (formulario) {
                            console.log("Formulario encontrado, asignando valores.");
                            // Asignación de valores
                            ventanaResultado.document.getElementById("numeroAsunto").value = asuntoEncontrado.asunto;
                            //rellenamos los datos de asignada a :
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
                                // Iterar sobre los usuarios y meterlos en una select
                                const asignadaA = formulario.asignadaA;
                                asignadaA.innerHTML = "";
                                data.forEach(usuario => {
                                    const option = document.createElement('option');
                                    option.textContent = usuario.nombre;
                                    option.value = usuario.nombre;
                                    asignadaA.appendChild(option);
                                });
                                // Obtener el valor de asignación del asunto encontrado
                                const asignacionAsunto = asuntoEncontrado.asignacion;
                                // Establecer el valor seleccionado en el elemento select
                                asignadaA.value = asignacionAsunto;
                            })
                            .catch(error => {
                                // Manejar errores si ocurren durante la solicitud
                                console.error('Error:', error);
                                // Por ejemplo, mostrar un mensaje de error al usuario
                                alert('Hubo un error al obtener los usuarios.');
                            });
                            formulario.fecha.value = asuntoEncontrado.fecha;
                            formulario.numeroAtestado.value = asuntoEncontrado.numero_atestado;
                            formulario.plantilla.value = asuntoEncontrado.plantilla;
                            formulario.ubicacion.value = asuntoEncontrado.ubicacion;
                            formulario.nombre.value = asuntoEncontrado.nombre_den;
                            formulario.apellido1.value = asuntoEncontrado.apellido_den;
                            formulario.apellido2.value = asuntoEncontrado.apellido2_den;
                            formulario.subgrupo.value = asuntoEncontrado.subgrupo;
                            
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
                                // Iterar sobre los tips y meterlos en el selectTipos
                                const selectTipos = formulario.tipo;
                                selectTipos.innerHTML = "";
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
                                const selectModus = formulario.modus;
                                selectModus.innerHTML = "";
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
                            formulario.resumen.value = asuntoEncontrado.resumen;
                            formulario.numeroInvestiga.value = asuntoEncontrado.investiga;
                            formulario.nombreInvestigacion.value = asuntoEncontrado.operacion;
                            formulario.cruce.value = asuntoEncontrado.cruce;
                            formulario.juzgado.value = asuntoEncontrado.juzgado;
                            formulario.diligenciasPrevias.value = asuntoEncontrado.diligencias_previas;
                            formulario.numeroOficio.value = asuntoEncontrado.oficios;
                            formulario.gestiones.value = asuntoEncontrado.gestiones;
                            botonCancelar= formulario.cancelButton;
                            botonCancelar.addEventListener("click", function() {
                                // Llamamos a la función cerrarVentana() para cerrar la ventana
                                cerrarVentana();
                            });
                        } else {
                            console.log("Formulario no encontrado en la ventana abierta.");
                        }
                    } else {
                        console.log("Elemento no encontrado");
                    }
                }
            }, 100); // Verifica cada 100ms
        }
    }
});
    
    // Función para ocultar todos los contenidos
    function ocultarTodosContenidos() {
        contenidoConsulta.style.display = 'none';
        contenidoResultadoConsulta.style.display = 'none';
    }
    
});