#!/bin/bash

sudo kill -9 -- `ps aux |awk '{if( $12 == "/home/pi/PlayStationCat/python/motionDetector/VideoTools.py" && $11 == "python") print $2}'`

