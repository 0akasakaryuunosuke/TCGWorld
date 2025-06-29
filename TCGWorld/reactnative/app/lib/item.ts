import axios from "axios";

const API_URL = "http://10.0.2.2:8000/api/tcgworld/items";
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getItemsByUserID = async (userID: string) => {
  try {
    const response = await api.get(`/getItemsByUserID/${userID}`);
    return response.data;
  } catch (error) {
    console.log("getItemsByUserID error:", error);
    throw error;
  }
};

export const getItemsBycardCode = async (cardCode: string,pageNumber: number,pageSize: number) => {
  try {
    const response = await api.get(`/getItemsByCardCode/${cardCode}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.log("getItemsBycardCode error:", error);
    throw error;
  }
};

export const registerItem =async(cardCode: string,userID: string ,price:number,number:number,rarity:string,version:string) =>{
  try {
    const response = await api.post("/registerItem",{cardCode,userID,price,number,rarity,version})
    console.log("registerItem response:", response.data);
    if(response.data.code!=="200"){
      console.log("registerItem error:i throw error:", response.data.msg);
      throw new Error(response.data.msg)
    }
    return response.data;
  } catch (error) {
    throw error
  }
}

export const getItemsByID = async (id: string) => {
  try {
    const response = await api.get(`/getItemByID/${id}`);
    console.log("getItemsByID response:", response.data);
    return response.data.data;
  } catch (error) {
    console.log("getItemsByID error:", error);
    throw error;
  }
};
export const saveItem = async(id:string,price:number,number:number,status:string)=>{
  try {
    const response = await api.post("/saveItem",{id,price,number,status})
    console.log("saveItem response:", response.data);
    if(response.data.code!=="200"){
      console.log("saveItem error:i throw error:", response.data.msg);
      throw new Error(response.data.msg)
    }
    
  } catch (error) {
    throw error
  }
}
