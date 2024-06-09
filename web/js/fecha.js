// Obtener la fecha actual
var today = new Date();

// Formatear la fecha como YYYY-MM-DD (formato requerido por el input type="date")
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
var yyyy = today.getFullYear();
var formattedDate = yyyy + '-' + mm + '-' + dd;

// Asignar el valor al campo de fecha
document.getElementById('fecha').value = formattedDate;
