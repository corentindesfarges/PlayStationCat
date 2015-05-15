#!/bin/bash

#$1: url de la camera
#$2: chemin d'enregistrement

if [ $1 == "snap" ]; then
	if [ $# -eq 4 ]; then
		d=$(date +%Y-%m-%d#%H_%M_%S)
		cvlc --vout=dummy $2 \
		--video-filter scene --no-audio --scene-path $3 \
		--scene-prefix wimg_ --scene-format png vlc://quit --run-time=1

		mv $3/wimg_00001.png $3/img_$d.png
		if [ $4 == "true" ]; then
			cp $3/img_$d.png /var/www/todl/img_$d.png
		fi
	else
		echo "Wrong argments number"
	fi
elif [ $1 == "rec" ]; then
	if [ $# -eq 6 ]; then
		if [ ! -d "$DIRECTORY" ]; then
			mkdir -p $3
		fi
		echo $d
		d=$(date +%Y-%m-%d#%H_%M_%S)
		cvlc $2 --sout file/avi:$3/$4_$d.avi \
		--run-time=$5 --stop-time=$5 vlc://quit

		if [ $6 == "true" ]; then
                        cp $3/$4_$d.avi /var/www/todl/movie_$d.avi
                fi

	else
		echo "Wrong argments number"
	fi
else
	echo "Unkown parameter"
fi
