from flask import *
from flask_socketio import SocketIO, send, emit
import json, sys
import os

from src import model

# Configuration du framework 
DEBUG = True

# Configuration de la Play Station Cat
SERVO_I2C_ADDRESS 	= 0x40		# Adresses I2C du controlleur de servo PCA9685 
SERVO_XAXIS_CHANNEL = 0 		# Canal pour l'axe de rotation X (Axe de monte et descente)
SERVO_YAXIS_CHANNEL = 1			# Canal pour l'axe de rotation Y (Axe de gauche et droite)
SERVO_LASERCACHE_CHANNEL = 2	# Canal pour le servo de cache du laser
SERVO_PWM_FREQ 		= 50 		# Frequence PWM pour les servos en Hertz (doit etre 50Hz)
SERVO_MIN 			= 150		# Rotation minimale pour les servos, doit etre -90 degre
SERVO_MAX 			= 550		# Rotation maximale pour les servos, doit etre 90 degre
SERVO_CENTER		= 450		# Valeur de centre pour les servos, doit etre 0 degre.

# Initialisation du framework
app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'pscat_sea'
socketio = SocketIO(app)

# Initialisation des servos et du laser
servos = None
param = None
if len(sys.argv) > 1:
	param = sys.argv[1]

if param == 'test':
	# Test du systeme hors environnement
	from src import modeltests
	servos = modeltests.TestServos()
elif param == None or param == 'start':
	# Mise en service en environnement
	from src import servos
	servos = servos.Servos(SERVO_I2C_ADDRESS, SERVO_XAXIS_CHANNEL, SERVO_YAXIS_CHANNEL, SERVO_LASERCACHE_CHANNEL, SERVO_PWM_FREQ)
elif param == None or param == 'stop':
	# Mise en hors-service
	# TODO
	param = None

model = model.LaserModel(servos, SERVO_MIN, SERVO_MAX, SERVO_CENTER)

# Vue principale pour le rendu de la page
@app.route('/')
def main():
	return render_template('main.html', model=model)


@socketio.on('set.servo.x', namespace='/api')
def setServoXAxis(message):
	model.setXAxis(message['xaxis'])

@socketio.on('set.servo.y', namespace='/api')
def setServoXAxis(message):
	model.setYAxis(meesage['yaxis'])

@socketio.on('set.servos', namespace='/api')
def setServoXAxis(message):
	model.setXAxis(message['xaxis'])
	model.setYAxis(message['yaxis'])
	emit('get_servos_evt', {'xaxis': model.getXAxis(), 'yaxis': model.getYAxis() }, broadcast=True)

@socketio.on('get.servos', namespace='/api')
def getServos():
	emit('get_servos_evt', {'xaxis': model.getXAxis(), 'yaxis': model.getYAxis() }, broadcast=True)

@socketio.on('get.videoconf', namespace='/api')
def getVideoConf():
	emit('get_videoconf_evt', {'ipadress': model.ipadress, 'port': model.port, 'uri': model.uri})

@socketio.on('playsound', namespace='/api')
def target(message):
	emit('played_sound', message['what'] + ".mp3", broadcast=True)
	os.system("python PlaySound.py " + message['what'])

@socketio.on('playrandomway', namespace='/api')
def target(message):
	model.playRandomWay(message['directions'])
	emit('get_servos_evt', {'xaxis': model.getXAxis(), 'yaxis': model.getYAxis() }, broadcast=True)


# Demarrage du framework

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
