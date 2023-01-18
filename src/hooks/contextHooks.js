import React, { useContext, createContext, useState, useEffect } from "react";
import Device from "../services/mqtt-firebase/models/Device";
import Workstation from "../services/mqtt-firebase/models/Workstation";

const AppContextState = createContext();
const AppContextUser = createContext();
const AppContextApi = createContext();

const useAppContextState = () => useContext(AppContextState);
const useAppContextApi = () => useContext(AppContextApi);
const useAppContextUser = () => useContext(AppContextUser);

const AppContextProvider = ({ children }) => {
  // console.log("ContextProvider");
  const [user, setUser] = useState("gutierrez-house");
  const [workstation, setWorkstation] = useState(null);
  const [brokerDevices, setBrokerDevices] = useState(new Map());
  const [newBrokerDevices, setNewBrokerDevices] = useState([]);
  const [oldBrokerDevices, setOldBrokerDevices] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [unsubscribeFromBrokerDevices, setUnsubscribeFromBrokerDevices] =
    useState(() => {});

  //Load User
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Load user data
  useEffect(() => {
    const getData = async () => {
      const ws = await Workstation.get(
        "gutierrez-house",
        "Gustavo's Workspace"
      );

      if (!(ws instanceof Error)) {
        setWorkstation(ws);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const brokerDevicesArr = Array.from(brokerDevices.values());
    const newDevices =
      brokerDevicesArr.filter((device) => !device.nodeId) || [];
    setNewBrokerDevices(newDevices);
  }, [brokerDevices]);

  useEffect(() => {
    const brokerDevicesArr = Array.from(brokerDevices.values());
    const oldDevices = brokerDevicesArr.filter((device) => device.nodeId) || [];
    setOldBrokerDevices(oldDevices);
  }, [brokerDevices]);

  const updateEdges = async (edges) => {
    if (workstation) {
      const newWorkstation = { ...workstation, edges };
      await Workstation.update(newWorkstation);
    }
  };

  const updateNodes = async (nodes) => {
    if (workstation) {
      const newWorkstation = { ...workstation, nodes };
      await Workstation.update(newWorkstation);
    }
  };

  //brokerDevices Api
  const addDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.set(device.mqttId, device);
      return newState;
    });

    Device.add(device);
  };

  const removeDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.delete(device.mqttId, device);
      return newState;
    });

    Device.delete(device);
  };

  const updateDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.set(device.mqttId, device);
      return newState;
    });

    console.log("AppContextProvider updateDevice");
    Device.update(device);
  };

  const getDevices = () => {
    const devices = [];
    brokerDevices.forEach((device) => {
      devices.push(device);
    });
    return devices;
  };

  const onDeviceAdd = (devices) => {
    console.log("-----------DEVICE ADDED-----------");

    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.set(device.mqttId, device);
      });
      return newState;
    });
  };

  const onDeviceUpdate = (devices) => {
    console.log("-----------DEVICE UPDATED-----------");

    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.set(device.mqttId, device);
      });

      return newState;
    });
  };

  const onDeviceRemove = (devices) => {
    console.log("-----------DEVICE REMOVED-----------");

    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.delete(device.mqttId);
      });
      return newState;
    });
  };

  const getDevicesFromDb = async () => {
    const unsubscribe = await Device.getAll(
      user,
      onDeviceAdd,
      onDeviceUpdate,
      onDeviceRemove
    );

    setUnsubscribeFromBrokerDevices(() => unsubscribe);

    return unsubscribe;
  };

  const stateValue = {
    brokerDevices,
    newBrokerDevices,
    oldBrokerDevices,
  };

  const apiValue = {
    setUser,
    setWorkstation,
    addDevice,
    removeDevice,
    updateDevice,
    getDevices,
    getDevicesFromDb,
    unsubscribeFromBrokerDevices,
    updateEdges,
    updateNodes,
    setInitialLoad,
  };

  const userValue = {
    user,
    workstation,
    initialLoad,
  };

  return (
    <AppContextState.Provider value={stateValue}>
      <AppContextUser.Provider value={userValue}>
        <AppContextApi.Provider value={apiValue}>
          {children}
        </AppContextApi.Provider>
      </AppContextUser.Provider>
    </AppContextState.Provider>
  );
};

export {
  AppContextProvider,
  useAppContextState,
  useAppContextUser,
  useAppContextApi,
};
