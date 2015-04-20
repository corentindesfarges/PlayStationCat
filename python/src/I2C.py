#!/usr/bin/python

import smbus

# ===========================================================================
# I2C Class
# ===========================================================================

class I2C :

  @staticmethod
  def getPiRevision():
    "Recupere la version du Raspberry Pi"
    try:
      with open('/proc/cpuinfo','r') as f:
        for line in f:
          if line.startswith('Revision'):
            return 1 if line.rstrip()[-1] in ['1','2'] else 2
    except:
      return 0

  @staticmethod
  def getPiI2CBusNumber():
    "Recupere le numero du bus I2C ex: /dev/i2c-N"
    return 1 if I2C.getPiRevision() > 1 else 0
 
  def __init__(self, address, busnum=-1, debug=False):
    self.address = address
    # self.bus = smbus.SMBus(0); # Force I2C0 (early 256MB Pi's)
    # self.bus = smbus.SMBus(1); # Force I2C1 (512MB Pi's)
    self.bus = smbus.SMBus(
      busnum if busnum >= 0 else I2C.getPiI2CBusNumber())
    self.debug = debug

  def reverseByteOrder(self, data):
    "Inverse le bit de la valeur d'un entier (16 bits) ou d'un long (32 bits)"
    byteCount = len(hex(data)[2:].replace('L','')[::2])
    val       = 0
    for i in range(byteCount):
      val    = (val << 8) | (data & 0xff)
      data >>= 8
    return val

  def errMsg(self):
    print "Releve l'erreur 0x%02X: Verifiez l'adresse I2C" % self.address
    return -1

  def write8(self, reg, value):
    "Ecris une valeur de 8 bit dans une paire registre/adresse specifique"
    try:
      self.bus.write_byte_data(self.address, reg, value)
      if self.debug:
        print "I2C: Ecriture 0x%02X vers le registre 0x%02X" % (value, reg)
    except IOError, err:
      return self.errMsg()

  def write16(self, reg, value):
    "Ecris une valeur de 16 bit dans une paire registre/adresse specifique"
    try:
      self.bus.write_word_data(self.address, reg, value)
      if self.debug:
        print ("I2C: Ecriture 0x%02X vers le registre 0x%02X,0x%02X" %
         (value, reg, reg+1))
    except IOError, err:
      return self.errMsg()

  def writeList(self, reg, list):
    "Ecris un tableau de bits en utilisant le format I2C"
    try:
      if self.debug:
        print "I2C: Ecriture de la liste list vers le registre 0x%02X:" % reg
        print list
      self.bus.write_i2c_block_data(self.address, reg, list)
    except IOError, err:
      return self.errMsg()

  def readList(self, reg, length):
    "Lis une liste de bits depuis le peripherique I2C"
    try:
      results = self.bus.read_i2c_block_data(self.address, reg, length)
      if self.debug:
        print ("I2C: Peripherique 0x%02X retourne une liste depuis le registre 0x%02X" %
         (self.address, reg))
        print results
      return results
    except IOError, err:
      return self.errMsg()

  def readU8(self, reg):
    "Lis un bit non signe depuis un peripherique I2C"
    try:
      result = self.bus.read_byte_data(self.address, reg)
      if self.debug:
        print ("I2C: Peripherique 0x%02X retourne 0x%02X depuis le registre 0x%02X" %
         (self.address, result & 0xFF, reg))
      return result
    except IOError, err:
      return self.errMsg()

  def readS8(self, reg):
    "Lis un bit signe depuis un peripherique I2C"
    try:
      result = self.bus.read_byte_data(self.address, reg)
      if result > 127: result -= 256
      if self.debug:
        print ("I2C: Peripherique 0x%02X retourne 0x%02X depuis le registre 0x%02X" %
         (self.address, result & 0xFF, reg))
      return result
    except IOError, err:
      return self.errMsg()

  def readU16(self, reg):
    "Lis un bit 16 bits non signe depuis un peripherique I2C"
    try:
      result = self.bus.read_word_data(self.address,reg)
      if (self.debug):
        print "I2C: Peripherique 0x%02X retourne 0x%02X depuis le registre 0x%02X" % (self.address, result & 0xFFFF, reg)
      return result
    except IOError, err:
      return self.errMsg()

  def readS16(self, reg):
    "Lis un bit 16 bits signe depuis un peripherique I2C"
    try:
      result = self.bus.read_word_data(self.address,reg)
      if (self.debug):
        print "I2C: Peripherique 0x%02X retourne 0x%02X depuis le registre 0x%02X" % (self.address, result & 0xFFFF, reg)
      return result
    except IOError, err:
      return self.errMsg()

if __name__ == '__main__':
  try:
    bus = I2C(address=0)
    print "Le bus I2C par defaut est accessible"
  except:
    print "Une erreur s'est revelee lors de l'acces vers le but I2C par defaut"
