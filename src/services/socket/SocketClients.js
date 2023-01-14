class SocketClients {
  static clients = [];

  static add(socket) {
    const emit = socket.broadcast.emit;

    const newClient = {
      id: Math.random().toString(16).slice(2),
      workstation: "",
      sendConnectedDevice: (device) => emit("connected-device", device),
      sendDisconnectedDevice: (device) => emit("disconnected-device", device),
      onSuscription: (callback) => socket.on("suscription", callback),
      onPublish: (callback) => socket.on("publish", callback),
    };

    socket.on("authenticate", (payload) => {
      newClient.workstation = payload;
    });

    socket.on("disconnect", () => {
      console.log(`client disconnected id=${this.id}`);
      this.remove(newClient.id);
    });

    this.clients.push(newClient);

    console.log("New client connected id", newClient.id);
  }

  static remove(id) {
    this.clients = this.clients.filter((client) => client.id !== id);
  }

  static useWorkStationMethod(workstationName, methodName, data) {
    const workstation = this.clients.find(
      (client) => client.workstation === workstationName
    );

    return workstation[methodName](data);
  }

  static sendConnectedDevice(workstationName, device) {
    return this.useWorkStationMethod(
      workstationName,
      "sendConnectedDevice",
      device
    );
  }

  static sendDisconnectedDevice(workstationName, device) {
    return this.useWorkStationMethod(
      workstationName,
      "sendDisconnectedDevice",
      device
    );
  }

  static onSuscription(workstationName, callback) {
    return this.useWorkStationMethod(
      workstationName,
      "onSuscription",
      callback
    );
  }

  static onPublish(workstationName, callback) {
    return this.useWorkStationMethod(workstationName, "onPublish", callback);
  }
}

export default SocketClients;
