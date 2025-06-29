import { useGlobalContext } from '@/context/GlobalContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { deleteCart, deleteCartsByUserIDAndStoreID, getItemsByUserIDAndStoreID, updateCarts } from '../lib/cart';

type ItemDTO = {
  id: number;
  cardCode: string;
  cardName: string;
  price: number;
  number: number;
  imageUrl: string;
};

const Store = () => {
  const route = useRoute();
  const { user } = useGlobalContext();
  const { store_id } = route.params as { store_id: string };
    const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const [cartItems, setCartItems] = useState<ItemDTO[]>([]);
  const [cartVisible, setCartVisible] = useState(true);

  const navigation = useNavigation();

    const fetchCart = async () => {
      if(user){
      try {
        const response = await getItemsByUserIDAndStoreID(user.id, store_id);
        setCartItems(response.data.items);
       
      } catch (error) {
        console.error('购物车加载失败:', error);
      }
    };
  }
  useEffect(() => {
    navigation.setOptions({
        title: "卡牌店铺",})
    fetchCart();
    
  }, [user?.id, store_id]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, number: Math.max(1, item.number + delta) }
          : item
      )
    );

  };

  const removeItem = async(id: number) => {
    if (user?.id) {
      try {
        await deleteCart(id.toString(), user.id.toString());
        Alert.alert("删除成功");
        setCartItems(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('删除购物车失败:', error);
        Alert.alert('删除失败', error instanceof Error ? error.message : String(error));
      }
    }
  };

  const handleEmpty =async ()=>{
    if(!user)
    {
      Alert.alert("错误","请先登录")
      return
    }
    try {
      await  deleteCartsByUserIDAndStoreID(user.id,store_id);
      Alert.alert("成功","清空成功");
      fetchCart();
    } catch (error) {
       console.error('清空购物车失败:', error);
        Alert.alert('清空失败', error instanceof Error ? error.message : String(error));
    }
    
  }
  const clearCart = () => {
    Alert.alert('确认清空？', '', [
      { text: '取消' },
      { text: '清空', onPress: () => handleEmpty() },
    ]);
  };

  const saveCart = async () =>{
    if (!user) {
      Alert.alert('用户未登录', '请先登录后再保存购物车');
      return;
    }
    try {
      const payload = {
        ownerID: Number(user.id),
        items: cartItems.map(({ id, number }) => ({ id, number })),
      };
      await updateCarts(payload);
      Alert.alert('保存成功', '购物车已更新',[
        {text:'确认',onPress :() => setCartVisible(false)}
      ]);
      fetchCart();
    } catch (error) {
      console.error('保存购物车失败:', error);
      Alert.alert('保存失败', '请稍后重试');
    }
  }

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold m-4">商家页面</Text>
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded mx-4"
        onPress={() => setCartVisible(true)}
      >
        <Text className="text-white text-center">打开购物车</Text>
      </TouchableOpacity>

      {/* 购物车 Modal */}
       <Modal
        animationType="slide"
        transparent
        visible={cartVisible}
        onRequestClose={() => setCartVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View
            className="bg-white rounded-t-2xl p-4"
            style={{ height: SCREEN_HEIGHT * 0.5 }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold">购物车</Text>
              <TouchableOpacity onPress={clearCart}>
                <Text className="text-red-500">清空</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
           renderItem={({ item }) => (
              <View className="flex-row py-3 border-b border-gray-200">
                {/* 左侧图片 */}
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-24 h-32 rounded mr-3"
                  resizeMode="cover"
                />

                {/* 右侧内容 */}
                <View className="flex-1 justify-between">

                  <View>
                    <Text className="text-xl font-bold ">{item.cardName}</Text>
                    <Text className="text-base text-gray-500 mt-1">¥{item.price}</Text>
                  </View>

                  <View className="flex-row justify-end items-center mt-4 space-x-4">
                    <View className="flex-row items-center rounded-full border border-gray-300 px-3 py-1">
                      <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                        <Text className="text-lg font-bold px-2">-</Text>
                      </TouchableOpacity>
                      <Text className="mx-1">{item.number}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                        <Text className="text-lg font-bold px-2">+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* 移除按钮 */}
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text className="text-red-500">移除</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            />
             <TouchableOpacity
              className="bg-blue-500 py-2 mt-4 rounded"
              onPress={() => saveCart()}
            >
              <Text className="text-center">保存</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-300 py-2 mt-4 rounded"
              onPress={() => setCartVisible(false)}
            >
              <Text className="text-center">关闭</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Store;
