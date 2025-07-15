import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const API_URL = "http://10.0.2.2:8000/api/tcgworld/posts";
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

  export const getAllPosts =async(pageNumber: number,pageSize: number ,userID:number)=>{
    const response = await api.get(`getAllPosts?pageNumber=${pageNumber}&pageSize=${pageSize}&userID=${userID}`);
    if(response.data.code!=="200"){
      console.log("getPosts error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }
export const getPostByID = async (data:{id: string,userID?:string}) => {
    const response = await api.get(`getPost?id=${data.id}&userID=${data.userID}`);
    if(response.data.code!=="200"){
      console.log("getPostByID error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
}

export const publishPost = async (postDTO: {
  title: string;
  content: string;
  imageUrls: string[];
  userID: number;
}) => {
  try {
    const response = await api.post("createPost", postDTO);
    if (response.data.code !== "200") {
      console.log("publishPost error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  } catch (error) {
    console.error("Error publishing post:", error);
    throw error;
  }
};

export const likePost = async (userID:number,postID: number) => {

    const response = await api.put(`like?userID=${userID}&postID=${postID}`);
    if (response.data.code !== "200") {
      console.log("likePost error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
}
export const unlikePost = async(userID:number,postID: number) => {
  const response = await api.put(`unlike?userID=${userID}&postID=${postID}`);
  if (response.data.code !== "200") {
    console.log("unlikePost error:", response.data.msg);
    throw new Error(response.data.msg);
  }
  return response.data;
}