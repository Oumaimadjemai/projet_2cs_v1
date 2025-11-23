FROM eclipse-temurin:21-jdk
COPY target/registry*.jar /registry.jar
ENTRYPOINT ["java","-jar","/registry.jar"]