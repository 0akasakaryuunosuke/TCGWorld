import axios from "axios";

const API_URL = "http://10.0.2.2:8000/api/tcgworld/address";


const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 请求超时时间
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const getAllAddress = async (userID:string)=>{
     const response =await api.get(`/getAddress/${userID}`)
    if(response.data.code!=="200"){
      console.log("getAllAddress error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }

  export const createAddress = async (userID:number, receiverName:string,phone:string, region:string,detailed:string,isDefault:boolean) =>{
    const response = await api.post('/createAddress', {
        userID,
        receiverName,
        phone,
        region,
        detailed,
        isDefault
      });
    if(response.data.code!=="200"){
      console.log("createAddress error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }
  export const updateAddress = async (id:number,userID:number, receiverName:string,phone:string, region:string,detailed:string,isDefault:boolean) =>{
    const response = await api.post(`/updateAddress`, {
        id,
        userID,
        receiverName,
        phone,
        region,
        detailed,
        isDefault
      });
    if(response.data.code!=="200"){
      console.log("updateAddress error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }
    export const deleteAddress = async (id:string) =>{
    const response = await api.delete(`/deleteAddress/${id}`);
    if(response.data.code!=="200"){
      console.log("deleteAddress error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
    }
    export const getAddressByID = async (id:string) =>{
    const response = await api.get(`/getAddressByID/${id}`);
    if(response.data.code!=="200"){
      console.log("getAddressByID error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
    }
