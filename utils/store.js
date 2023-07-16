import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async(value) =>{
    await   AsyncStorage.setItem('data',value)
}

export const getData = async(key) =>{
   return await AsyncStorage.getItem(key)
}