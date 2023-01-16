import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  const [user, setUser] = useState(null);
  const [workstation, setWorkstation] = useState(null);
  const [brokerDevices, setBrokerDevices] = useState(new Map());
  const [newBrokerDevices, setNewBrokerDevices] = useState([]);
  const [oldBrokerDevices, setOldBrokerDevices] = useState([]);
  const [unsuscribeFromBrokerDevices, setUnsuscribeFromBrokerDevices] =
    useState(() => {});

  //Load User
  useEffect(() => {
    const getData = async () => {
      const ws = await Workstation.get(
        "gutierrez-house",
        "Gustavo's Workspace"
      );

      if (!(ws instanceof Error)) setWorkstation(ws);
    };

    getData();
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

  useEffect(() => {
    const brokerDevicesArr = Array.from(brokerDevices.values());
    const oldDevices = brokerDevicesArr.filter((device) => device.nodeId) || [];
    setOldBrokerDevices(oldDevices);
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
    device.delete();
  };

  const updateDevice = (device) => {
    setBrokerDevices((prevState) => {
      const newState = new Map(prevState);
      newState.set(device.mqttId, device);
      return newState;
    });

    Device.update(device);
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
    const unsuscribe = await Device.getAll(
      user,
      onDeviceAdd,
      onDeviceUpdate,
      onDeviceRemove
    );

    setUnsuscribeFromBrokerDevices(() => unsuscribe);

    return unsuscribe;
  }, [user]);

  const stateValue = useMemo(
    () => ({
      brokerDevices,
      newBrokerDevices,
      oldBrokerDevices,
    }),
    [brokerDevices, newBrokerDevices, oldBrokerDevices]
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

  const userValue = useMemo(
    () => ({
      user,
      workstation,
    }),
    [user, workstation]
  );

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
