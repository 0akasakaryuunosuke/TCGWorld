import { useGlobalContext } from '@/context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';
import { MasonryFlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAllPosts, likePost, unlikePost } from '../lib/post';
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage"; // 添加接口

const PAGE_SIZE = 10;

const Discover = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useGlobalContext();
  const {userToken} =asyncStorage.getItem("token")
  const fetchPosts = async (pageNum: number, isRefresh = false) => {
    try {
      const res = await getAllPosts(pageNum, PAGE_SIZE,Number(user?.id??0));
      const newPosts = res.data || [];
      if (isRefresh) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === PAGE_SIZE);
    } catch (error) {
      console.error('获取动态失败:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    await fetchPosts(0, true);
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchPosts(0, true);
  }, []);

  const toggleLike = async (postId: number) => {
    if(!user)
    {
      Alert.alert("错误","请先登录");
        return
    }
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.isLiked;
          const updatedPost = {
            ...post,
            isLiked: !isLiked,
            like: isLiked ? post.like - 1 : post.like + 1,
          };
          if (isLiked) {
            unlikePost(Number(user.id),postId);
          } else {
            likePost(Number(user.id),postId);
          }
          return updatedPost;
        }
        return post;
      })
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MasonryFlashList
        data={posts}
        numColumns={2}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/post/${item.id}` as any);
              console.log("进入post的id:",item.id)
          }}
            activeOpacity={0.8}
          >
            <View
              style={{
                backgroundColor: '#f9f9f9',
                margin: 6,
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              {item.imageUrls && item.imageUrls.length > 0 && (
                <Image
                  source={{ uri: item.imageUrls[0] }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
              )}
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#444', marginTop: 4 }} numberOfLines={2}>
                  {item.content}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: '#888' }}>{item.userName || '匿名'}</Text>

                  <TouchableOpacity
                    onPress={() => toggleLike(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name={item.isLiked ? 'heart' : 'heart-outline'}
                        size={16}
                        color={item.isLiked ? '#d23f31' : '#999'}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={{ fontSize: 12, color: item.isLiked ? '#d23f31' : '#999' }}>
                        {item.like}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        estimatedItemSize={300}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#999" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Discover;
