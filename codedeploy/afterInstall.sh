#!/bin/sh
# cd /home/ubuntu/webapp
# sudo rm *.zip
while [ ! -f check.txt ];
do
  sleep 5
done

cd /home/ubuntu/webapp/
sudo unzip -o webapp.zip

sudo cp /home/ubuntu/webapp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/
sleep 10

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json -s
