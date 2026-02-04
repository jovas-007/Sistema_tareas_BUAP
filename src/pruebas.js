// Verificar autenticación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
});

function verificarSesion() {
    const currentUser = localStorage.getItem('currentUser');
    console.log('verificarSesion - currentUser:', currentUser);
    
    if (!currentUser) {
        console.log('No hay usuario, redirigiendo a login');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const user = JSON.parse(currentUser);
        console.log('Usuario parseado:', user);
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Bienvenido, ${user.nombre_completo}`;
        }
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement && user.correo) {
            userEmailElement.textContent = `Email: ${user.correo}`;
        }
        
        // Cargar carrera del usuario
        cargarCarreraUsuario(user.id_usuario);
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        window.location.href = 'login.html';
    }
}

function irATareas() {
    console.log('Navegando a tareas.html');
    window.location.href = 'tareas.html';
}

function cerrarSesion() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index-angular.html';
}

async function cargarCarreraUsuario(id_usuario) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users`);
        const data = await response.json();
        const users = data.users || data;
        const usuario = users.find(u => u.id_usuario === id_usuario);
        
        const carreraElement = document.getElementById('userCarrera');
        if (carreraElement && usuario && usuario.carrera) {
            carreraElement.textContent = usuario.carrera;
        } else if (carreraElement) {
            carreraElement.textContent = 'No especificada';
        }
    } catch (error) {
        console.error('Error al cargar carrera:', error);
        const carreraElement = document.getElementById('userCarrera');
        if (carreraElement) {
            carreraElement.textContent = 'Error al cargar';
        }
    }
}
