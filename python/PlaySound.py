import sys
import pygame

if len(sys.argv) > 1:
	pygame.init()
	son = pygame.mixer.Sound("../data/"+sys.argv[1]+".mp3")
	son.play()

	while pygame.mixer.get_busy():
		pass
else:
	print "Missing file name"
