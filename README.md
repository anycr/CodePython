# CodePython-- Annya Corrales
 ## Caso práctico final:
    Código de un gestor de tareas para llevar las tareas de limpieza de un hotel:
								   
###  📌 Como se guardan los datos: 
	Los datos de las tareas están almacenados en la memoria del servidor Flask, específicamente dentro 
del objeto gestor,que persiste mientras la aplicación Flask esté en ejecución. Cada vez que se agrega, elimina o modifica una 
tarea, estos cambios se reflejan en la lista 'self.tareas' del objeto 'gestor'.

###  📌 Contenido:	
```
Backend: app.py
```
```
Front-end: HTML, CSS y JavaScript:  index.html
                                    styles.css
                                    scripts.js
```

###  📌 Para ejecutarlo:

✅ 1- Abre la terminal y ve a la carpeta del proyecto: 
```
cd /ruta/del/proyecto
```
✅ 2-Asegúrate de tener Flask instalado: pip install flask: 
```
pip install flask
```
✅ 3- Ejecuta el script:
```
python app.py
```
✅ 4- Si ves esto, significa que Flask está corriendo correctamente:
```
Running on http://127.0.0.1:5000/
```
✅ 5-Abre index.html en el navegador: 
```
Ahora abre (http://127.0.0.1:5500/index.html) en tu navegador y debería mostrar las tareas.
```
