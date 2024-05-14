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
        var tarea = {
            descripcion: descripcion,
            asignado: asignado
        };

        fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarea)
        })
        .then((response) => {
            if(response.ok){
                alert("La llamada funcionó correctamente");
                // Actualizar lista de tareas al completar la solicitud
                actualizarListaTareas();
            }
        })
        .catch(function (error) {
            console.log('Error en la solicitud', error);
        });
    }
    
    function completarTarea(posicion) {
        fetch(`http://127.0.0.1:5000/completar/${posicion}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if(response.ok){
                alert("Tarea completada correctamente");
                // Actualizar lista de tareas al completar la solicitud
                actualizarListaTareas();
            }
        })
        .catch(function (error) {
            console.log('Error en la solicitud', error);
        });
    }

    function eliminarTarea(index) {
        fetch(`http://127.0.0.1:5000/eliminar/${index}`, {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
                // Actualizar la lista de tareas después de eliminar la tarea
                actualizarListaTareas();
            } else {
                console.error('Error al eliminar la tarea');
            }
        })
        .catch(error => console.error('Error al eliminar la tarea:', error));
    } 
    
    function actualizarListaTareas() {
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then(data => {
                // Limpiar lista de tareas antes de agregar las actualizadas
                listaTareas.innerHTML = '';
                // Agregar las tareas recibidas del servidor
                data.tareas.forEach((tarea, index) => {
                    const nuevaTarea = document.createElement('li');
                    nuevaTarea.textContent = tarea.descripcion + ' - Asignado a: ' + tarea.asignado + ' - ' + (tarea.completada ? 'Completada ' : 'Pendiente ');
    
                    // Agregar botón para marcar tarea como completada
                    const completarBtn = document.createElement('button');
                    completarBtn.textContent = 'Completar';
                    completarBtn.className = 'btn-completar'; // Agregamos una clase para estilizar el botón
                    completarBtn.addEventListener('click', function() {
                        completarTarea(index);
                    });
                    nuevaTarea.appendChild(completarBtn);
    
                    // Agregar espacio entre botones
                    nuevaTarea.appendChild(document.createTextNode(' '));
    
                    // Agregar botón para eliminar tarea
                    const eliminarBtn = document.createElement('button');
                    eliminarBtn.textContent = 'Eliminar';
                    eliminarBtn.className = 'btn-eliminar'; // Agregamos una clase para estilizar el botón
                    eliminarBtn.addEventListener('click', function() {
                        eliminarTarea(index);
                    });
                    nuevaTarea.appendChild(eliminarBtn);
    
                    listaTareas.appendChild(nuevaTarea);
                });
            })
            .catch(error => console.error('Error al obtener las tareas:', error));
    }
    
    
    // Llamar a la función para mostrar las tareas al cargar la página
    actualizarListaTareas();
});
