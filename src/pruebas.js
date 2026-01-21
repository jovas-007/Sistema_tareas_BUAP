// Verificar autenticación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
});

function verificarSesion() {
    const currentUser = localStorage.getItem('currentUser');
    console.log('verificarSesion - currentUser:', currentUser);
    
    if (!currentUser) {
        console.log('No hay usuario, redirigiendo a login');
        window.location.href = 'index-angular.html';
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
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        window.location.href = 'index-angular.html';
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
