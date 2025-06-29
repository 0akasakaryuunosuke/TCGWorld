import { useGlobalContext } from '@/context/GlobalContext';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteAddress, getAllAddress } from '../lib/address';

interface Address {
  id: number;
  userID: number;
  receiverName: string;
  phone: string;
  region: string;
  detailed: string;
  isDefault: boolean;
}

const Manager = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { user } = useGlobalContext();

    const fetchAddresses = async () => {
     if(user)
     { const res = await getAllAddress(user.id);
      setAddresses(res.data || []);}
    };
    useFocusEffect(
    useCallback(() => {
       navigation.setOptions({ title: "地址管理" });
      fetchAddresses();
    }, [user])
  );

  const defaultAddress = addresses.find((a) => a.isDefault);
  const otherAddresses = addresses.filter((a) => !a.isDefault);

  const handleEdit = (id: number) => {
   router.push(`/address/${id}`);
  };


  const handleDelete  =async(id:number) =>{
    Alert.alert('确认删除？','',
      [
        {text:'取消',onPress:()=>{}},
        {text:'确认',onPress :async () =>{
              try {
          await deleteAddress(id.toString());
          fetchAddresses();
        } catch (error) {
          console.error('删除购物车失败:', error);
          Alert.alert('删除失败', error instanceof Error ? error.message : String(error));
        }}}
      ]
    )
  }



  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <ScrollView>

        {defaultAddress && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>默认地址</Text>
            <TouchableOpacity style={styles.card} onPress={() => handleEdit(defaultAddress.id)}>
              <Text style={styles.name}>{defaultAddress.receiverName}  {defaultAddress.phone}</Text>
              <Text style={styles.address}>{defaultAddress.region} {defaultAddress.detailed}</Text>
              <Text style={styles.default}>默认</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>地址</Text>
          {otherAddresses.map((addr) => (
            <TouchableOpacity key={addr.id} style={styles.card} onPress={() => handleEdit(addr.id)}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{addr.receiverName}  {addr.phone}</Text>
                <TouchableOpacity onPress={() => handleDelete(addr.id)}>
                  <Text style={styles.delete}>删除</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.address}>{addr.region} {addr.detailed}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/address/add')}
      >
        <Text style={styles.addButtonText}>新增地址</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Manager;

const styles = StyleSheet.create({
  panel: {
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  default: {
    marginTop: 6,
    color: '#d23f31',
    fontWeight: 'bold',
  },
  rowBetween: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
  delete: {
    color: '#d23f31',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
