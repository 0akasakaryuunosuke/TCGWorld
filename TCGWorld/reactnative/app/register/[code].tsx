import { useGlobalContext } from "@/context/GlobalContext";
import { Picker } from "@react-native-picker/picker";
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
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getCardByCode } from "../lib/card";
import { registerItem } from "../lib/item";

const Register = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { code } = route.params as { code: string };

  const [card, setCard] = useState<any>(null);
  const [cardType, setCardType] = useState<"graded" | "ungraded">("ungraded");
  const [condition, setCondition] = useState("流通品相");
  const [gradingCompany, setGradingCompany] = useState("PSA");
  const [gradingScore, setGradingScore] = useState("10");
  const [gradingNumber, setGradingNumber] = useState("");
  const [rarity,setRarity] = useState("N");
  const [version,setVersion]=useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const {user} = useGlobalContext();
  const handleRegister= async()=>{
    try {
    if(!user){
      Alert.alert("错误","请先登录")
      return
    }
    if(!price){
      Alert.alert("错误","请填写价格")
      return
    }
    console.log(rarity,version)
    await registerItem(code,user.id,Number(price),Number(quantity),rarity,version)
    Alert.alert("恭喜","添加商品成功");
    router.back();
    } catch (error) {
    const err = error as AxiosError<any>; 
    const message = err.response?.data?.msg
    Alert.alert("错误", message);
    }
  }

  useEffect(() => {
    const fetchCardDetail = async () => {
      try {
        const res = await getCardByCode(code);
        setCard(res.data);
        navigation.setOptions({ title: res.data.cardName });
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
                  onPress={() =>  router.push(`/detail/${code}`as any)}
                >
                  <Text style={styles.detailBtnText}>查看卡牌信息</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>商品信息</Text>
            <View style={{ marginBottom: 10 }}>
            <View>
                <Text style={styles.label}>罕贵度</Text>
                <Picker
                  selectedValue={rarity}
                  onValueChange={(val) => setRarity(val)}
                >
                  <Picker.Item label="N" value="N" />
                  <Picker.Item label="R" value="R" />
                  <Picker.Item label="SR" value="SR" />
                  <Picker.Item label="UR" value="UR" />
                  <Picker.Item label="UTR" value="UTR" />
                  <Picker.Item label="HR" value="HR" />
                  <Picker.Item label="SER" value="SER" />
                  <Picker.Item label="20SER" value="20SER" />
                  <Picker.Item label="PSER" value="PSER" />
                </Picker>
              </View>
            </View>
            <View style={{  marginBottom: 10 }}>
            <View>
                <Text style={styles.label}>系列号</Text>
                <Picker
                  selectedValue={version}
                  onValueChange={(val) => setVersion(val)}
                >
                  <Picker.Item label="ALIN(1208)人合智能" value="1208" />
                  <Picker.Item label="SUDA(1207)至霸深暗" value="1207" />
                  <Picker.Item label="ROTA(1206)深渊狂怒" value="1206" />
                  <Picker.Item label="INFO(1205)无限封印" value="1205" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>商品类别</Text>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.optionBtn, cardType === "ungraded" && styles.selectedBtn]}
                onPress={() => setCardType("ungraded")}
              >
                <Text>非评级卡</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionBtn, cardType === "graded" && styles.selectedBtn]}
                onPress={() => setCardType("graded")}
              >
                <Text>评级卡</Text>
              </TouchableOpacity>
            </View>

            {cardType === "ungraded" ? (
              <View>
                <Text style={styles.label}>品相</Text>
                <Picker
                  selectedValue={condition}
                  onValueChange={(val) => setCondition(val)}
                >
                  <Picker.Item label="流通品相" value="流通品相" />
                  <Picker.Item label="有瑕疵" value="有瑕疵" />
                  <Picker.Item label="有损伤" value="有损伤" />
                </Picker>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>评级公司</Text>
                <Picker
                  selectedValue={gradingCompany}
                  onValueChange={(val) => setGradingCompany(val)}
                >
                  <Picker.Item label="PSA" value="PSA" />
                  <Picker.Item label="BGS" value="BGS" />
                  <Picker.Item label="CGC" value="CGC" />
                  <Picker.Item label="其他" value="其他" />
                </Picker>

                <Text style={styles.label}>卡牌评分</Text>
                <Picker
                  selectedValue={gradingScore}
                  onValueChange={(val) => setGradingScore(val)}
                >
                  {[...Array(19)].map((_, i) => {
                    const value = (1 + i * 0.5).toFixed(1);
                    return <Picker.Item key={value} label={value} value={value} />;
                  })}
                </Picker>

                <Text style={styles.label}>评级编号</Text>
                <TextInput
                  style={styles.input}
                  value={gradingNumber}
                  onChangeText={setGradingNumber}
                  placeholder="请输入编号"
                />
              </View>
            )}
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

            {cardType === "ungraded" && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>库存数量</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                  <Text style={{ marginHorizontal: 20 }}>{quantity}</Text>
                  <Button title="+" onPress={() => setQuantity(quantity + 1)} />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 底部固定按钮 */}
        <View style={styles.fixedBottom}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleRegister()}>
            <Text style={styles.addBtnText}>添加</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

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

export default Register;
