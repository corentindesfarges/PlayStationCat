from PWM_Servo_Driver import PWM

class Servos(object):
	def __init__(self, i2cAddress, xAxisChannel, yAxisChannel, cacheLaserChannel, pwmFreqHz):
		self.pwm = PWM(i2cAddress, debug=True)
		self.pwm.setPWMFreq(pwmFreqHz)
		self.xaxis = xAxisChannel
		self.yaxis = yAxisChannel
		self.laserCache = cacheLaserChannel

	def setXAxis(self, value):
		self.pwm.setPWM(self.xaxis, 0, value)

	def setYAxis(self, value):
		self.pwm.setPWM(self.yaxis, 0, value)

	def setCache(self, value):
		self.pwm.setPWM(self.laserCache, 0, value)