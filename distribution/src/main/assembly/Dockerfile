FROM nexus3.onap.org:10001/onap/integration-java11:9.0.0 

EXPOSE 8443

USER root
RUN apk update && apk add shadow && apk add bash


#configure the JDK

ENV CLASSPATH .:${JAVA_HOME}/lib:${JRE_HOME}/lib


#add uui gui related resources to the docker image
RUN mkdir /home/uui
WORKDIR /home/uui
ADD usecase-ui-*-linux64.tar.gz /home/uui/
RUN chmod 755 /home/uui/*.sh

RUN sh /home/uui/configEnv.sh
USER uui
WORKDIR /home/uui
ENTRYPOINT /home/uui/startup.sh
