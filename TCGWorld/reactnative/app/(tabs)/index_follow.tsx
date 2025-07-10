import { useGlobalContext } from '@/context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getFollowersPosts, unfollow } from '../lib/follow';

const PAGE_SIZE = 10;

const Index_follow = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<number | null>(null);

  const fetchPosts = async (pageIndex = 0, replace = false) => {
    if (!user) return;
    const res = await getFollowersPosts(user.id, pageIndex, PAGE_SIZE);
    const newPosts = res.data || [];

    setHasMore(newPosts.length === PAGE_SIZE);

    if (replace) {
      setPosts(newPosts);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    await fetchPosts(0, true);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const renderFooter = () => {
    if (!hasMore) {
      return <Text style={{ textAlign: 'center', color: '#999', marginVertical: 12 }}>没有更多内容了</Text>;
    }
    return loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null;
  };

  const openOptions = (userID: number) => {
    setSelectedUserID(userID);
    setModalVisible(true);
  };

  const handleUnfollow = async () => {
    if (!user || selectedUserID == null) return;
    await unfollow(Number(user.id), selectedUserID);
    setModalVisible(false);
    await onRefresh();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/post/${item.id}` as any)}
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.avatar ? { uri: item.avatar } : require('@/assets/images/default_avatar.png')}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.userName}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>{item.displayTime}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => openOptions(item.userID)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6 }}>{item.title}</Text>
      <Text style={{ fontSize: 14, color: '#333' }} numberOfLines={2}>
        {item.content}
      </Text>

      {item.imageUrls?.[0] && (
        <Image
          source={{ uri: item.imageUrls[0] }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginTop: 10,
            backgroundColor: '#f5f5f5',
          }}
          resizeMode="cover"
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>
        <Ionicons
          name={item.isLiked ? 'heart' : 'heart-outline'}
          size={18}
          color={item.isLiked ? '#d23f31' : '#999'}
          style={{ marginRight: 4 }}
        />
        <Text style={{ color: item.isLiked ? '#d23f31' : '#999', fontSize: 14 }}>{item.like}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>暂无关注动态</Text>}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingBottom: 20
            }}>
              <TouchableOpacity
                onPress={handleUnfollow}
                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              >
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#d23f31' }}>取消关注</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  //TODO: 举报功能
                }}
                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              >
                <Text style={{ fontSize: 16, textAlign: 'center' }}>举报</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 16,
                  marginTop: 8,
                  backgroundColor: '#f7f7f7',
                  marginHorizontal: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#888' }}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Index_follow;
