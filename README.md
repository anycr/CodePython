# CodePython-- Annya Corrales
 ## Caso práctico final:
Código de un gestor de tareas para llevar las tareas de limpieza de un hotel:
								   
###  📌 Como se guardan los datos: 
Los datos de las tareas están almacenados en la memoria del servidor Flask, específicamente dentro del objeto gestor,que persiste mientras la aplicación Flask esté en ejecución. Cada vez que se agrega, elimina o modifica una tarea, estos cambios se reflejan en la lista 'self.tareas' del objeto 'gestor'.
 
###  📌 ️ Tecnologías Utilizadas:
```
Python 3.11
Flask
HTML
CSS
JavaScript
```
###  📌 Contenido:
```

  📂 CodePython
  ┣ 📂 Evidencias
  ┃ ┣ 📄 EstructuraJsonFinal.json
  ┃ ┣ 📄 EvidenciaJson1.PNG
  ┃ ┣ 📄 EvidenciaJson2.PNG
  ┃ ┣ 📄 FuncionalidadGestor.PNG
  ┃ ┗ 📄 Inicio.PNG
  ┣ 📄 app.py --> Codigo python del gestor de tarea (Backend)
  ┣ 📄 index.html --> Estructura básica de la página
  ┣ 📄 scripts.js --> Clases y objetos en JavaScript de manera similar a como se encuentra en Python
  ┗ 📄 styles.css --> Aspecto visual de la aplicación
```

###  📌 Para ejecutarlo:
### Nota: tener instalado Python
✅ 1. Descargar este repositorio

Usa el comando cd para moverte a la carpeta en tu computadora donde quieres que se descargue el repositorio:
```
cd C:\Users\tu_usuario\Documents\Proyectos
# o en macOS/Linux:
cd ~/Documents/Proyectos
```
Ejecuta el comando git clone: Pega la URL que copiaste después del comando:
```
git clone https://github.com/nombre-usuario/nombre-repositorio.git
```
✅ 2. Abre la terminal y ve a la carpeta del proyecto:
```
cd /ruta/del/proyecto
```
✅ 3-Asegúrate de tener Flask instalado: pip install flask: 
```
pip install flask
```
✅ 4- Ejecuta el script:
```
python app.py
```
✅ 5- Si ves esto, significa que Flask está corriendo correctamente:
```
Running on http://127.0.0.1:5000/
```
✅ 6-Abre index.html en el navegador: 
```
Ahora abre (http://127.0.0.1:5500/index.html) en tu navegador y debería mostrar las tareas.
```
