#!/bin/bash

cd /home/pi/PlayStationCat/python

if [[ $UID != 0 ]]; then
    echo "Please run the program as sudo."
    echo "sudo $0 $*"
    exit 1
fi

if [ "$1" == "start" ]; then
	if [ "$2" == "--showlog" ] || [ "$2" == "-l" ]; then
		sudo python server.py &
	else
		sudo python server.py > pscat.log 2>&1  &
	fi
elif [ "$1" == "stop" ]; then
	sudo kill -9 -- `ps aux |awk '{if( $12 == "server.py" && $11 == "/usr/bin/python") print $2}'`
else
	echo "Arguments missing or bad"
fi
