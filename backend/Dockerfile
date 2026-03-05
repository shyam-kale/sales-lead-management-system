FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Install bash for startup script
RUN apk add --no-cache bash

# Create startup script to convert DATABASE_URL
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'if [ -n "$DATABASE_URL" ]; then' >> /app/start.sh && \
    echo '  export SPRING_DATASOURCE_URL=$(echo $DATABASE_URL | sed "s/^postgres:\/\//jdbc:postgresql:\/\//")' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'exec java -Dserver.port=${PORT} -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["/app/start.sh"]


