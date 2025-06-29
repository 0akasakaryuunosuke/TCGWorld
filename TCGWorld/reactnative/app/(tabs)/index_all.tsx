import { MasonryFlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { getAllCards } from "../lib/card";

const Index_all = () => {
  const pageSize = 20;
  const [cards, setCards] = useState<any[]>([]);
  const [page, setPage] = useState(0); // 当前页
  const [refreshing, setRefreshing] = useState(false); // 正在下拉刷新
  const [loadingMore, setLoadingMore] = useState(false); // 正在加载更多
  const [hasMore, setHasMore] = useState(true); // 是否还有下一页
  // 拉取卡片数据
  const fetchCards = async (pageNum: number, isRefresh = false) => {
    try {
      const res = await getAllCards(pageNum, pageSize);
      const newCards = res.data;

      if (isRefresh) {
        setCards(newCards); // 如果是刷新，替换掉数据
      } else {
        setCards(prev => [...prev, ...newCards]); // 否则追加
      }

      setHasMore(newCards.length === pageSize); 
    } catch (error) {
      console.error("请求卡片失败", error);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    await fetchCards(0, true); // 重置到第0页
    setRefreshing(false);
  };

  // 加载更多（滑动到底部）
  const onEndReached = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchCards(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchCards(0, true); 
  }, []);

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: "#fff" }}>
      <View style={{ padding: 10, backgroundColor: '#fff' }}>
      <TouchableOpacity
    onPress={() => router.push("/detail/search")}
    style={{
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 8,
    }}
    activeOpacity={0.7}
  >
    <Text style={{ color: '#999', fontSize: 16 }}>搜索卡片名称...</Text>
    </TouchableOpacity>
    </View>
      <MasonryFlashList
        data={cards}
        numColumns={2}
        keyExtractor={(item, index) => item.code || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/detail/${item.code}` as any)}
            activeOpacity={0.8}
          >
            <View style={{ 
              padding: 8, 
              backgroundColor: "#eee", 
              margin: 4, 
              borderRadius: 8, 
              alignItems: 'center' 
            }}>
              {item.image_url && (
                <Image 
                  source={{ uri: item.image_url }} 
                  style={{ width: 120, height: 170, borderRadius: 8, marginBottom: 8 }} 
                  resizeMode="contain"
                />
              )}
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.cardName}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{item.cardType}</Text>


              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                {item.race && (
                  <Text style={{ fontSize: 12, color: '#333', marginRight: 8 }}>
                    {item.race}
                  </Text>
                )}
                {item.level != null && (
                  <Text style={{ fontSize: 12, color: '#333' }}>
                    等级:{item.level}
                  </Text>
                )}
                
              </View>
                {item.price != null && (
                <Text style={{ fontSize: 14, color: '#d23f31', marginTop: 4, alignSelf: 'flex-start' }}>
                      ￥{item.price.toFixed(2)}起
                </Text>
                )}
            </View>
          </TouchableOpacity>
        )}
        estimatedItemSize={200}

        // 下拉刷新
        refreshing={refreshing}
        onRefresh={onRefresh}

        onEndReached={onEndReached}
        onEndReachedThreshold={0.2} 

        ListFooterComponent={loadingMore ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="small" color="#999" />
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
};

export default Index_all;
