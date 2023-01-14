import mqtt from "mqtt";
import Keys from "./Keys";

// const url = Keys.HOST;

const options = {
  port: Keys.PORT,
  username: Keys.USERNAME,
  password: Keys.PASSWORD,
  protocol: "ws",
  host: Keys.HOST,
};

const mqttConnection = () => {
  const client = mqtt.connect(options);

  const promise = new Promise((resolve, reject) => {
    client.on("connect", (error) => {
      if (error) {
        reject(error);
        console.log("Connection Error");
      } else {
        console.log("Connection Success");
        resolve(client);
      }
    });
  });
  return promise;
};

export default mqttConnection;
