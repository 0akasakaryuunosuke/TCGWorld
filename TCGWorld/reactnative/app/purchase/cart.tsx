import { useGlobalContext } from '@/context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';

import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getCart } from '../lib/cart'; // 你需要实现这个接口调用

type ItemDTO = {
  id: number;
  cardCode: string;
  cardName: string;
  price: number;
  number: number;
  imageUrl: string;
};

type StoreCart = {
  items: ItemDTO[];
  storeID: number;
  ownerID: number;
  storeName: string;
  quantity: number;
  totalPrice: number;
};

const Cart = () => {
  const [cartList, setCartList] = useState<StoreCart[]>([]);
  const [selectedStores, setSelectedStores] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const { user } = useGlobalContext();
    const navigation = useNavigation();
  const fetchCart = async () => {
    try {
      if(!user){return}
      const res = await getCart(user.id);
      setCartList(res.data); 
    } catch (error) {
      Alert.alert('出错啦！', '加载购物车失败');
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "购物车" });
    fetchCart();
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStores(new Set());
    } else {
      setSelectedStores(new Set(cartList.map(store => store.storeID)));
    }
    setSelectAll(!selectAll);
  };

  const toggleStoreSelect = (storeID: number) => {
    const newSet = new Set(selectedStores);
    if (newSet.has(storeID)) {
      newSet.delete(storeID);
    } else {
      newSet.add(storeID);
    }
    setSelectedStores(newSet);
    setSelectAll(newSet.size === cartList.length);
  };

  const handleCheckout = () => {
    const selected = cartList.filter(store => selectedStores.has(store.storeID));
    if (selected.length === 0) {
      Alert.alert('提示', '请先选择要结算的商品');
      return;
    }

    Alert.alert('结算', `共选择 ${selected.length} 家店铺，准备结算`);
    // router.push('/purchase/checkout'); 
  };

const renderItem = ({ item }: { item: StoreCart }) => {
  const cardImage = item.items[0]?.imageUrl;
  return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => 
       router.push(`/purchase/${item.storeID}` as any)
        }
      >
    <View className="bg-white m-2 p-4 rounded-lg shadow">
      <View className="flex-row justify-between items-center mb-2 ">
        <Text className="ml-10 font-bold text-base">{item.storeName}</Text>
        <Text className="text-sm text-gray-500">共 {item.quantity} 件</Text>
      </View>

      <View className="flex-row">
        <TouchableOpacity onPress={() => toggleStoreSelect(item.storeID)} className="justify-center items-center mr-2">
          <Ionicons
            name={selectedStores.has(item.storeID) ? 'checkmark-circle-outline' : 'ellipse-outline'}
            size={24}
            color="#007bff"
          />
        </TouchableOpacity>

        <Image
          source={{ uri: cardImage }}
          className="w-24 h-32 rounded"
          resizeMode="contain"
        />

        <View className="flex-1 ml-4 justify-between">
          <View className="mb-2">
            {item.items.slice(0, 5).map((card) => (
              <Text key={card.id} className="text-base text-gray-800">
                {card.cardName} × {card.number}
              </Text>
            ))}
            {item.items.length > 5 && (
              <Text className="text-sm text-gray-500">……等 {item.items.length} 张卡片</Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row justify-end mt-2">
        <Text className="text-gray-700">小计：</Text>
        <Text className="text-red-500 font-semibold">¥{item.totalPrice}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView className="flex-1 bg-myBackground">
      <FlatList
        data={cartList}
        keyExtractor={(item) => item.storeID.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-center mt-10 text-gray-500">购物车为空</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 底部操作栏 */}
      <View className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t p-4 items-center justify-between">
        <TouchableOpacity className="flex-row items-center" onPress={toggleSelectAll}>
          <Ionicons
            name={selectAll ? 'checkbox-outline' : 'square-outline'}
            size={22}
            color="#007bff"
          />
          <Text className="ml-2">全选</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 px-6 py-2 rounded-xl"
          onPress={handleCheckout}
        >
          <Text className="text-white font-bold text-base">去结算</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
