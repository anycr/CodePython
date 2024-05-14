document.addEventListener('DOMContentLoaded', function() {
    const formTarea = document.getElementById('form-tarea');
    const inputDescripcion = document.getElementById('descripcion');
    const inputAsignado = document.getElementById('asignado');
    const listaTareas = document.getElementById('lista-tareas');

    formTarea.addEventListener('submit', function(event) {
        event.preventDefault();
        const descripcion = inputDescripcion.value;
        const asignado = inputAsignado.value;
        if (descripcion.trim() !== '' && asignado.trim() !== '') {
            agregarTarea(descripcion, asignado);
            inputDescripcion.value = '';
            inputAsignado.value = '';
        }
    });

    function agregarTarea(descripcion, asignado) {
        const tarea = { descripcion, asignado };

        fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        })
        .then(response => {
            if(response.ok) {
                actualizarListaTareas();
                alert("La tarea se agregó correctamente");
            }
        })
        .catch(error => console.error('Error en la solicitud', error));
    }

    function actualizarListaTareas() {
        fetch('http://127.0.0.1:5000/')
        .then(response => response.json())
        .then(data => {
            listaTareas.innerHTML = '';
            data.tareas.forEach(tarea => {
                const tareaHTML = `<li>${tarea.descripcion} - Asignado a: ${tarea.asignado} - ${tarea.completada ? 'Completada' : 'Pendiente'}</li>`;
                listaTareas.innerHTML += tareaHTML;
            });
        })
        .catch(error => console.error('Error al obtener las tareas:', error));
    }

    actualizarListaTareas();
});
