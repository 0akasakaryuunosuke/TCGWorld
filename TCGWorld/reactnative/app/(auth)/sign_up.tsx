import React, { useState } from 'react'
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'


import { useGlobalContext } from '@/context/GlobalContext'
import { AxiosError } from 'axios'
import { Link, useRouter } from 'expo-router'
import { createUser } from '../lib/user'

const Sign_up = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const {refreshUser} = useGlobalContext();
   // const { setUser } = useGlobalContext();
  const router = useRouter();
    const handleAddUser = async () => {
      if (!username || !email || !password) {
        Alert.alert("错误", "请输入完整的信息");
        return;
      }
      try {
       setLoading(true);
       const newUser = await createUser(username,email, password);
        setLoading(false);
        Alert.alert("成功", "创建成功");
        router.push('/');
        refreshUser();

      } catch (error) {
        const err = error as AxiosError<any>; 
        const message = err.response?.data?.message || "注册失败，请稍后再试";
        Alert.alert("错误", message);
        setLoading(false);
      }
    };
  return (
    <SafeAreaView className='flex-1 bg-myBackground'>

  <View className='flex-1 flex-col mx-2'>
      <View className="mt-20 px-4 flex-row items-center justify-between">
      <Pressable
        className="w-10 h-10 rounded-full bg-myBlack items-center justify-center"
        onPress={() => router.push('/profile')}
      >
        <Text className="text-myWhite text-xl">{'<'}</Text>
      </Pressable>
    
      <Text className="text-myBlack text-2xl font-bold text-center flex-1 ml-4">
        登陆您的账号
      </Text>
  
      <View className="w-10 h-10" />
    </View>
    
 
  <TextInput className='border border-myGreen rounded-md p-2 mt-6 h-12 '
  placeholder='请输入用户名' placeholderTextColor='#A0A0A0'
  value={username}
  onChangeText={setUsername}
  />
  <TextInput className='border border-myGreen rounded-md p-2 mt-6 h-12 '
  placeholder='请输入邮箱' placeholderTextColor='#A0A0A0'
  value={email}
  onChangeText={setEmail}
  />
  <TextInput className='border border-myGreen rounded-md p-2 mt-6 h-12 '
  placeholder='请输入密码' placeholderTextColor='#A0A0A0' 
  secureTextEntry={true}
  value={password}
  onChangeText={setPassword}
  
  />
  <Pressable className='bg-myGreen rounded-md p-2 mt-6 h-12 items-center justify-center'
  onPress={handleAddUser}
  >
    <Text className='text-myWhite font-semibold text-lg'>{loading?'注册中...':'注册'}</Text>
    
  </Pressable>
  <View className='flex-row items-center justify-center mt-6'>
  <Text className='text-myBlack font-semibold text-lg'>已有账号？</Text>
    <Link href="/sign_in" className='ml-2'>
    <Text className='text-myGreen font-semibold text-lg'>登录</Text>
    </Link>
  </View>
   
 </View>

    </SafeAreaView>
  )
}

export default Sign_up  