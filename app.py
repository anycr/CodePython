from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import datetime
import pytz

app = Flask(__name__)
CORS(app)

class Tarea:
    id_counter = 0  # Contador de IDs únicos

    def __init__(self, descripcion, asignado=None, completada=False, prioridad=None, tipo_area=None, lugar=None, fecha_vencimiento=None):
        self.id = Tarea.id_counter  # Asignar ID único
        Tarea.id_counter += 1  # Incrementar contador
        self.descripcion = descripcion
        self.asignado = asignado
        self.completada = completada
        self.prioridad = prioridad.capitalize() if prioridad else None
        self.fecha_creacion = self.get_current_time_in_spain()  # Fecha y hora de creación con zona horaria UTC
        self.fecha_vencimiento = self.parse_fecha_vencimiento(fecha_vencimiento)
        self.tipo_area = tipo_area
        self.lugar = lugar 

    def __str__(self):
        estado = "Completada" if self.completada else "Pendiente"
        return f"{self.descripcion} - {estado}"
    
    def get_current_time_in_spain(self):
        tz_spain = pytz.timezone('Europe/Madrid')
        return datetime.datetime.now(tz_spain)
   
    def parse_fecha_vencimiento(self, fecha_vencimiento):
        if not fecha_vencimiento:
            return None
        formatos = ["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%d %H:%M:%S"]
        tz_spain = pytz.timezone('Europe/Madrid')
        for formato in formatos:
            try:
                if formato == "%Y-%m-%dT%H:%M:%S.%fZ":
                    fecha_v = datetime.datetime.fromisoformat(fecha_vencimiento.replace('Z', '+00:00'))
                else:
                    fecha_v = datetime.datetime.strptime(fecha_vencimiento, formato).replace(tzinfo=datetime.timezone.utc)
                fecha_v = fecha_v.astimezone(tz_spain)  # Convertir a la zona horaria de España
                if fecha_v < self.fecha_creacion:
                    raise ValueError("La fecha de vencimiento no puede ser anterior a la fecha de creación")
                return fecha_v
            except ValueError as e:
                print(f"Error al parsear fecha_vencimiento: {e}")
                continue
        return None
    
    def establecer_vencimiento(self, fecha_vencimiento):
        nueva_fecha_vencimiento = self.parse_fecha_vencimiento(fecha_vencimiento)
        if nueva_fecha_vencimiento:
            self.fecha_vencimiento = nueva_fecha_vencimiento
        else:
            raise ValueError("Fecha de vencimiento inválida")
        
    def esta_vencida(self):
        if self.fecha_vencimiento:
            return self.fecha_vencimiento < datetime.datetime.now(self.fecha_vencimiento.tzinfo)      
        return False
    
class GestorTareas:
    def __init__(self):
        self.tareas = []

    def agregar_tarea(self, descripcion, asignado=None, prioridad=None, tipo_area=None, lugar=None, fecha_vencimiento=None):
        try:
            tarea = Tarea(descripcion, asignado, False, prioridad, tipo_area, lugar, fecha_vencimiento)
            self.tareas.append(tarea)
        except Exception as e:
            print(f"Error al agregar tarea: {e}")

    def marcar_completada(self, id):
        try:
            tarea = next(tarea for tarea in self.tareas if tarea.id == id)
            # Verificar si la tarea está vencida antes de marcarla como completada
            if tarea.fecha_vencimiento and tarea.fecha_vencimiento < datetime.datetime.now(tarea.fecha_vencimiento.tzinfo):
                raise ValueError("La tarea está vencida y no se puede modificar")
            tarea.completada = True
        except StopIteration:
            print("El ID no existe en la lista de tareas. Por favor, elija un ID válido.")
        except ValueError as e:
            print(e)
    
    def contar_tareas(self):
        total_pendientes = sum(1 for tarea in self.tareas if not tarea.completada and not tarea.esta_vencida())
        total_completadas = sum(1 for tarea in self.tareas if tarea.completada)
        total_vencidas = sum(1 for tarea in self.tareas if tarea.esta_vencida() and not tarea.completada)
        return total_pendientes, total_completadas, total_vencidas

    def ordenar_por_estado_y_prioridad(self):
        prioridad_orden = {'Alta': 1, 'Normal': 2, 'Baja': 3}
        self.tareas.sort(key=lambda tarea: (tarea.completada, prioridad_orden.get(tarea.prioridad, 4)))

    def mostrar_tareas(self):
        self.ordenar_por_estado_y_prioridad()  # Ordenar las tareas antes de mostrarlas
        tareas_pendientes = []
        tareas_completadas = []

        for index, tarea in enumerate(self.tareas, start=1):
            tarea_dict = {
                "id": tarea.id,
                "numero": index,
                "descripcion": tarea.descripcion,
                "asignado": tarea.asignado,
                "prioridad": tarea.prioridad,
                "completada": tarea.completada,
                "fecha_creacion": tarea.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S %Z%z"),
                "fecha_vencimiento": tarea.fecha_vencimiento.strftime("%Y-%m-%d %H:%M:%S %Z%z") if tarea.fecha_vencimiento else None,
                "tipo_area": tarea.tipo_area,
                "lugar": tarea.lugar,
                "vencida": tarea.esta_vencida()
            }
            if tarea.completada:
                tareas_completadas.append(tarea_dict)
            else:
                tareas_pendientes.append(tarea_dict)

        # Numerar tareas pendientes y completadas por separado
        for i, tarea in enumerate(tareas_pendientes, start=1):
            tarea['numero'] = i

        for i, tarea in enumerate(tareas_completadas, start=1):
            tarea['numero'] = i

        # Obtener contadores de tareas
        total_pendientes, total_completadas, total_vencidas = self.contar_tareas()

        return {"pendientes": tareas_pendientes, "completadas": tareas_completadas, 
                "total_pendientes": total_pendientes, "total_completadas": total_completadas,
                "total_vencidas": total_vencidas}

    def eliminar_tarea(self, id):
        try:
            tarea = next(tarea for tarea in self.tareas if tarea.id == id)
            self.tareas.remove(tarea)
        except StopIteration:
            print("El ID no existe en la lista de tareas. Por favor, elija un ID válido.")

    def cambiar_prioridad(self, id, nueva_prioridad):
        try:
            tarea = next(tarea for tarea in self.tareas if tarea.id == id)
            # Verificar si la tarea está vencida antes de cambiar la prioridad
            if tarea.fecha_vencimiento and tarea.fecha_vencimiento < datetime.datetime.now(tarea.fecha_vencimiento.tzinfo):
                raise ValueError("La tarea está vencida y no se puede modificar")
            tarea.prioridad = nueva_prioridad
        except StopIteration:
            print("El ID no existe en la lista de tareas. Por favor, elija un ID válido.")
        except ValueError as e:
            print(e)
    
    def establecer_vencimiento(self, id, fecha_vencimiento):
        try:
            tarea = next(tarea for tarea in self.tareas if tarea.id == id)
            # Verificar si la tarea está vencida antes de establecer una nueva fecha de vencimiento
            if tarea.fecha_vencimiento and tarea.fecha_vencimiento < datetime.datetime.now(tarea.fecha_vencimiento.tzinfo):
                raise ValueError("La tarea está vencida y no se puede modificar")
            tarea.establecer_vencimiento(fecha_vencimiento)
        except StopIteration:
            print("El ID no existe en la lista de tareas. Por favor, elija un ID válido.")
        except ValueError as e:
            print(e)

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


@app.route('/completar/<int:id>', methods=['POST'])
def completar_tarea(id):
    try:
        gestor.marcar_completada(id)
    except ValueError as e:
        return str(e), 400
    return jsonify(tareas=gestor.mostrar_tareas())

@app.route('/eliminar/<int:id>')
def eliminar_tarea(id):
    try:
        gestor.eliminar_tarea(id)
    except ValueError as e:
        return str(e), 400
    return redirect('/')

@app.route('/cambiar_prioridad/<int:id>', methods=['POST'])
def cambiar_prioridad(id):
    if request.is_json:
        data = request.get_json()
        nueva_prioridad = data.get('prioridad')
        gestor.cambiar_prioridad(id, nueva_prioridad)
        return jsonify(tareas=gestor.mostrar_tareas())
    return 'Solicitud no válida', 400

@app.route('/establecer_vencimiento/<int:id>', methods=['POST'])
def establecer_vencimiento(id):
    if request.is_json:
        data = request.get_json()
        fecha_vencimiento = data.get('fecha_vencimiento')
        try:
            gestor.establecer_vencimiento(id, fecha_vencimiento)
        except ValueError as e:
            return str(e), 400
        return jsonify(tareas=gestor.mostrar_tareas())
    return 'Solicitud no válida', 400


@app.errorhandler(Exception)
def handle_error(error):
    print('Se produjo un error en el servidor:', error)
    return 'Se produjo un error en el servidor', 500

if __name__ == "__main__":
    app.run(debug=True)
