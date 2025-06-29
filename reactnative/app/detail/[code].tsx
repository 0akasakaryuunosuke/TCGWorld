import { useGlobalContext } from "@/context/GlobalContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCardByCode } from '../lib/card';
import { addToCart } from "../lib/cart";
import { getItemsBycardCode } from '../lib/item';

const Detail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { code } = route.params as { code: string };

  const [card, setCard] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const { user } = useGlobalContext();
  // 商品详情弹窗状态
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);


  const handleAddToCart =async ()=>{
    if(!user){
      Alert.alert("错误","请先登录")
      return
    }
    if(!selectedItem){
      Alert.alert("错误","请选择商品")
      return
    }
    if(!selectedQuantity){
      Alert.alert("错误","请输入数量")
      return
    }
   try {
   const res = await addToCart(user.id,selectedItem.id,selectedQuantity)
    Alert.alert("成功",res.message)
   } catch (error: any) {
    Alert.alert("添加失败",error?.message||"发生了奇怪的错误")
   } 
  }
  const fetchCardDetail = async () => {
    try {
      const res = await getCardByCode(code);
      setCard(res.data);
      navigation.setOptions({
        title: res.data.cardName || "卡片详情",
      });
    } catch (error) {
      console.error("获取卡片详情失败", error);
    }
  };

  const fetchItems = async () => {
    if (loadingItems || !hasMore) return;

    setLoadingItems(true);
    try {
      const res = await getItemsBycardCode(code, pageNumber, pageSize);
      const newItems = res.data || [];

      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPageNumber(prev => prev + 1);
    } catch (e) {
      console.error("获取商品失败", e);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchCardDetail();
    fetchItems();
  }, []);

  if (!card) {
    return (
      <SafeAreaView>
        <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 50 }}>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
        {/* 卡图 */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {card.image_url && (
            <Image
              source={{ uri: card.image_url }}
              style={{ width: 240, height: 340, borderRadius: 12 }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold', fontSize: 24, marginTop: 16 }}>{card.cardName}</Text>
        <Text style={{ fontSize: 18, color: '#666', marginTop: 8 }}>{card.cardType}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {card.race && <Text style={{ marginRight: 12 }}>种族: {card.race}</Text>}
          {card.level != null && <Text style={{ marginRight: 12 }}>等级: {card.level}</Text>}
          {card.attribute && <Text>属性: {card.attribute}</Text>}
        </View>
        {card.effect && (
          <Text style={{ marginTop: 12, paddingHorizontal: 8, fontSize: 16, color: "#333" }}>
            效果: {card.effect}
          </Text>
        )}

        {/* 商品信息区域 */}
        <View style={{ width: '100%', marginTop: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>在售商品：</Text>

          {items.length === 0 && !hasMore && (
            <Text style={{ color: '#999', textAlign: 'center' }}>暂无在售商品</Text>
          )}

          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedItem(item);
                setSelectedQuantity(1);
                setItemModalVisible(true);
              }}
              style={{
                flexDirection: 'row',
                padding: 12,
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 8,
                marginBottom: 12,
                alignItems: 'center'
              }}
            >
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 60, height: 80, borderRadius: 4, marginRight: 12 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.userName}</Text>
                <Text>版本: {item.version} | 稀有度: {item.rarity}</Text>
                <Text style={{ marginTop: 4, color: '#007bff' }}>价格: ¥{item.price}</Text>
                <Text style={{ color: '#555' }}>库存: {item.number}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {hasMore && (
            <TouchableOpacity
              onPress={fetchItems}
              style={{
                paddingVertical: 10,
                backgroundColor: '#007bff',
                borderRadius: 6,
                marginTop: 12,
              }}
            >
              {loadingItems ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center' }}>加载更多</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 图片放大 Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            {card.image_url && (
              <Image
                source={{ uri: card.image_url }}
                style={{ width: 300, height: 450, borderRadius: 12 }}
                resizeMode="contain"
              />
            )}
            <Text style={{ marginTop: 20, color: '#fff', textAlign: 'center' }}>点击关闭</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 商品详情 Modal */}
    <Modal
  visible={itemModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setItemModalVisible(false)}
>
  <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
    <View
      style={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        paddingBottom: 32,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {selectedItem?.imageUrl && (
          <Image
            source={{ uri: selectedItem.imageUrl }}
            style={{ width: 100, height: 130, borderRadius: 8, marginRight: 16 }}
            resizeMode="cover"
          />
        )}
        <View style={{ flex: 1, justifyContent: 'space-between', height: 130 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            {card?.cardName}
          </Text>
          <Text style={{ fontSize: 16, color: '#999', textAlign: 'right' }}>
            {selectedItem?.userName}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginRight: 10 }}>数量：</Text>
        <TouchableOpacity
          onPress={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
          style={{
            backgroundColor: '#eee',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            marginRight: 10
          }}
        >
          <Text style={{ fontSize: 20 }}>-</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>{selectedQuantity}</Text>
        <TouchableOpacity
          onPress={() => setSelectedQuantity(prev => Math.min(prev + 1, selectedItem?.number || 1))}
          style={{
            backgroundColor: '#eee',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            marginLeft: 10
          }}
        >
          <Text style={{ fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 添加到购物车按钮 */}
      <TouchableOpacity
        onPress={() => {
          handleAddToCart();
          setItemModalVisible(false);
        }}
        style={{
          backgroundColor: '#007bff',
          paddingVertical: 12,
          borderRadius: 10,
          marginTop: 20
        }}
      >
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>
          添加到购物车
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setItemModalVisible(false)} style={{ marginTop: 12 }}>
        <Text style={{ color: '#666', textAlign: 'center' }}>取消</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default Detail;
