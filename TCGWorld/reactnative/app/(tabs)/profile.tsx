import { useGlobalContext } from '@/context/GlobalContext';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { Link, router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../lib/user';

const Profile = () => {
  const { user, refreshUser } = useGlobalContext();
  const handleLogout = async () => {
  
    try {
      await logout();
      refreshUser();
      router.push('/');
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message || '登出失败，请稍后再试';
      Alert.alert('错误', message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-myBackground">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="items-center mt-10">
          {user?.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              className="w-16 h-16 rounded-full mb-2"
            />
          ) : (
            //<View className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
             <Image
              source={require('@/assets/images/default_avatar.png')}
              className="w-16 h-16 rounded-full mb-2"
            />
          )}
          <Text className="text-2xl font-bold">
            {user ? user.username : '未登录'}
          </Text>
        </View>

        {/* Panel: 我是买家 */}
        <View className="mt-10 px-4">
  <Text className="text-xl font-bold mb-3">我是买家</Text>
  <View className="flex-row flex-wrap bg-white p-4 rounded-xl shadow-md">
    <TouchableOpacity className="w-1/3 items-center mb-4" onPress={() => router.push('/')}>
      <Ionicons name="bag-outline" size={28} color="#007bff" />
      <Text className="mt-1 text-sm">我的订单</Text>
    </TouchableOpacity>

    <TouchableOpacity className="w-1/3 items-center mb-4" onPress={() => router.push('/')}>
      <Ionicons name="folder-outline" size={28} color="#e91e63" />
      <Text className="mt-1 text-sm">收藏夹</Text>
    </TouchableOpacity>

    <TouchableOpacity className="w-1/3 items-center mb-4" onPress={() => router.push('/address/manager')}>
      <MaterialIcons name="location-on" size={28} color="#4caf50" />
      <Text className="mt-1 text-sm">收货地址</Text>
    </TouchableOpacity>

    <TouchableOpacity className="w-1/3 items-center" onPress={() => router.push('/purchase/cart')}>
      <Ionicons name="cart-outline" size={28} color="#bbbbbb" />
      <Text className="mt-1 text-sm">购物车</Text>
    </TouchableOpacity>

    <TouchableOpacity className="w-1/3 items-center" onPress={() => router.push('/purchase/cart')}>
      <Ionicons name="heart-outline" size={28} color="#e01e63" />
      <Text className="mt-1 text-sm">心愿单</Text>
    </TouchableOpacity>
  </View>
</View>

        <View className="mt-8 px-4">
          <Text className="text-xl font-bold mb-3">我是卖家</Text>
          <View className="flex-row justify-around bg-white p-4 rounded-xl shadow-md">
            <TouchableOpacity className="items-center" onPress={() => router.push('/item/main')}>
              <FontAwesome5 name="box-open" size={24} color="#ff9800" />
              <Text className="mt-1 text-sm">我的商品</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center" onPress={() => router.push('/item/searchItem')}>
              <Ionicons name="add-circle-outline" size={28} color="#009688" />
              <Text className="mt-1 text-sm">添加商品</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
              <MaterialIcons name="bar-chart" size={28} color="#673ab7" />
              <Text className="mt-1 text-sm">销售统计</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 登录、注册、登出按钮 */}
        <View className="mt-10 items-center">
          {!user && (
            <>
              <Link href="/sign_in" className="mt-4">
                <Text className="text-lg font-semibold text-myBlack">登录</Text>
              </Link>
              <Link href="/sign_up" className="mt-4">
                <Text className="text-lg font-semibold text-myBlack">注册</Text>
              </Link>
            </>
          )}
          {user && (
            <Pressable className="mt-4" onPress={handleLogout}>
              <Text className="text-lg font-semibold text-red-500">登出</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
