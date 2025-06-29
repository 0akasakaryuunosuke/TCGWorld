import { useGlobalContext } from "@/context/GlobalContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getCardByCode } from "../lib/card";
import { getItemsByID, saveItem } from "../lib/item";

const Item = () => {
     const route = useRoute();
     const navigation = useNavigation();
     const { item_id } = route.params as { item_id: string };
   
     const [card, setCard] = useState<any>(null);
     const [price, setPrice] = useState("");
     const [quantity, setQuantity] = useState(1);
     const [status,setStatus] =useState("on")
     const {user} = useGlobalContext();

      useEffect(() => {
        const fetchCardDetail = async () => {
          try {
  
            const card = await getItemsByID(item_id)
            const res = await getCardByCode(card.cardCode);
            setCard(res.data);
            setPrice(card.price.toString());
            setStatus(card.status);
            setQuantity(card.number);
            navigation.setOptions({ title: "编辑商品" });
          } catch (error) {
            console.error("获取卡片详情失败", error);
          }
        };
    
        fetchCardDetail();
      }, []);
    
      if (!card) {
        return (
          <SafeAreaView>
            <Text style={{ textAlign: "center", marginTop: 50, fontSize: 20 }}>
              加载中...
            </Text>
          </SafeAreaView>
        );
      }
    
  const handleSave = async()=>{
    try {
      
      await saveItem(item_id,Number(price),quantity,status)
      Alert.alert("恭喜","保存成功")
      router.push("/item/main")
    } catch (error) {
      const err = error as AxiosError<any>; 
      const message = err.response?.data.data.msg
      Alert.alert("错误", message);
    }
  }

 return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Panel 1 - 卡片信息 */}
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>卡片信息</Text>
            <View style={{ flexDirection: "row" }}>
              <Image source={{ uri: card.image_url }} style={styles.cardImage} />
              <View style={{ marginLeft: 10, flex: 1, justifyContent: "space-between" }}>
                <Text style={styles.label}>{card.cardName}</Text>
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() =>  router.push(`/detail/${card.code}`as any)}
                >
                  <Text style={styles.detailBtnText}>查看卡牌信息</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          {/* Panel 3 - 商品价格 */}
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>商品价格</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="请输入价格（元）"
              keyboardType="numeric"
            />
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>库存数量</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                  <Text style={{ marginHorizontal: 20 }}>{quantity}</Text>
                  <Button title="+" onPress={() => setQuantity(quantity + 1)} />
                </View>
              </View>
          </View>
          <View style={styles.panel}>
           <Text style={styles.panelTitle}>是否上架</Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
           <Text style={styles.label}>{status === 'on' ? '已上架' : '未上架'}</Text>
            <Switch
            value={status === 'on'}
            onValueChange={(value) => setStatus(value ? 'on' : 'off')}
          />
          </View>
        </View>
        </ScrollView>

        {/* 底部固定按钮 */}
        <View style={styles.fixedBottom}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleSave()}>
            <Text style={styles.addBtnText}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardImage: {
    width: 100,
    height: 140,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  optionBtn: {
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
  },
  selectedBtn: {
    backgroundColor: "#ddd",
  },
  detailBtn: {
    width:120,
    padding: 6,
    backgroundColor: "#007bff",
    borderRadius: 20,

  },
  detailBtnText: {
    color: "#fff",
    textAlign: "center",
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
  },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Item