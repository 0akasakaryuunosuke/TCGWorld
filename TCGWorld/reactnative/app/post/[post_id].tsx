import { useGlobalContext } from '@/context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addComment, getCommentsByPostId } from '../lib/comment';
import { getPostByID, likePost, unlikePost } from '../lib/post';

const { width: screenWidth } = Dimensions.get('window');

const PostDetail = () => {
  const route = useRoute();
  const { post_id } = route.params as { post_id: string };
  const [post, setPost] = useState<any>(null);
  const navigation = useNavigation();
  const { user } = useGlobalContext();
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const inputRef = useRef<TextInput>(null);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostByID({
          id: post_id,
          userID: user?.id ?? '-1',
        });
        setPost(res.data);
        setLiked(res.data.isLiked);
        navigation.setOptions({
          title: res.data.userName || '动态详情',
        });
      } catch (error) {
        console.error('获取帖子失败:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [post_id]);

  const fetchComments = async () => {
    try {
      const res = await getCommentsByPostId(Number(post_id), pageNumber, pageSize, '');
      setComments(res.data || []);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      Alert.alert('提示', '请先登录！');
      return;
    }

    try {
      if (liked) {
        await unlikePost(Number(user.id), post.id);
        setPost((prev: any) => ({ ...prev, like: prev.like - 1 }));
      } else {
        await likePost(Number(user.id), post.id);
        setPost((prev: any) => ({ ...prev, like: prev.like + 1 }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      Alert.alert('提示', '请先登录！');
      return;
    }

    if (!commentText.trim()) return;

    try {
      await addComment({
        postID: post.id,
        userID: Number(user.id),
        content: commentText,
        parentID: replyTo?.id,
      });
      setCommentText('');
      setReplyTo(null);
      Keyboard.dismiss();
      fetchComments();
    } catch (error) {
      console.error('评论提交失败:', error);
    }
  };

  const handleReply = (comment: any) => {
    if (!user) {
      Alert.alert('提示', '请先登录！');
      return;
    }

    setReplyTo(comment);
    setCommentText('');
    inputRef.current?.focus();
  };

  const dismissKeyboardAndResetReply = () => {
    Keyboard.dismiss();
    setReplyTo(null);
  };

  if (!post) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardAndResetReply}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
          <Text className="text-xl font-bold mb-2">{post.title}</Text>
          <Text className="text-sm text-gray-500 mb-2">作者：{post.userName || '匿名'}</Text>
          <Text className="text-sm text-gray-400 mb-4">发布时间：{post.displayTime}</Text>

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

          <Text style={{ fontSize: 16, color: '#333' }}>{post.content}</Text>

          <View className="mt-6 flex-row justify-between items-center">
            <TouchableOpacity onPress={toggleLike} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? '#d23f31' : '#999'}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: liked ? '#d23f31' : '#999' }}>{post.like}</Text>
            </TouchableOpacity>
            <Text className="text-blue-500">💬 {post.comments}</Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>评论</Text>

            {comments.map((comment, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}
              >
                <Image
                  source={
                    comment.avatarUrl
                      ? { uri: comment.avatarUrl }
                      : require('@/assets/images/default_avatar.png')
                  }
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: '600', fontSize: 14 }}>{comment.userName || '匿名'}</Text>
                    <Text style={{ color: '#999', fontSize: 12 }}>{comment.displayTime}</Text>
                  </View>

                  <Text style={{ color: '#333', marginTop: 4 }}>{comment.content}</Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 12, color: '#888', marginRight: 16 }}>
                      ❤️ {comment.like}
                    </Text>
                    <TouchableOpacity onPress={() => handleReply(comment)}>
                      <Text style={{ fontSize: 12, color: '#007bff' }}>回复</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <TextInput
                ref={inputRef}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={replyTo ? `回复 @${replyTo.userName || '匿名'}` : '说点什么吧...'}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 8,
                  marginRight: 8,
                }}
              />
              <TouchableOpacity onPress={handleCommentSubmit}>
                <Text style={{ color: '#007bff', fontWeight: 'bold' }}>发送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PostDetail;
