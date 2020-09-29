FROM ubuntu:16.04

EXPOSE 8443

RUN apt-get update && \
    apt-get install -y python-software-properties && \
    apt-get install -y software-properties-common && \
    add-apt-repository -y ppa:openjdk-r/ppa && \
    apt-get update && \
    apt-get install -y openjdk-11-jdk

#configure the JDK
RUN sed -i 's|#networkaddress.cache.ttl=-1|networkaddress.cache.ttl=10|' /usr/lib/jvm/java-11-*/conf/security/java.security
ENV JAVA_HOME /usr/lib/jvm/java-11-*
ENV PATH $PATH:/usr/lib/jvm/java-11-*/bin
ENV CLASSPATH .:${JAVA_HOME}/lib:${JRE_HOME}/lib
ENV JRE_HOME ${JAVA_HOME}/jre

#add uui gui related resources to the docker image
RUN mkdir /home/uui
WORKDIR /home/uui
ADD usecase-ui-*-linux64.tar.gz /home/uui/
RUN chmod 755 /home/uui/*.sh

RUN bash /home/uui/configEnv.sh
USER uui
WORKDIR /home/uui
ENTRYPOINT /home/uui/startup.sh
