import areaDataRaw from '@/assets/data/pca.json';
import { useGlobalContext } from "@/context/GlobalContext";
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getAddressByID, updateAddress } from "../lib/address";
type AreaData = {
  [province: string]: {
    [city: string]: string[];
  };
};

const areaData = areaDataRaw as AreaData;

const Edit = () => {
  const { id } = useLocalSearchParams();
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detailed, setDetailed] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const {user} =useGlobalContext();
  const navigation =useNavigation();
  const cityList = province ? Object.keys(areaData[province]) : [];

  const districtList = province && city ? areaData[province][city] : [];

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity('');
    setDistrict('');
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict('');
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
  };

  const handleSave = async() => {
    if (!receiverName || !phone || !province || !city || !district || !detailed) {
      alert('请完整填写所有字段');
      return;
    }
    if(!user){
      return;
    }
    const fullRegion = `${province},${city},${district}`;
    console.log('fullRegion:', fullRegion);
    const payload = {
      receiverName,
      phone,
      region: fullRegion,
      detailed,
      isDefault,
      userID: user.id,
    };
    console.log('保存地址数据:', payload);
    try {
      await updateAddress(Number(id),Number(user.id), receiverName, phone, fullRegion, detailed, isDefault);
      alert('地址已保存');
      router.back();
    } catch (error) {
      alert('编辑失败');
    }
    
  };

    useEffect(() => {
        const fetchAddresses = async () => {
            const response =await getAddressByID(id as string);
            console.log('response:', response);
            setReceiverName(response.data.receiverName);
            setPhone(response.data.phone);
            setProvince(response.data.region.split(',')[0]);
            setCity(response.data.region.split(',')[1]);
            setDistrict(response.data.region.split(',')[2]);
            setDetailed(response.data.detailed);
            setIsDefault(response.data.isDefault);
   }
    navigation.setOptions({ title: "编辑地址" });
   fetchAddresses();
  }, [id]);

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={styles.label}>收件人</Text>
      <TextInput
        style={styles.input}
        value={receiverName}
        onChangeText={setReceiverName}
        placeholder="请输入收件人姓名"
      />

      <Text style={styles.label}>手机号码</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="请输入手机号码"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>所在地区</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: '选择省份', value: '' }}
          onValueChange={handleProvinceChange}
          items={Object.keys(areaData).map((prov) => ({ label: prov, value: prov }))}
          value={province}
        />
        <RNPickerSelect
          placeholder={{ label: '选择城市', value: '' }}
          onValueChange={handleCityChange}
          items={cityList.map((c) => ({ label: c, value: c }))}
          value={city}
          disabled={!province}
        />
        <RNPickerSelect
          placeholder={{ label: '选择区县', value: '' }}
          onValueChange={handleDistrictChange}
          items={districtList.map((d) => ({ label: d, value: d }))}
          value={district}
          disabled={!city}
        />
      </View>

      <Text style={styles.label}>详细地址</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={detailed}
        onChangeText={setDetailed}
        placeholder="街道、门牌号等"
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>设为默认地址</Text>
        <Switch
          value={isDefault}
          onValueChange={setIsDefault}
          trackColor={{ false: '#ccc', true: '#007AFF' }}
          thumbColor={isDefault ? '#007AFF' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 6,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
