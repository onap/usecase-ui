#
# Copyright 2020 CMCC Corporation.
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

echo "### Starting usecase-ui" >> uuistartup.log;

cp -f /home/uui/server.xml /home/uui/tomcat/conf/
echo $? >> uuistartup.log;
echo "cp server.xml" >> uuistartup.log;
cp -f /home/uui/web.xml /home/uui/tomcat/conf/
echo $? >> uuistartup.log;
echo "cp web.xml" >> uuistartup.log;
cp -f /home/uui/uuiServer.jks /home/uui/tomcat/conf/
echo $? >> uuistartup.log;
echo "cp uuiServer.jks" >> uuistartup.log;

bash /home/uui/tomcat/bin/catalina.sh run