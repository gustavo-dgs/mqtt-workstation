import mqttConnection from "./mqttConnection";

class Mqtt {
  static client = null;
  static channels = [];

  static async connect() {
    this.client = await mqttConnection();

    if (this.client) {
      console.log("Connected to MQTT");
      this.onMessage();
      return true;
    } else {
      console.log("Failed to connect to MQTT");
      return false;
    }
  }

  static async subscribe(channel, callback) {
    if (this.client) {
      this.client.subscribe(channel, (error) => {
        if (error) {
          console.error(error);
        } else {
          this.channels.push({ channel, callback });
        }
      });
    }
  }

  static async publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
    }
  }

  static onMessage() {
    this.client.on("message", function (topic, message) {
      const channel = Mqtt.channels.find((c) => c.channel === topic);
      if (channel) {
        channel.callback(message);
      }
    });
  }

  static async closeConnection() {
    this.client.end();
  }
}

export default Mqtt;
