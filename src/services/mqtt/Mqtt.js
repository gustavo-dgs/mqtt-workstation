import mqtt from "mqtt";
import Keys from "./Keys";

const options = {
  port: Keys.PORT,
  username: Keys.USERNAME,
  password: Keys.PASSWORD,
  protocol: "mqtt",
  protocolVersion: 3.1,
  host: Keys.HOST,
};

class Mqtt {
  static client = null;
  static actions = [];

  static connect() {
    return new Promise((resolve, reject) => {
      const client = mqtt.connect(options);
      client.client.on("connect", (error) => {
        if (!error) {
          console.log("Connected to MQTT");
          resolve();
          this.onMessage();
        } else {
          console.error(new Error("Connection Error"));
          reject();
        }
      });
    });
  }

  static onMessage() {
    this.client.on("message", (topic, message) => {
      const action = this.actions.find((action) => action.channel === topic);
      if (action) {
        action.callback(message);
      }
    });
  }

  static subscribe(channel, callback) {
    this.client?.subscribe(channel, (error) => {
      if (!error) {
        this.actions.push({ channel, callback });
      } else {
        console.error(new Error(`Error on subcribe topic: ${channel}`));
      }
    });
  }

  static publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
    }
  }

  static async closeConnection() {
    this.client.end();
  }

  static onConnectedDevice(callback) {
    this.subscribe("broker/admin/connected-device", callback);
  }

  static onDisconectedDevice(callback) {
    this.subscribe("broker/admin/disconnected-device", callback);
  }

  static sendChannel(channel, deviceId) {
    this.publish("workstation/admin");
  }
}

export default Mqtt;
