import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPostByID } from '../lib/post';

const { width: screenWidth } = Dimensions.get('window');

const PostDetail = () => {
  const route = useRoute();
  const { post_id } = route.params as { post_id: string };
  const [post, setPost] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostByID(post_id.toString());
        setPost(res.data);
        navigation.setOptions({
          title: res.data.userName || '动态详情',
        });
      } catch (error) {
        console.error('获取帖子失败:', error);
      }
    };

    fetchPost();
  }, [post_id]);

  if (!post) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-xl font-bold mb-2">{post.title}</Text>
        <Text className="text-sm text-gray-500 mb-2">作者：{post.userName || '匿名'}</Text>
        <Text className="text-sm text-gray-400 mb-4">发布时间：{post.createdTime}</Text>

        {post.imageUrls?.length > 0 && (
        <FlatList
            data={post.imageUrls}
            horizontal
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            renderItem={({ item }) => (
            <View
                style={{
                width: screenWidth,
                height: 350,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f8f8',
                }}
            >
                <Image
                source={{ uri: item }}
                style={{
                    width: screenWidth - 16, 
                    height: 350,
                    resizeMode: 'contain',
                    borderRadius: 10,
                }}
                />
            </View>
            )}
            />
        )}

        <Text className="text-base text-gray-800">{post.content}</Text>

        <View className="mt-6 flex-row justify-between">
          <Text className="text-red-500">❤️ {post.likes}</Text>
          <Text className="text-blue-500">💬 {post.comments}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;
