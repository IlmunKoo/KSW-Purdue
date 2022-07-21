FROM openjdk:17-oracle
ARG JAR_FILE=build/libs/*-SNAPSHOT.jar
COPY ${JAR_FILE} server.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/server.jar"]