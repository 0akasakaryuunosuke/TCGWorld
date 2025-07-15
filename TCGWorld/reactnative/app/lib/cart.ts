import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const API_URL = "http://10.0.2.2:8000/api/tcgworld/carts";
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
  export const getCart =async(userID:string) =>{
    const response = await api.get(`/getCart/${userID}`);
    if(response.data.code!=="200"){
      console.log("getCart error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    console.log("getCart response:", response.data);
    return response.data;
  }

  export const addToCart = async(ownerID:string ,itemId:string, number:number)=>{
    const response = await api.post("/addToCart",{ownerID,itemId,number});
    if(response.data.code!=="200"){
      console.log("addToCart error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }
  export const getItemsByUserIDAndStoreID =async(userID:string,storeID:string)=>{
    const response = await api.get(`/getCartsByUserIDAndStoreID/${userID}/${storeID}`);
   
    if(response.data.code!=="200"){
      console.log("getCartsByUserIDAndStoreID error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }
  export const deleteCart =async(itemID:string,ownerID:string)=>{
    const response =await api.delete(`/deleteCart/${ownerID}/${itemID}`)
    if(response.data.code!=="200"){
      console.log("deleteCart error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }
  export const deleteCartsByUserIDAndStoreID =async(userID:string,storeID:string)=>{
    const response =await api.delete(`/deleteCartsByUserIDAndStoreID/${userID}/${storeID}`)
    if(response.data.code!=="200"){
      console.log("deleteCartsByUserIDAndStoreID error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }

  export const updateCarts =async(data: {
  ownerID: number;
  items: { id: number; number: number }[];
})=>{
    console.log("updateCarts data:", data);
    const response = await api.post("/updateCart", data);
    if (response.data.code !== "200") {
      console.log("updateCarts error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }