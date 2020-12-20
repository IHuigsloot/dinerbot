import AsyncStorage from '@react-native-community/async-storage';

//Async function setItem stores the data locally in a json object
export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('AsyncStorage Error: ' + error.message);
  }
}

//Async function getItem retrieves the data from local storage as a json object
export async function getItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value; //aanpassingen :return value;
    }
  } catch (error) {
    console.log('AsyncStorage Error: ' + error.message);
  }
}

//Async function removeItem removes an item(key) from the local storage
export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('AsyncStorage Error: ' + error.message);
  }
}
