import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const API_URL = "http://10.0.2.2:8000/api/tcgworld/comments";
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

  export const getCommentsByPostId = async (postID: number,pageNumber: number,pageSize: number,filterType:string) => {
    const response = await api.get(`/getComment?postID=${postID}&pageNumber=${pageNumber}&pageSize=${pageSize}&filterType=${filterType}`);
    if (response.data.code !== "200") {
      console.log("getCommentsByPostId error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }

  export const addComment = async (comment:{
    postID: number;
    userID: number;
    content: string;
    parentID?: number;
  }) => {
    const response = await api.post("/createComment", comment);
    if (response.data.code !== "200") {
      console.log("addComment error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }


export const getChildrenComments = async (parentID: number) => {
  const response = await api.get(`/getChildrenComment?parentID=${parentID}`);
  if (response.data.code !== "200") {
    console.log("getChildrenComments error:", response.data.msg);
    throw new Error(response.data.msg);
  }
  return response.data;
}
export const likeComment = async (userID: number, postID: number) => {
  const response = await api.post("/likeComment", { userID, postID });
  if (response.data.code !== "200") {
    console.log("likeComment error:", response.data.msg);
    throw new Error(response.data.msg);
  }
  return response.data;
}
export const unlikeComment = async (userID: number, postID: number) => {
  const response = await api.post("/unlikeComment", { userID, postID });
  if (response.data.code !== "200") {
    console.log("unlikeComment error:", response.data.msg);
    throw new Error(response.data.msg);
  }
  return response.data;
}