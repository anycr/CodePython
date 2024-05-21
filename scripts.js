document.addEventListener('DOMContentLoaded', function() {
    const formTarea = document.getElementById('form-tarea');
    const inputDescripcion = document.getElementById('descripcion');
    const inputAsignado = document.getElementById('asignado');
    const selectPrioridad = document.getElementById('prioridad');
    const inputTipoArea = document.getElementById('tipo_area');
    const lugarContainer = document.getElementById('lugar-container'); // Contenedor del select
    const inputFechaVencimiento = document.getElementById('fecha_vencimiento');
    const listaTareas = document.getElementById('lista-tareas');

    formTarea.addEventListener('submit', function(event) {
        event.preventDefault();
        const descripcion = inputDescripcion.value;
        const asignado = inputAsignado.value;
        const prioridad = selectPrioridad.value;
        const tipo_area = inputTipoArea.value;
        const lugar = document.getElementById('lugar').value; // Actualizado para obtener el valor del select generado dinámicamente
        const fecha_vencimiento = inputFechaVencimiento.value;
        if (descripcion.trim() !== '' && asignado.trim() !== '') {
            agregarTarea(descripcion, asignado, prioridad, tipo_area, lugar, fecha_vencimiento);
            inputDescripcion.value = '';
            inputAsignado.value = '';
            inputTipoArea.value = '';
            lugarContainer.innerHTML = ''; // Limpiar el contenedor del lugar
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
        const nuevaPrioridad = prompt('Ingrese la nueva prioridad (Alta, Normal, Baja):');
        if (nuevaPrioridad) {
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
                celdaTitulo.setAttribute('colspan', '9'); // Colspan para abarcar todas las columnas
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
                    if (!tarea.completada) {
                        const completarBtn = document.createElement('button');
                        completarBtn.textContent = 'Completar';
                        completarBtn.onclick = () => completarTarea(index);
                        completarBtn.style.marginRight = '5px'; // Espacio entre botones
                        celdaAcciones.appendChild(completarBtn);
                    }
    
                    // Agregar botón para eliminar la tarea
                    const eliminarBtn = document.createElement('button');
                    eliminarBtn.textContent = 'Eliminar';
                    eliminarBtn.onclick = () => eliminarTarea(index);
                    eliminarBtn.style.marginRight = '5px'; // Espacio entre botones
                    celdaAcciones.appendChild(eliminarBtn);
    
                    // Agregar botón para cambiar la prioridad de la tarea
                    const cambiarPrioridadBtn = document.createElement('button');
                    cambiarPrioridadBtn.textContent = 'Cambiar Prioridad';
                    cambiarPrioridadBtn.onclick = () => cambiarPrioridad(index);
                    celdaAcciones.appendChild(cambiarPrioridadBtn);
    
                    // Añadir celda de acciones a la fila de la tarea
                    filaTarea.appendChild(celdaAcciones);
    
                    // Añadir la fila de la tarea a la tabla
                    tablaTareas.appendChild(filaTarea);
                });
    
                // Agregar la tabla a la lista de tareas
                listaTareas.appendChild(tablaTareas);
            })
            .catch(error => console.error('Error al obtener la lista de tareas:', error));
    }
    
    // Llamar a la función para mostrar las tareas al cargar la página
    actualizarListaTareas();

    // Función para crear y mostrar la lista de selección de lugares
    function mostrarListaSeleccion(opciones) {
        // Limpiamos el contenedor
        lugarContainer.innerHTML = '';

        // Creamos el elemento select
        const selectLugar = document.createElement('select');
        selectLugar.id = 'lugar';
        selectLugar.name = 'lugar';

        // Añadimos las opciones al select
        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectLugar.appendChild(option);
        });

        // Añadimos el select al contenedor
        lugarContainer.appendChild(selectLugar);
    }

    // Evento de cambio en el campo "Tipo de Área"
    inputTipoArea.addEventListener('change', function() {
        const tipoAreaSeleccionado = inputTipoArea.value;
        let opcionesLugar = [];

        if (tipoAreaSeleccionado === 'Habitaciones') {
            // Si se selecciona "Habitaciones", generamos opciones numeradas del 001 al 100
            for (let i = 1; i <= 100; i++) {
                const numero = i.toString().padStart(3, '0');
                opcionesLugar.push({ value: numero, text: numero });
            }
        } else if (tipoAreaSeleccionado === 'Espacios') {
            // Si se selecciona "Espacios", definimos las opciones de lugares
            opcionesLugar = [
                { value: 'Vestíbulo/Recepción', text: 'Vestíbulo/Recepción' },
                { value: 'Piscina', text: 'Piscina' },
                { value: 'Gimnasio', text: 'Gimnasio' },
                { value: 'Restaurante', text: 'Restaurante' },
                { value: 'Bar', text: 'Bar' },
                { value: 'Spa', text: 'Spa' },
                { value: 'Salas_de_reuniones', text: 'Salas de reuniones' },
                { value: 'Aseos', text: 'Baños' }
                // Puedes agregar más opciones según sea necesario
            ];
        }

        // Mostramos la lista de selección con las opciones correspondientes
        mostrarListaSeleccion(opcionesLugar);
    });

    // Llamamos al evento de cambio una vez al cargar la página para asegurarnos de que se muestre la lista de selección inicialmente
    inputTipoArea.dispatchEvent(new Event('change'));

    data.tareas.forEach((tarea, index) => {
        // Crear fila para cada tarea
        const filaTarea = document.createElement('tr');
        filaTarea.style.border = '1px solid #ccc'; // Borde de las filas
        
        if (tarea.completada) {
            filaTarea.classList.add('completed'); // Agregar clase si la tarea está completada
        }
    
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
        if (!tarea.completada) {
            const completarBtn = document.createElement('button');
            completarBtn.textContent = 'Completar';
            completarBtn.onclick = () => completarTarea(index);
            completarBtn.style.marginRight = '5px'; // Espacio entre botones
            celdaAcciones.appendChild(completarBtn);
        }
    
        // Agregar botón para eliminar la tarea
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarTarea(index);
        eliminarBtn.style.marginRight = '5px'; // Espacio entre botones
        celdaAcciones.appendChild(eliminarBtn);
    
        // Agregar botón para cambiar la prioridad de la tarea
        const cambiarPrioridadBtn = document.createElement('button');
        cambiarPrioridadBtn.textContent = 'Cambiar Prioridad';
        cambiarPrioridadBtn.onclick = () => cambiarPrioridad(index);
        celdaAcciones.appendChild(cambiarPrioridadBtn);
    
        // Añadir celda de acciones a la fila de la tarea
        filaTarea.appendChild(celdaAcciones);
    
        // Añadir la fila de la tarea a la tabla
        tablaTareas.appendChild(filaTarea);
    });

});
