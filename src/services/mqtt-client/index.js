import mqtt from "mqtt";

const options = {
  port: 1884,
  protocol: "mqtt",
  protocolVersion: 3.1,
  host: "localhost",
  clean: true,
};

class MqttClient {
  constructor() {
    this.client = mqtt.connect(options);
    this.client.on("connect", () => console.log("Device connected"));
  }

  onConnect(callback) {
    this.client.on("connect", callback);
  }

  onMessage(callback) {
    this.client.on("message", callback);
  }

  subscribe(topic) {
    this.client.subscribe(topic);
  }

  publish(topic, payload) {
    this.client.publish(topic, payload);
  }

  end() {
    this.client.end();
  }
}

export default MqttClient;
