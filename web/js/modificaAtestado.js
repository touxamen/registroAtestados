window.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const asunto = decodeURIComponent(params.get('asunto'));
    const elementosString = params.get('elementos');
    const elementos = JSON.parse(decodeURIComponent(elementosString));
    console.log(asunto);
    console.log(elementos);
    const checkReadyState = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(checkReadyState);
            const asuntoEncontrado = elementos.find(elemento => Number(elemento.asunto) === Number(asunto));
            if (asuntoEncontrado) {
                console.log("Elemento encontrado:", asuntoEncontrado);
                const formulario = document.getElementById("formularioResultado");
                if (formulario) {
                    console.log("Formulario encontrado, asignando valores.");
                    // Asignación de valores
                    document.getElementById("numeroAsunto").value = asuntoEncontrado.asunto;
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
                        /*botonCancelar= formulario.cancelButton;
                        botonCancelar.addEventListener("click", function() {
                            // Llamamos a la función cerrarVentana() para cerrar la ventana
                            cerrarVentana();
                        });*/
                    } else {
                        console.log("Formulario no encontrado en la ventana abierta.");
                    }
                } else {
                    console.log("Elemento no encontrado");
                }
            }
        }, 100); // Verifica cada 100ms
    // Añadimos evento para captar si se quiere modificar el Atestado:
    const formulario = document.getElementById("formularioResultado");
    formulario.cancelButton.addEventListener("click", function() {
        window.close();
    });
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        // Obtener todos los valores del formulario
        const numeroAsunto = formulario.numeroAsunto.value;
        const asignadaA = formulario.asignadaA.value;
        const fecha = formulario.fecha.value;
        const numeroAtestado = formulario.numeroAtestado.value;
        const plantilla = formulario.plantilla.value;
        const ubicacion = formulario.ubicacion.value;
        const nombre = formulario.nombre.value;
        const apellido1 = formulario.apellido1.value;
        const apellido2 = formulario.apellido2.value;
        const subgrupo = formulario.subgrupo.value;
        const tipo = formulario.tipo.value;
        const modus = formulario.modus.value;
        const resumen = formulario.resumen.value;
        const numeroInvestiga = formulario.numeroInvestiga.value;
        const nombreInvestigacion = formulario.nombreInvestigacion.value;
        const cruce = formulario.cruce.value;
        const juzgado = formulario.juzgado.value;
        const diligenciasPrevias = formulario.diligenciasPrevias.value;
        const numeroOficio = formulario.numeroOficio.value;
        const gestiones = formulario.gestiones.value;
        //objeto a buscar:
        const datosAtestado = {
            numeroAsunto,
            asignadaA,
            fecha,
            numeroAtestado,
            plantilla,
            ubicacion,
            nombre,
            apellido1,
            apellido2,
            subgrupo,
            tipo,
            modus,
            resumen,
            numeroInvestiga,
            nombreInvestigacion,
            cruce,
            juzgado,
            diligenciasPrevias,
            numeroOficio,
            gestiones
        };
        console.log(datosAtestado);
        // Enviar los datos al servidor para actualizar la base de datos
        fetch('/api/actualizarAtestado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization" : token
            },
            body: JSON.stringify(datosAtestado)
        })
        .then(response => response.json())
        .then(data => {
            // Aquí puedes manejar la respuesta del servidor
            console.log(data);
            // Por ejemplo, mostrar un mensaje de éxito al usuario
            alert('Los datos del atestado se han actualizado correctamente.');
            // Cerrar la ventana de detalles después de la actualización
            window.close();
        })
        .catch(error => {
            // Aquí puedes manejar los errores
            console.error('Error:', error);
            // Por ejemplo, mostrar un mensaje de error al usuario
            alert('Hubo un error al actualizar los datos del atestado.');
        });
    });
});