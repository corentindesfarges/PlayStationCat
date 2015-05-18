import json
import numpy as np
import time
from random import randint

class LaserModel(object):
    def __init__(self, servos, servoMin, servoMax, servoCenter):
        self.servos = servos
        self.servoMin = servoMin
        self.servoMax = servoMax
        self.servoCenter = servoCenter
        self.setXAxis(servoCenter)
        self.setYAxis(servoCenter)
        self.ipadress = None
        self.port = None
        self.uri = None
        self.confVideoFile = 'confVideo.json'
        self._loadVideoConfiguration()

    def setXAxis(self, value):
        self.xAxisValue = self._validateAxis(value)
        self.servos.setXAxis(self.xAxisValue)

    def getXAxis(self):
        return self.xAxisValue

    def setYAxis(self, value):
        self.yAxisValue = self._validateAxis(value)
        self.servos.setYAxis(self.yAxisValue)

    def getYAxis(self):
        return self.yAxisValue

    def setCache(self, on):
        self.cacheValue = self._validateAxis(servoMin if on else servoMax);
        self.servos.setCache(self.cacheValue);

    def getServoMax(self):
        return self.servoMax

    def getServoMin(self):
        return self.servoMin

    def getServoCenter(self):
        return self.servoCenter

    def getVideoConfiguration(self):
        return self.ipadress, self.port, self.uri

    def setVideoConf(self, ipadress, port, uri):
        self.ipadress = ipadress
        self.port = port
        self.uri = uri
        self._saveVideoConfiguration()

    def playRandomWay(self, directions):
        """Deplace le laser suivant des directions donnees. Si aucune definie, un chemin aleatoire est cree."""
        if len(directions) == 0:
            """Creer un chemin aleatoire si aucunes directions n'est renseignee."""

            nb = randint(7, 15)
            while nb:
                r = randint(1, 4)
                if r == 1:
                    directions.append('r')
                elif r == 2:
                    directions.append('u')
                elif r == 3:
                    directions.append('l')
                elif r == 4:
                    directions.append('d')
                nb = nb - 1
            
        for direction in directions:
            if direction == 'r':
                try:
                    self.setXAxis(self._validateAxis(self.getXAxis() - 10))
                except ValueError:
                    print ''
            elif direction == 'u':
                try:
                    self.setYAxis(self._validateAxis(self.getYAxis() - 10))
                except ValueError:
                    print ''
            elif direction == 'l':
                try:
                    self.setXAxis(self._validateAxis(self.getXAxis() + 10))
                except ValueError:
                    print ''
            elif direction == 'd':
                try:
                    self.setYAxis(self._validateAxis(self.getYAxis() + 10))
                except ValueError:
                    print ''
            time.sleep(0.5)


    def _validateAxis(self, value):
        """Valide si les valeurs de servo sont dans la fourchette autorisee."""
        try:
            v = int(value)
            if v < self.servoMin or v > self.servoMax:
                raise ValueError()
            return v
        except:
            raise ValueError('Invalid value! Must be a value between %i and %i.' % (self.servoMin, self.servoMax))

    def _loadVideoConfiguration(self):
        """Charge les donnees de configuration video depuis le JSON."""
        try:
            with open(self.confVideoFile, 'r') as file:
                cal = json.loads(file.read())
                self.ipadress = cal['ipadress']
                self.port = cal['port']
                self.uri = cal['uri']
        except IOError:
            print('Le fichier de configuration n\'est pas trouvable')
            pass

    def _saveVideoConfiguration(self):
        """Enregistre les donnees de configuration video dans le JSON."""
        with open(self.confVideoFile, 'w+') as file:
            file.write(json.dumps({'ipadress': self.ipadress, 'port': self.port, 'uri': self.uri }))
