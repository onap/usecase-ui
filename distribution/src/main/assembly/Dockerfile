FROM ubuntu:16.04

MAINTAINER "Lu Ji" <lu.ji3@zte.com.cn>

EXPOSE 8080

RUN apt-get update && \
    apt-get install -y openjdk-8-jdk

#configure the JDK
RUN sed -i 's|#networkaddress.cache.ttl=-1|networkaddress.cache.ttl=10|' /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.security
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV PATH $PATH:/usr/lib/jvm/java-8-openjdk-amd64/jre/bin:/usr/lib/jvm/java-8-openjdk-amd64/bin
ENV CLASSPATH .:${JAVA_HOME}/lib:${JRE_HOME}/lib
ENV JRE_HOME ${JAVA_HOME}/jre

#add uui gui related resources to the docker image
RUN mkdir /home/uui
WORKDIR /home/uui
ADD usecase-ui-*-linux64.tar.gz /home/uui/
RUN chmod 755 /home/uui/*.sh

ENTRYPOINT /home/uui/startup.sh
