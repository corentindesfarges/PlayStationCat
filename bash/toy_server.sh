#!/bin/bash

cd /home/$USER/PlayStationCat/python

if [ "$1" == "start" ]; then
	if [ "$2" == "hidelog" ]; then
		python server.py test > pscat.log 2>&1 &
	else
		python server.py test &
	fi
elif [ "$1" == "stop" ]; then
	kill -9 `ps -u |awk '{if( $12 == "server.py" && $11 == "/usr/bin/python") print $2}'`
else
	echo "Arguments missing or bad"
fi
