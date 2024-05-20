document.addEventListener('DOMContentLoaded', function() {
    const formTarea = document.getElementById('form-tarea');
    const inputDescripcion = document.getElementById('descripcion');
    const inputAsignado = document.getElementById('asignado');
    const selectPrioridad = document.getElementById('prioridad');
    const inputTipoArea = document.getElementById('tipo_area');
    const inputLugar = document.getElementById('lugar');
    const inputFechaVencimiento = document.getElementById('fecha_vencimiento');
    const listaTareas = document.getElementById('lista-tareas');

    formTarea.addEventListener('submit', function(event) {
        event.preventDefault();
        const descripcion = inputDescripcion.value;
        const asignado = inputAsignado.value;
        const prioridad = selectPrioridad.value;
        const tipo_area = inputTipoArea.value;
        const lugar = inputLugar.value;
        const fecha_vencimiento = inputFechaVencimiento.value;
        if (descripcion.trim() !== '' && asignado.trim() !== '') {
            agregarTarea(descripcion, asignado, prioridad, tipo_area, lugar, fecha_vencimiento);
            inputDescripcion.value = '';
            inputAsignado.value = '';
            inputTipoArea.value = '';
            inputLugar.value = '';
            inputFechaVencimiento.value = '';
        }
    });

    function agregarTarea(descripcion, asignado, prioridad, tipo_area, lugar, fecha_vencimiento) {
        var tarea = {
            descripcion: descripcion,
            asignado: asignado,
            prioridad: prioridad,
            tipo_area: tipo_area,
            lugar: lugar,
            fecha_vencimiento: fecha_vencimiento
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

    function cambiarPrioridad(index) {
        const nuevaPrioridad = prompt('Ingrese la nueva prioridad:');
         {
            fetch(`http://127.0.0.1:5000/cambiar_prioridad/${index}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prioridad: nuevaPrioridad })
            })
            .then(response => response.json())
            .then(actualizarListaTareas)
            .catch(error => console.error('Error al cambiar prioridad:', error));
        }
    }
    
    
    function actualizarListaTareas() {
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then(data => {
                // Limpiar lista de tareas antes de agregar las actualizadas
                listaTareas.innerHTML = '';
    
                // Crear tabla para mostrar las tareas
                const tablaTareas = document.createElement('table');
                tablaTareas.style.borderCollapse = 'collapse'; // Estilo para colapsar los bordes de la tabla
                tablaTareas.style.border = '1px solid #ccc'; // Borde de la tabla
    
                // Crear fila para el título "Lista de Tareas"
                const filaTitulo = document.createElement('tr');
                const celdaTitulo = document.createElement('th');
                celdaTitulo.textContent = 'Lista de Tareas';
                celdaTitulo.style.textAlign = 'center'; // Alinear el texto al centro
                celdaTitulo.style.padding = '10px'; // Relleno de la celda
                celdaTitulo.setAttribute('colspan', '5'); // Colspan para abarcar todas las columnas
                filaTitulo.appendChild(celdaTitulo);
                tablaTareas.appendChild(filaTitulo);
    
                // Crear fila de encabezado de la tabla
                const filaEncabezado = document.createElement('tr');
                const encabezados = ['Descripción', 'Asignado a', 'Estado', 'Prioridad', 'Tipo de Área', 'Lugar', 'Fecha de Vencimiento', 'Fecha de Creación', 'Acciones'];
                encabezados.forEach(encabezado => {
                    const th = document.createElement('th');
                    th.textContent = encabezado;
                    th.style.border = '1px solid #ccc'; // Borde de las celdas del encabezado
                    th.style.padding = '8px'; // Relleno de las celdas del encabezado
                    filaEncabezado.appendChild(th);
                });
                tablaTareas.appendChild(filaEncabezado);
    
                // Agregar las tareas recibidas del servidor
                data.tareas.forEach((tarea, index) => {
                    // Crear fila para cada tarea
                    const filaTarea = document.createElement('tr');
                    filaTarea.style.border = '1px solid #ccc'; // Borde de las filas
    
                    // Añadir celdas con los datos de la tarea
                    const celdas = [tarea.descripcion, tarea.asignado, tarea.completada ? 'Completada' : 'Pendiente', tarea.prioridad, tarea.tipo_area, tarea.lugar, tarea.fecha_vencimiento, tarea.fecha_creacion];
                    celdas.forEach(celda => {
                        const td = document.createElement('td');
                        td.textContent = celda;
                        td.style.border = '1px solid #ccc'; // Borde de las celdas
                        td.style.padding = '8px'; // Relleno de las celdas
                        filaTarea.appendChild(td);
                    });
    
                    // Crear celda para los botones de acciones
                    const celdaAcciones = document.createElement('td');
                    celdaAcciones.style.border = '1px solid #ccc'; // Borde de las celdas
                    celdaAcciones.style.padding = '8px'; // Relleno de las celdas
    
                    // Agregar botón para marcar tarea como completada
                    const completarBtn = document.createElement('button');
                    completarBtn.textContent = 'Completar';
                    completarBtn.addEventListener('click', function() {
                        completarTarea(index);
                    });
                    celdaAcciones.appendChild(completarBtn);
    
                    // Agregar espacio entre botones
                    celdaAcciones.appendChild(document.createTextNode(' '));
    
                    // Agregar botón para eliminar tarea
                    const eliminarBtn = document.createElement('button');
                    eliminarBtn.textContent = 'Eliminar';
                    eliminarBtn.addEventListener('click', function() {
                        eliminarTarea(index);
                    });
                    celdaAcciones.appendChild(eliminarBtn);

                    // Agregar espacio entre botones
                    celdaAcciones.appendChild(document.createTextNode(' '));

                    // Crear botón para cambiar prioridad
                    const cambiarPrioridadBtn = document.createElement('button');
                    cambiarPrioridadBtn.textContent = 'Cambiar Prioridad';
                    cambiarPrioridadBtn.addEventListener('click', function() {
                        cambiarPrioridad(index);
                    });
                    celdaAcciones.appendChild(cambiarPrioridadBtn);
    
                    // Agregar la celda de acciones a la fila de tarea
                    filaTarea.appendChild(celdaAcciones);
    
                    // Agregar la fila a la tabla
                    tablaTareas.appendChild(filaTarea);
                });
    
                // Agregar la tabla al contenedor de la lista de tareas
                listaTareas.appendChild(tablaTareas);
            })
            .catch(error => console.error('Error al obtener las tareas:', error));
    }
    
    // Llamar a la función para mostrar las tareas al cargar la página
    actualizarListaTareas();
});
