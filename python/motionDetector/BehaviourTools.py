import sys

import urllib
import urllib2
import unicodedata

import time
import datetime	as dt

from PS4Config import conf

class BehaviourTools():

	def __init__(self):
		self.last = dt.datetime(1900,1,1,0,0,0)


	###
	#	Send a SMS using the Free Mobile API (you must be client and enable the option in your space client)
	###
	def sendSMS(self,msg):
		diff = self.noRecentSend()
		if diff == True:
			#Format string
			msg = unicodedata.normalize('NFD', unicode(msg,'utf-8')).encode('ascii', 'ignore').replace(" ","%20")

			#Send request
			url = 'https://smsapi.free-mobile.fr/sendmsg?user='+conf.USERNAME+'&pass='+conf.TOKEN+'&msg='+msg
			req = urllib2.Request(url)
			response = urllib2.urlopen(req)
			print "Message sent"
		else:
			print "Message not sent (timer) %d/30 sec" % diff


	###
	#	Return true if a SMS hasn't been send in the last 30 seconds
	###
	def noRecentSend(self):
		current = dt.datetime.now()
		diff = (current-self.last).total_seconds()
		
		if diff > 30:
			self.last = current
			return True
		else:
			return diff
			