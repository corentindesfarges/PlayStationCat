import cv2
import urllib
import numpy

from BehaviourTools import BehaviourTools

from PS4Config import conf

class VideoTools():

	somme = 0
	nbImages = 0
	moyenne = 0
	test = 0
	bt = BehaviourTools()
	

	def __init__(self):
		self.bytesTable=''
		self.stream = urllib.urlopen(conf.URL_CAM)
		self.start()


	###
	#	Start the motion detector
	###
	def start(self):
		print "Starting..."
		
		#initialize frames
		im0 = self.getFrame()
		im1 = im0
		im2 = im0

		while True:
			diff = self.detectMotion(im0, im1, im2)
			cv2.imshow("diff",diff)

			#read next frame
			im0 = im1
			im1 = im2
			im2 = self.getFrame()
	

	###
	#	Detect if the cat is moving in the playground and call the sms sender
	###
	def detectMotion(self, im0, im1, im2):
		diff = self.getDiff(im0,im1,im2)
		nbWhite = cv2.countNonZero(diff)
		
		if self.nbImages == 50:
			print "Detection initialized"
		elif self.nbImages == 500:
			self.nbImages = 0
			self.somme = 0
		
		if self.nbImages > 50 and abs(nbWhite-self.moyenne)>self.moyenne*0.05:
			self.test = self.test + 1
			if self.test == 5:
				self.bt.sendSMS("A cat has been detected!")
		else:
			self.test = 0
			self.somme = self.somme + nbWhite
			self.nbImages = self.nbImages + 1
			self.moyenne = self.somme / self.nbImages

		return diff


	###
	#	Get a grayscale frame from the video stream from the IP Camera
	###
	def getFrame(self):
		while True:
			self.bytesTable+=self.stream.read(16384)
			a = self.bytesTable.find("\xff\xd8")
			b = self.bytesTable.find("\xff\xd9")
			if a!=-1 and b!=-1:
				jpg = self.bytesTable[a:b+2]
				self.bytesTable = self.bytesTable[b+2:]
				frame = cv2.imdecode(numpy.fromstring(jpg, dtype=numpy.uint8),cv2.CV_LOAD_IMAGE_GRAYSCALE)
				(thresh, frame) = cv2.threshold(frame,127,255,cv2.THRESH_BINARY)
				frame = cv2.GaussianBlur(frame,(11,11),0)
				return frame
			if cv2.waitKey(10)==27:
				exit(0)


	###
	#	Return a diff between the 3 last frames
	###
	def getDiff(self,im0,im1,im2):
		diff2_1 = cv2.absdiff(im2, im1)
		diff1_0 = cv2.absdiff(im1, im0)
		diff = cv2.bitwise_and(diff2_1,diff1_0)

		return diff


main = VideoTools()
main.start()