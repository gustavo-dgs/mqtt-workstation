class SocketClients {
  static clients = [];

  static add(socket) {
    const newClient = {
      id: Math.random().toString(16).slice(2),
      emit: socket.broadcast.emit,
      workstation: "",
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
}

export default SocketClients;
