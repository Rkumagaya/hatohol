#!/bin/sh

NUM_RETRY=10
n=0
exit_code=0

sudo add-apt-repository ppa:cosmo0920-oucc/rabbitmq-c -y
sudo apt-get update -qq

while [ $n -lt $NUM_RETRY ]
do
  sudo apt-get install -qq -y librabbitmq-dev amqp-tools
  exit_code=$?
  if [ $exit_code -eq 0 ]; then
    break
  fi
  n=`expr $n + 1`
done
exit $exit_code
