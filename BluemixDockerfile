FROM registry.ng.bluemix.net/ibmliberty:latest

COPY target/digitalbanking-screens.war /config/dropins/

EXPOSE 9080

ENTRYPOINT ["/opt/ibm/docker/docker-server", "run", "defaultServer"]
