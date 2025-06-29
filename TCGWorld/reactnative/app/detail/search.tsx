import { AxiosError } from 'axios';
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchCards } from "../lib/card";

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions?.({
      title: "搜索结果",
    });
  }, [navigation]);

  const onSearch = async () => {
    try {
      const res = await searchCards(query, '', '', '');
      setResults(res.data);
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message;
      Alert.alert("抱歉捏~", message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="输入卡片名称"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearch}
          style={{
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 8,
            fontSize: 16
          }}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.code || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/detail/${item.code}` as any)}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: 60, height: 85, marginRight: 10 }}
                />
              )}
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.cardName}</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>{item.cardType}</Text>
                <Text style={{ fontSize: 14, color: '#d23f31' }}>￥{item.price?.toFixed(2)}起</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
