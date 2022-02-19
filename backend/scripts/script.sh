#!/bin/bash  
ts=$(date +%s%N)  
eval "/usr/bin/time -v $1"
>&2 echo "time(ms): $((($(date +%s%N) - $ts)/1000000))" 
	
