import axios from "axios";
const API_URL = "http://10.0.2.2:8000/api/tcgworld/follow";
const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 请求超时时间
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const follow =async (userID: number, followerID: number)=>{
    const response = await api.post("/doFollow", { userID, followerID });
    if (response.data.code !== "200") {
      console.log("follow error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }
  export const unfollow =async (userID:number,followerID:number)=>{
    const response =await api.delete(`/unfollow?userID=${userID}&followerID=${followerID}`);
    if (response.data.code !== "200") {
      console.log("unfollow error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }
  export const isFollowed = async (userID: number, followerID: number) => {
    const response = await api.get(`/isFollowing?userID=${userID}&followerID=${followerID}`);
    if (response.data.code !== "200") {
      console.log("isFollowing error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data
  }

  export const getFollowersPosts =async (userID: string, pageNumber: number, pageSize: number) =>{
    const response = await api.get(`/getFollowPost/${userID}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (response.data.code !== "200") {
      console.log("getFollowersPosts error:", response.data.msg);
      throw new Error(response.data.msg);
    }
    return response.data;
  }