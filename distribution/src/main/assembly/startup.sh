#
# Copyright 2017 ZTE Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


DIRNAME=`dirname $0`
RUNHOME=`cd $DIRNAME/; pwd`
echo @RUNHOME@ $RUNHOME
echo "### Starting usecase-ui";
cp -f /home/uui/server.xml /home/uui/tomcat/conf/
cp -f /home/uui/web.xml /home/uui/tomcat/conf/
cp -f /home/uui/uuiServer.jks /home/uui/tomcat/conf/

cd ./tomcat
if [ ! -d "$RUNHOME/tomcat/logs" ]; then
  mkdir $RUNHOME/tomcat/logs
fi
export CATALINA_HOME=$RUNHOME/tomcat
export CATALINA_BASE=$RUNHOME/tomcat
$RUNHOME/tomcat/bin/startup.sh
tail -f /home/uui/tomcat/logs/catalina.out

echo "### Starting usecase-ui end";
