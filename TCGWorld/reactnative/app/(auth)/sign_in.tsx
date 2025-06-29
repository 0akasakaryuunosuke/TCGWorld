import { useGlobalContext } from '@/context/GlobalContext'
import { AxiosError } from 'axios'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import { signIn } from '../lib/user'


const Sign_in = () => {
   
   const [loading,setLoading] = useState(false)
   const [email,setEmail] =useState('')
   const [password,setPassword] =useState('')
   const {refreshUser} = useGlobalContext();
   const handleLogin = async () => {
     if ( !email || !password) {
            Alert.alert("错误", "请输入完整的信息");
            return;
          }
    try {
      setLoading(true);
            const logUser = await signIn(email, password);
             setLoading(false);
             Alert.alert("成功", "登录成功");
             router.push('/');
             refreshUser();
     
           } catch (error) {
            const err = error as AxiosError<any>; 
            const message = err.response?.data?.message || "登录失败，请稍后再试";
            Alert.alert("错误", message);
            setLoading(false);
    }
   }
  return (

    <SafeAreaView className='flex-1 bg-myBackgroud'>
   
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
  onPress={handleLogin}>
    <Text className='text-myWhite font-semibold text-lg'>{loading?'登录中...':'登录'}</Text>
  </Pressable>

 <View className='flex-row items-center justify-center mt-6'>
  <Text className='text-myBlack font-semibold text-lg'>还没账号？</Text>
    <Link href="/sign_up" className='ml-2'>
    <Text className='text-myGreen font-semibold text-lg'>注册</Text>
    </Link>
  </View>

      </View>
    </SafeAreaView>
  )
}

export default Sign_in