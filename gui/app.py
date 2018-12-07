from flask import Flask, render_template, request, jsonify
import RPi.GPIO as GPIO
from time import sleep
import subprocess

#Inizializzazione GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT, initial=0)		#port 17, collegata a transistor per accensione luce LED USB
GPIO.setup(19, GPIO.OUT, initial=0)		#port 19, collegata a ponte H per ruota dx avanti
GPIO.setup(26, GPIO.OUT, initial=0)		#port 26, collegata a ponte H per ruota dx indietro
GPIO.setup(20, GPIO.OUT, initial=0)		#port 20, collegata a ponte H per ruota sx avanti
GPIO.setup(21, GPIO.OUT, initial=0)		#port 21, collegata a ponte H per ruota sx indietro

#creazione oggetti PWM
ava_dx = GPIO.PWM(19, 60)     #port 19, avanti motore dx, 60 Hz
ind_dx = GPIO.PWM(26, 60)     #port 26, indietro motore dx, 60 Hz
ava_sx = GPIO.PWM(20, 60)     #port 20, avanti motore sx, 60 Hz
ind_sx = GPIO.PWM(21, 60)     #port 21, indietro motore sx, 60 Hz

app = Flask(__name__, static_url_path='/static')		#definisce la path della sottocartella \static

@app.route('/')
def index():
   	return render_template("index.html")

@app.route('/avanti')
def avanti():
	velocita = request.args.get('velocita', default = '50', type = float)
	go_avanti(velocita)
	return "ok"

@app.route('/indietro')
def indietro():
	velocita = request.args.get('velocita', default = '50', type = float)
	go_indietro(velocita)
	return "ok"

@app.route('/girasx')
def girasx():
	go_girasx()
	return "ok"

@app.route('/giradx')
def giradx():
	go_giradx()
	return "ok"

@app.route('/stop')
def stop():
	go_stop()
	return "ok"

@app.route('/scattafoto')
def scattafoto():
	go_scattafoto()
	return "foto fatta"

@app.route('/light')
def light():
	stato = go_light()
	return stato

@app.route('/sysinfo')
def sysinfo():
	# Acquisisco la data
	d = subprocess.check_output(["date"], shell=True)
	data = d.decode('utf-8')
	# Acquisisco la temperatura della CPU
	t = subprocess.check_output(["vcgencmd measure_temp"], shell=True)
	temp = t.decode('utf-8')
	# Acquisisco la versione OS
	v = subprocess.check_output(["cat /etc/os-release | egrep 'PRETTY_NAME'"], shell=True)
	ver = v.decode('utf-8')
	# Acquisisco i dati della WiFi
	w1 = subprocess.check_output(["iwgetid"], shell=True)
	essid = w1.decode('utf-8')
	w2 = subprocess.check_output(["cat /proc/net/wireless | egrep wlan0"], shell=True)
	signal = w2.decode('utf-8')
	# Acquisisco lo spazio utilizzato sul disco
	d = subprocess.check_output(["df / --output=pcent"], shell=True)
	disk = d.decode('utf-8')
	# Scrivo l'array
	info = [data[:-1], temp[5:-1], ver[12:-1], essid[16:-1], signal[14:17]+"%", signal[20:23]+"%", disk[5:9]]
	return jsonify(info)
		
def go_avanti(velocita):
	ava_dx.start(velocita)
	ava_sx.start(velocita)

def go_indietro(velocita):
    ind_dx.start(velocita)
    ind_sx.start(velocita)

def go_girasx():
	ava_dx.start(60)
	ind_sx.start(60)

def go_giradx():
	ava_sx.start(60)
	ind_dx.start(60)

def go_stop():
	ava_dx.stop()
	ava_sx.stop()
	ind_dx.stop()
	ind_sx.stop()

def go_light():
	stato = GPIO.input(17)
	if stato == 0:
		GPIO.output(17, 1)
		light = "on"
	else:
		GPIO.output(17, 0)
		light = "off"
	return light
	

if __name__ == '__main__':
   app.run(host = "0.0.0.0", port = 2802, debug = True)

GPIO.cleanup()
