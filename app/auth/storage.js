import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    if (typeof value === 'object') {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.log(error.message);
  }
};

const retriveData = async (key) => {
  let value;
  try {
    value = await AsyncStorage.getItem(key);
    value = JSON.parse(value);
  } catch (e) {
    console.log(e);
  }
  value = await AsyncStorage.getItem(key);
  return value;
};

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error.message);
  }
};

export default {storeData, retriveData, removeData};
