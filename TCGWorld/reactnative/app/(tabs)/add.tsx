import { useGlobalContext } from '@/context/GlobalContext';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uploadImage } from '../lib/oss';
import { publishPost } from '../lib/post';

export default function Add() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const {user}=useGlobalContext();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage =  (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async() => {
    if (!title || !content) {
    Alert.alert('提示', '请输入标题和内容');
    return;
  }
    if(!user) {
      return;
    }
   try {
    setLoading(true);
    const uploadedUrls = await Promise.all(images.map(uri => uploadImage(uri)));
    console.log('上传图片url:', uploadedUrls);
    await publishPost({
      title,
      content,
      imageUrls: uploadedUrls,
      userID: Number(user.id),
    });
    Alert.alert('成功', '发布成功');
    setTitle('');
    setContent('');
    setImages([]);
    router.push('/discover');
  } catch (err) {
    console.error(err);
    Alert.alert('错误', '发布失败');
  } finally {
    setLoading(false);
  }
    console.log('发布内容:', { title, content, images });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          placeholder="请输入标题"
          value={title}
          onChangeText={setTitle}
          className="mt-10 border border-gray-300 rounded-lg px-4 py-2 mb-4 text-base"
        />
        <TextInput
          placeholder="请输入内容"
          value={content}
          onChangeText={setContent}
          multiline
          style={{ minHeight: 100, textAlignVertical: 'top' }}
          className="mt-10 border border-gray-300 rounded-lg px-4 py-2 mb-4 text-base h-60"
        />
        <View className="flex-row flex-wrap gap-3 mb-4">
             <View className="flex-row flex-wrap gap-3 mb-4">
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image source={{ uri }} className="w-24 h-24 rounded-md" />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <AntDesign name="close" size={14} color="#fff" />
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={pickImage}
            className="w-24 h-24 border border-gray-300 rounded-md justify-center items-center"
          >
            <AntDesign name="plus" size={24} color="#888" />
          </Pressable>
        </View>


          <Pressable onPress={handlePublish} className="mt-4 px-4 w-full">
            <LinearGradient
              colors={['#FF7F50', '#FF4500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3 items-center rounded-lg w-full"
            >
              <Text className="text-white font-semibold text-lg">发布</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable onPress={handlePublish} className="mt-4 rounded-lg overflow-hidden">
        
            <Text className="text-white font-semibold text-lg">发布</Text>
         
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
