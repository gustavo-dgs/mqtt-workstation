import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Device from "../services/mqtt-firebase/models/Device";

const AppContextState = createContext();
const AppContextApi = createContext();

const useAppContextState = () => useContext(AppContextState);
const useAppContextApi = () => useContext(AppContextApi);

const initialWorkstation = {
  domain: "gutierrez-house",
  mqttIp: 1,
  name: "Gustavo's Workspace",
};

const AppContextProvider = ({ children }) => {
  // console.log("ContextProvider");
  const [user, setUser] = useState(null);
  const [workstation, setWorkstation] = useState(initialWorkstation);
  const [brokerDevices, setBrokerDevices] = useState(new Map());
  const [newBrokerDevices, setNewBrokerDevices] = useState([]);
  const [unsuscribeFromBrokerDevices, setUnsuscribeFromBrokerDevices] =
    useState(() => {});

  //Load User
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //Load user data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workstation]);

  useEffect(() => {
    const brokerDevicesArr = Array.from(brokerDevices.values());
    const newDevices =
      brokerDevicesArr.filter((device) => !device.nodeId) || [];
    setNewBrokerDevices(newDevices);
  }, [brokerDevices]);

  //brokerDevices Api
  const addDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.set(device.mqttId, device);
      return newState;
    });
  };

  const removeDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.delete(device.mqttId, device);
      return newState;
    });
  };

  const updateDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.set(device.mqttId, device);
      return newState;
    });
  };

  const getDevices = useCallback(() => {
    const devices = [];
    brokerDevices.forEach((device) => {
      devices.push(device);
    });
    return devices;
  }, [brokerDevices]);

  const onDeviceAdd = (devices) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.set(device.mqttId, device);
      });
      return newState;
    });
  };

  const onDeviceUpdate = (devices) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.set(device.mqttId, device);
      });
      return newState;
    });
  };

  const onDeviceRemove = (devices) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.delete(device.mqttId);
      });
      return newState;
    });
  };

  const getDevicesFromDb = useCallback(async () => {
    const promise = await Device.getAll(
      user,
      onDeviceAdd,
      onDeviceUpdate,
      onDeviceRemove
    );

    const [devices, unsuscribe] = promise;

    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      devices.forEach((device) => {
        newState.set(device.mqttId, device);
      });
      return newState;
    });

    setUnsuscribeFromBrokerDevices(() => unsuscribe);

    return unsuscribe;
  }, [user]);

  const stateValue = useMemo(
    () => ({
      user,
      workstation,
      brokerDevices,
      newBrokerDevices,
    }),
    [user, workstation, brokerDevices, newBrokerDevices]
  );

  const apiValue = useMemo(
    () => ({
      setUser,
      setWorkstation,
      addDevice,
      removeDevice,
      updateDevice,
      getDevices,
      getDevicesFromDb,
      unsuscribeFromBrokerDevices,
    }),
    [getDevices, getDevicesFromDb, unsuscribeFromBrokerDevices]
  );

  return (
    <AppContextState.Provider value={stateValue}>
      <AppContextApi.Provider value={apiValue}>
        {children}
      </AppContextApi.Provider>
    </AppContextState.Provider>
  );
};

export { AppContextProvider, useAppContextState, useAppContextApi };
