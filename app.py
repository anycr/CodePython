from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)  # Se crea una instancia de Flask

class Tarea:
    def __init__(self, descripcion, completada=False):
        # Constructor de la clase Tarea
        self.descripcion = descripcion  # Se establece la descripción de la tarea
        self.completada = completada    # Se establece el estado de completado de la tarea, por defecto False

    def __str__(self):
        # Método para representar la tarea como una cadena de texto
        estado = "Completada" if self.completada else "Pendiente"  # Determina el estado de la tarea
        return f"{self.descripcion} - {estado}"  # Retorna la descripción de la tarea y su estado

class GestorTareas:
    def __init__(self):
        self.tareas = []  # Se inicializa una lista para almacenar las tareas

    def agregar_tarea(self, descripcion):
        # Método para agregar una nueva tarea
        tarea = Tarea(descripcion)  # Crea una nueva instancia de la clase Tarea
        self.tareas.append(tarea)   # Agrega la tarea a la lista de tareas

    def marcar_completada(self, posicion):
        # Método para marcar una tarea como completada
        try:
            tarea = self.tareas[posicion]  # Obtiene la tarea en la posición indicada
            tarea.completada = True         # Marca la tarea como completada
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")  

    def mostrar_tareas(self):
        # Método para mostrar todas las tareas
        if not self.tareas:  # Si no hay tareas en la lista
            print("No hay ninguna tarea.")
        else:
            for i, tarea in enumerate(self.tareas):
                print(f"{i}: {tarea}")  # Imprime la posición y la descripción de cada tarea

    def eliminar_tarea(self, posicion):
        # Método para eliminar una tarea
        try:
            del self.tareas[posicion]  # Elimina la tarea en la posición indicada
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")  

gestor = GestorTareas()  # Se crea una instancia de la clase GestorTareas

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        descripcion = request.form['descripcion']  # Se obtiene la descripción de la nueva tarea desde el formulario
        gestor.agregar_tarea(descripcion)  # Se agrega una nueva tarea al gestor de tareas
    return render_template('index.html', tareas=gestor.mostrar_tareas())  # Se renderiza la plantilla index.html con las tareas

@app.route('/completar/<int:posicion>')
def completar_tarea(posicion):
    gestor.marcar_completada(posicion)  # Se marca la tarea en la posición especificada como completada
    return redirect(url_for('index'))  # Se redirige a la página principal

@app.route('/eliminar/<int:posicion>')
def eliminar_tarea(posicion):
    gestor.eliminar_tarea(posicion)  # Se elimina la tarea en la posición especificada
    return redirect(url_for('index'))  # Se redirige a la página principal