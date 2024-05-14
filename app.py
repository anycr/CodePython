from flask import Flask, request, redirect, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Tarea:
    def __init__(self, descripcion, asignado=None, completada=False, prioridad=None):
        self.descripcion = descripcion
        self.asignado = asignado
        self.completada = completada
        self.prioridad = prioridad.capitalize() if prioridad else None

    def __str__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"{self.descripcion} - {estado}"

class GestorTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, descripcion, asignado=None, prioridad=None):
        try:
            tarea = Tarea(descripcion, asignado, False, prioridad)
            self.tareas.append(tarea)
        except Exception as e:
            print(f"Error al agregar tarea: {e}")

    def marcar_completada(self, posicion):
        try:
            tarea = self.tareas[posicion]
            tarea.completada = True
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")  

    def mostrar_tareas(self):
        tareas_dict = []
        for tarea in self.tareas:
            tarea_dict = {
                "descripcion": tarea.descripcion,
                "asignado": tarea.asignado,
                "prioridad": tarea.prioridad,
                "completada": tarea.completada
            }
            tareas_dict.append(tarea_dict)
        return tareas_dict

    def eliminar_tarea(self, posicion):
        try:
            del self.tareas[posicion]
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")

    def cambiar_prioridad(self, posicion, nueva_prioridad):
        try:
            tarea = self.tareas[posicion]
            tarea.prioridad = nueva_prioridad
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")

gestor = GestorTareas()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            descripcion = data.get('descripcion')
            asignado = data.get('asignado')
            prioridad = data.get('prioridad')
            gestor.agregar_tarea(descripcion, asignado, prioridad)
            print(f"Tarea agregada: {descripcion} (Asignado a: {asignado}) (Prioridad: {prioridad})")
            return jsonify(tareas=gestor.mostrar_tareas())
        else:
            descripcion = request.form['descripcion']
            asignado = request.form.get('asignado')
            prioridad = request.form.get('prioridad')
            gestor.agregar_tarea(descripcion, asignado, prioridad)
            print(f"Tarea agregada: {descripcion} (Asignado a: {asignado}) (Prioridad: {prioridad})")
            return jsonify(tareas=gestor.mostrar_tareas())
    return jsonify(tareas=gestor.mostrar_tareas())

@app.route('/completar/<int:posicion>', methods=['POST'])
def completar_tarea(posicion):
    gestor.marcar_completada(posicion)
    return jsonify(tareas=gestor.mostrar_tareas())

@app.route('/eliminar/<int:posicion>')
def eliminar_tarea(posicion):
    gestor.eliminar_tarea(posicion)
    return redirect('/')

@app.route('/cambiar_prioridad/<int:posicion>', methods=['POST'])
def cambiar_prioridad(posicion):
    if request.is_json:
        data = request.get_json()
        nueva_prioridad = data.get('prioridad')
        gestor.cambiar_prioridad(posicion, nueva_prioridad)
        return jsonify(tareas=gestor.mostrar_tareas())
    return 'Solicitud no válida', 400


@app.errorhandler(Exception)
def handle_error(error):
    print('Se produjo un error en el servidor:', error)
    return 'Se produjo un error en el servidor', 500

if __name__ == "__main__":
    app.run(debug=True)
