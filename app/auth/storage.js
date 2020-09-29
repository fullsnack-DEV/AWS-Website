import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

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
  try {
    if (typeof value === 'object') {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error.message);
  }
};

export default {storeData, retriveData, removeData};
