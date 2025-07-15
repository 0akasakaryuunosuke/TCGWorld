import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";



const API_URL = "http://10.0.2.2:8000/api/tcgworld/cards";


const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 请求超时时间
    headers: {
      "Content-Type": "application/json",
    },
  });
  
    api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
  
  export const getAllCards = async (pageNumber: number,pageSize: number)=>{
    try {
        const response= await api.get(`/getAll?pageNumber=${pageNumber}&pageSize=${pageSize}`)
       return response.data
    
    } catch (error) {
        throw error
    }
  }

  export const searchCards = async(cardName: string,race:string,attribute:string,cardType:string)=>{
    try {
        const response = await api.post('/search',{cardName,race,attribute,cardType})
        return response.data
    } catch (error) {
        throw error
    }

  
  }
  export const getCardByCode =async (code: string) =>{
    try {
      const response = await api.get(`/getByCode/${code}`) 
      return response.data
    }
    catch (error) {
      throw error
    }

  }