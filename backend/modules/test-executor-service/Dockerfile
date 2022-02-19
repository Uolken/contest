FROM openjdk:8-jdk-alpine

RUN set -ex && \
    apk add --no-cache gcc musl-dev && \
    apk add --upgrade firejail

COPY target/test-executor-service-1.0-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
