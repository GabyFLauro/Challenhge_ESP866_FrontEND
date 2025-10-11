import threading
import serial
import json
import time
import logging
import mysql.connector
from flask import Flask, jsonify, request
from flask_socketio import SocketIO

# Config
SERIAL_PORT = '/dev/ttyUSB0'  # ajuste conforme seu SO
BAUD = 9600
DB_CFG = dict(host='localhost', user='root', password='senha', database='sensores_db')

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
logging.basicConfig(level=logging.INFO)


def insert_reading(data):
    conn = mysql.connector.connect(**DB_CFG)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO sensores 
        (pressao02_hx710b, temperatura_ds18b20, chave_fim_de_curso,
         vibracao_vib_x, vibracao_vib_y, vibracao_vib_z, velocidade_m_s)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data.get('pressao02_hx710b'),
        data.get('temperatura_ds18b20'),
        data.get('chave_fim_de_curso'),
        data.get('vibracao_vib_x'),
        data.get('vibracao_vib_y'),
        data.get('vibracao_vib_z'),
        data.get('velocidade_m_s')
    ))
    conn.commit()
    cur.close(); conn.close()


def serial_reader():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD, timeout=1)
        logging.info(f"Conectado à porta {SERIAL_PORT}")
    except Exception as e:
        logging.error(f"Erro ao abrir serial: {e}")
        return

    while True:
        try:
            line = ser.readline().decode(errors='ignore').strip()
            if not line or not line.startswith('{'):
                continue
            data = json.loads(line)

            insert_reading(data)
            socketio.emit('nova_leitura', data)
            logging.info(f"Nova leitura salva e emitida: {data}")

        except json.JSONDecodeError:
            continue
        except Exception as e:
            logging.error(f"Erro leitura serial: {e}")
            time.sleep(1)


@app.route('/api/sensores/recentes', methods=['GET'])
def get_recentes():
    limit = int(request.args.get('limit', 50))
    try:
        conn = mysql.connector.connect(**DB_CFG)
        cur = conn.cursor(dictionary=True)
        cur.execute(f"SELECT * FROM sensores ORDER BY data_hora DESC LIMIT %s", (limit,))
        rows = cur.fetchall()
        cur.close(); conn.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/sensores/metrics', methods=['GET'])
def get_metrics():
    try:
        conn = mysql.connector.connect(**DB_CFG)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM sensores")
        total = cur.fetchone()[0]
        # RPS aproximado: contar leituras das ultimas 60s
        cur.execute("SELECT COUNT(*) FROM sensores WHERE data_hora >= NOW() - INTERVAL 60 SECOND")
        recent = cur.fetchone()[0]
        cur.close(); conn.close()
        return jsonify({ 'total': total, 'rps': recent / 60.0 if recent is not None else 0 })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/readings/ingest', methods=['POST'])
def ingest():
    try:
        data = request.get_json(force=True)
        insert_reading(data)
        socketio.emit('nova_leitura', data)
        return jsonify(data), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/readings/<sensor_id>', methods=['GET'])
def get_readings_by_sensor(sensor_id):
    # pagination
    try:
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
    except Exception:
        limit = 50
        offset = 0

    # map sensor id to DB column
    mapping = {
        'p1': 'pressao02_hx710b',
        'p2': 'pressao02_hx710b',
        't1': 'temperatura_ds18b20',
        'l1': 'chave_fim_de_curso',
        'vx': 'vibracao_vib_x',
        'vy': 'vibracao_vib_y',
        'vz': 'vibracao_vib_z',
        'pressao02_hx710b': 'pressao02_hx710b',
        'temperatura_ds18b20': 'temperatura_ds18b20',
        'chave_fim_de_curso': 'chave_fim_de_curso',
        'vibracao_vib_x': 'vibracao_vib_x',
        'vibracao_vib_y': 'vibracao_vib_y',
        'vibracao_vib_z': 'vibracao_vib_z',
        'velocidade_m_s': 'velocidade_m_s'
    }

    col = mapping.get(sensor_id)
    if not col:
        return jsonify({'erro': 'sensor_id inválido'}), 400

    try:
        conn = mysql.connector.connect(**DB_CFG)
        cur = conn.cursor(dictionary=True)
        query = f"SELECT id, {col} as value, data_hora as timestamp FROM sensores ORDER BY data_hora DESC LIMIT %s OFFSET %s"
        cur.execute(query, (limit, offset))
        rows = cur.fetchall()
        cur.close(); conn.close()
        # normalize booleans/numbers
        for r in rows:
            # ensure proper types
            if isinstance(r.get('value'), (bytes,)):
                try:
                    r['value'] = float(r['value'])
                except Exception:
                    pass
        return jsonify(rows)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


if __name__ == '__main__':
    # Start serial reader thread
    threading.Thread(target=serial_reader, daemon=True).start()
    socketio.run(app, host='0.0.0.0', port=5000)
