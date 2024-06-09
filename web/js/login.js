document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("loginForm").addEventListener("submit",async(e)=>{
        e.preventDefault();
        //console.log(e);
        const usuario = document.getElementById("usuario").value;
        const password = document.getElementById("password").value;
        
        const res =  await fetch("http://localhost:3000/api/login",{
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                usuario : usuario,
                password : password
            })
        })
        if (!res.ok) {
            const errorMessage = await res.json();
            alert(errorMessage.message); // Muestra una ventana emergente con el mensaje de error
            document.getElementById("error-message").innerText = errorMessage.message;
            document.getElementById("error-message").style.display = "block";
            return;
        }
        const resJson = await res.json();
        if (resJson.token) {
            // Guardar el token en el almacenamiento local
            localStorage.setItem("token", resJson.token);
            // Redireccionar a la página deseada
            window.location.href = resJson.redirect;
        } else {
            console.log("Token no recibido en la respuesta.");
        }
    });
});