import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://10.0.2.2:8000/api/tcgworld/oss";
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
export const uploadImage = async (uri: string) => {
  try {
    const formData = new FormData();

    const file = {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any;

    formData.append('file', file);

    const response = await fetch('http://10.0.2.2:8000/api/tcgworld/oss/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const data = await response.json();
    if (data.code !== '200') {
      console.error('uploadImage error:', data.msg);
      throw new Error(data.msg);
    }
    console.log('Image uploaded successfully:', data.data.url);
    return data.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};