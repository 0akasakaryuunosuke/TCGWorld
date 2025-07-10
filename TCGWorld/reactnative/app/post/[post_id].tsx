import { useGlobalContext } from '@/context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
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
import {
  addComment,
  getChildrenComments,
  getCommentsByPostId,
  likeComment,
  unlikeComment,
} from '../lib/comment';
import { follow, isFollowed, unfollow } from '../lib/follow';
import { getPostByID, likePost, unlikePost } from '../lib/post';

const { width: screenWidth } = Dimensions.get('window');

const PostDetail = () => {
  const route = useRoute();
  const { post_id } = route.params as { post_id: string };
  const navigation = useNavigation();
  const { user } = useGlobalContext();

  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const inputRef = useRef<TextInput>(null);
  const [expandedMap, setExpandedMap] = useState<{ [key: number]: boolean }>({});
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPostByID({ id: post_id, userID: user?.id ?? '-1' });
      setPost(res.data);
      setLiked(res.data.isLiked);

      const is = await isFollowed(Number(user?.id), res.data.userID);
      setIsFollowing(is.data);
    };

    fetchPost();
    fetchComments();
  }, [post_id]);

  useLayoutEffect(() => {
    if (!post) return;
    navigation.setOptions({
      title: post.userName || '动态详情',
      headerRight: () => (
        <TouchableOpacity onPress={handleFollow} style={{ marginRight: 12 }}>
          <Text style={{ color: isFollowing ? '#999' : '#007bff', fontSize: 14 }}>
            {isFollowing ? '已关注' : '+ 关注'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, post, isFollowing]);

  const handleFollow = useCallback(async () => {
    if (!user) return Alert.alert('提示', '请先登录！');
    if (!post) return Alert.alert('提示', '帖子尚未加载完成');

    try {
      if (isFollowing) {
        Alert.alert('提示', '确定要取消关注吗?', [{ text: '取消' }, { text: '确定', onPress: async() =>{
          await unfollow(Number(user.id), post.userID)
          setIsFollowing(prev => !prev);
        }}]);
      } else {
        await follow(Number(user.id), post.userID);
        setIsFollowing(prev => !prev);
      }
    
    } catch (error) {
      console.error('关注操作失败', error);
    }
  }, [user, post, isFollowing]);

  const fetchComments = async () => {
    const res = await getCommentsByPostId(Number(post_id), 0, 10, '');
    setComments(res.data || []);
  };

  const toggleLike = async () => {
    if (!user) return Alert.alert('提示', '请先登录！');
    try {
      if (liked) {
        await unlikePost(Number(user.id), post.id);
        setPost((prev: any) => ({ ...prev, like: prev.like - 1 }));
      } else {
        await likePost(Number(user.id), post.id);
        setPost((prev: any) => ({ ...prev, like: prev.like + 1 }));
      }
      setLiked(!liked);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) return Alert.alert('提示', '请先登录！');
    if (!commentText.trim()) return;

    try {
      await addComment({
        postID: post.id,
        userID: Number(user.id),
        content: replyTo ? `回复@${replyTo.userName}:${commentText}` : commentText,
        parentID: replyTo?.id,
      });
      setCommentText('');
      setReplyTo(null);
      Keyboard.dismiss();
      fetchComments();
    } catch (e) {
      console.error('评论失败:', e);
    }
  };

  const handleReply = (comment: any) => {
    if (!user) return Alert.alert('提示', '请先登录！');
    setReplyTo(comment);
    setCommentText('');
    inputRef.current?.focus();
  };

  const toggleExpand = async (commentID: number) => {
    const isExpanded = expandedMap[commentID];
    if (!isExpanded) {
      const target = comments.find(c => c.id === commentID);
      if (target && target.childrenComment?.length === 0) {
        const children = await getChildrenComments(commentID);
        target.childrenComment = children;
        setComments([...comments]);
      }
    }
    setExpandedMap(prev => ({ ...prev, [commentID]: !isExpanded }));
  };

  const toggleCommentLike = async (comment: any) => {
    if (!user) return Alert.alert('提示', '请先登录！');
    try {
      if (comment.isLiked) {
        await unlikeComment(Number(user.id), comment.id);
        comment.like -= 1;
      } else {
        await likeComment(Number(user.id), comment.id);
        comment.like += 1;
      }
      comment.isLiked = !comment.isLiked;
      setComments([...comments]);
    } catch (e) {
      console.error(e);
    }
  };

  const renderCommentItem = (comment: any, isChild = false) => (
    <View
      key={comment.id}
      style={{
        marginTop: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: isChild ? 50 : 0,
      }}
    >
      <Image
        source={
          comment.avatarUrl
            ? { uri: comment.avatarUrl }
            : require('@/assets/images/default_avatar.png')
        }
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          marginRight: 10,
        }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '600', fontSize: 14 }}>{comment.userName || '匿名'}</Text>
          <Text style={{ color: '#999', fontSize: 12 }}>{comment.displayTime}</Text>
        </View>
        <Text style={{ color: '#333', marginTop: 4 }}>{comment.content}</Text>
        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => toggleCommentLike(comment)}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}
          >
            <Ionicons
              name={comment.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={comment.isLiked ? '#d23f31' : '#999'}
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: comment.isLiked ? '#d23f31' : '#999', fontSize: 12 }}>{comment.like}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReply(comment)}>
            <Text style={{ fontSize: 12, color: '#007bff', marginRight: 12 }}>回复</Text>
          </TouchableOpacity>
          {!isChild && (
            <TouchableOpacity onPress={() => toggleExpand(comment.id)}>
              <Text style={{ fontSize: 12, color: '#888' }}>
                {expandedMap[comment.id] ? '收起回复' : `查看回复 (${comment.childrenComment?.length || 0})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {expandedMap[comment.id] &&
          comment.childrenComment?.map((child: any) => renderCommentItem(child, true))}
      </View>
    </View>
  );

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
                <View style={{ width: screenWidth, height: 350, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f8' }}>
                  <Image source={{ uri: item }} style={{ width: screenWidth - 16, height: 350, resizeMode: 'contain', borderRadius: 10 }} />
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
            {comments.map(comment => renderCommentItem(comment))}
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
