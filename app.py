from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

class Tarea:
    def __init__(self, descripcion, asignado=None, completada=False, prioridad=None, tipo_area=None, lugar=None, fecha_vencimiento=None):
        self.descripcion = descripcion
        self.asignado = asignado
        self.completada = completada
        self.prioridad = prioridad.capitalize() if prioridad else None
        self.fecha_creacion = datetime.datetime.now()  # Fecha y hora de creación
        self.fecha_vencimiento = self.parse_fecha_vencimiento(fecha_vencimiento)
        self.tipo_area = tipo_area
        self.lugar = lugar   
        self.tipo_area = tipo_area
        self.lugar = lugar


    def __str__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"{self.descripcion} - {estado}"
   
    def parse_fecha_vencimiento(self, fecha_vencimiento):
        formatos = ["%Y-%m-%dT%H:%M", "%Y-%m-%d %H:%M:%S"]
        for formato in formatos:
            try:
                return datetime.datetime.strptime(fecha_vencimiento, formato)
            except ValueError:
                continue
        print(f"Error al parsear fecha_vencimiento: {fecha_vencimiento}")
        return None
    
class GestorTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, descripcion, asignado=None, prioridad=None, tipo_area=None, lugar=None, fecha_vencimiento=None):
        try:
            tarea = Tarea(descripcion, asignado, False, prioridad, tipo_area, lugar, fecha_vencimiento)
            self.tareas.append(tarea)
        except Exception as e:
            print(f"Error al agregar tarea: {e}")

    def marcar_completada(self, posicion):
        try:
            tarea = self.tareas[posicion]
            tarea.completada = True
        except IndexError:
            print("La posición no existe en la lista de tareas. Por favor, elija una posición válida.")  

    def ordenar_por_estado_y_prioridad(self):
        prioridad_orden = {'Alta': 1, 'Normal': 2, 'Baja': 3}
        self.tareas.sort(key=lambda tarea: (tarea.completada, prioridad_orden.get(tarea.prioridad, 4)))

    def mostrar_tareas(self):
        self.ordenar_por_estado_y_prioridad()  # Ordenar las tareas antes de mostrarlas
        tareas_dict = []
        for tarea in self.tareas:
            tarea_dict = {
                "descripcion": tarea.descripcion,
                "asignado": tarea.asignado,
                "prioridad": tarea.prioridad,
                "completada": tarea.completada,
                "fecha_creacion": tarea.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
                "fecha_vencimiento": tarea.fecha_vencimiento.strftime("%Y-%m-%d %H:%M:%S") if tarea.fecha_vencimiento else None,
                "tipo_area": tarea.tipo_area,
                "lugar": tarea.lugar
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
    
    def establecer_vencimiento(self, posicion, fecha_vencimiento):
        try:
            tarea = self.tareas[posicion]
            tarea.establecer_vencimiento(fecha_vencimiento)
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
            tipo_area = data.get('tipo_area')
            lugar = data.get('lugar')
            fecha_vencimiento = data.get('fecha_vencimiento')
            gestor.agregar_tarea(descripcion, asignado, prioridad, tipo_area, lugar, fecha_vencimiento)
            print(f"Tarea agregada: {descripcion} (Asignado a: {asignado}) (Prioridad: {prioridad}) (Tipo de área: {tipo_area}) (Lugar: {lugar}) (Fecha de vencimiento: {fecha_vencimiento})")
            return jsonify(tareas=gestor.mostrar_tareas())
        else:
            descripcion = request.form['descripcion']
            asignado = request.form.get('asignado')
            prioridad = request.form.get('prioridad')
            tipo_area = request.form.get('tipo_area')
            lugar = request.form.get('lugar')
            fecha_vencimiento = request.form.get('fecha_vencimiento')
            gestor.agregar_tarea(descripcion, asignado, prioridad, tipo_area, lugar, fecha_vencimiento)
            print(f"Tarea agregada: {descripcion} (Asignado a: {asignado}) (Prioridad: {prioridad}) (Tipo de área: {tipo_area}) (Lugar: {lugar}) (Fecha de vencimiento: {fecha_vencimiento})")
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

@app.route('/establecer_vencimiento/<int:posicion>', methods=['POST'])
def establecer_vencimiento(posicion):
    if request.is_json:
        data = request.get_json()
        fecha_vencimiento = data.get('fecha_vencimiento')
        gestor.establecer_vencimiento(posicion, fecha_vencimiento)
        return jsonify(tareas=gestor.mostrar_tareas())
    return 'Solicitud no válida', 400

@app.errorhandler(Exception)
def handle_error(error):
    print('Se produjo un error en el servidor:', error)
    return 'Se produjo un error en el servidor', 500

if __name__ == "__main__":
    app.run(debug=True)
