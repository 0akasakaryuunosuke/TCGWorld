import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
const API_URL = "http://10.0.2.2:8000/api/tcgworld/users";


const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 获取所有用户
export const getUsers = async () => {
  try {
    const response = await api.get("/getAll");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

//获取单个用户
export const getUserById = async(id:number)=>{
  try {
    const response = await api.get(`/get/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}



// 删除用户
export const deleteUser = async (id: number) => {
  try {
    await api.delete(`/delete/${id}`);
     } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
    }
  };
  //获取当前用户
  export const getCurrentUser =async() =>{
    try {
        const userId = await AsyncStorage.getItem('userId');
        console.log("getCurrentUser的userId:",userId)
        return await api.get(`/get/${userId}`);
    } catch (error) {
      
    throw error;
    }
};
    //登录
    export const signIn =async(email:string,password:string)=>{
        try {
            const response = await api.post('/login',{email,password})
            await AsyncStorage.setItem('userId', response.data.id);
            console.log("signIn:",response.data)
            return response.data;
        } catch (error) {
            throw error;
        }
    };
// 创建用户
export const createUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post("/signUp", { username, email, password });
    console.log("createUser:",response.data)
    if (response.data?.id) {
      await AsyncStorage.setItem('userId', response.data.id.toString());}
   // await signIn( email, password); // 登录
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const logout = async () =>{
    try {
        await AsyncStorage.removeItem('currentUsername');
        await AsyncStorage.removeItem('userId');

    } catch (error) {
      console.error("登出失败:",error);
      throw error;
    }
}
  