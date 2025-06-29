import { useGlobalContext } from '@/context/GlobalContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getItemsByUserID } from '../lib/item';

const Tab = createMaterialTopTabNavigator();
type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: { rarity: string; series: string }) => void;
};
const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [rarity, setRarity] = useState('');
  const [series, setSeries] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>选择罕贵度</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity onPress={() => setRarity('N')}><Text style={styles.option}>N</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setRarity('SR')}><Text style={styles.option}>SR</Text></TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>选择系列号</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity onPress={() => setSeries('001')}><Text style={styles.option}>001</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setSeries('002')}><Text style={styles.option}>002</Text></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onApply({ rarity, series })}>
            <Text style={styles.applyBtn}>应用</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelBtn}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface ItemListProps {
  status: string;
  filter: { rarity: string; series: string };
}

const ItemList: React.FC<ItemListProps> = ({ status, filter }) => {
  const { user } = useGlobalContext();
  interface Item {
    id: number;
    cardName: string;
    number: string;
    price?: number;
    status: string;
    rarity: string;
    series: string;
    imageUrl:string
  }
  
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false); 
  const fetchData = async () => {
    console.log("已调用fetchitem")
    const allItems = await getItemsByUserID(user?.id||'2');
    console.log(allItems.data)
    const filtered = allItems.data.filter(
      (item: { status: string; rarity: string; series: string; }) => 
        item.status === status 
        &&(filter.rarity==='' || item.rarity === filter.rarity) 
        &&(filter.series==='' || item.series === filter.series)
    );
    console.log(filtered)
    setItems(filtered);
  };
  const handleRefresh = async () => {
    setRefreshing(true);       
    await fetchData();        
    setRefreshing(false);     
  };
  useEffect(() => {
    fetchData();
  }, [status, filter]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}       
        onRefresh={handleRefresh} 
        renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push(`/item/${item.id}`as any)} 
              style={styles.itemContainer}
              activeOpacity={0.8}
            >
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
      
          <View style={styles.middleSection}>
            <Text style={styles.cardName}>{item.cardName}</Text>
            <View style={styles.subInfo}>
              <Text style={styles.series}>{item.series}</Text>
              <Text style={styles.rarity}>{item.rarity}</Text>
            </View>
          </View>
      
          <View style={styles.rightSection}>
            <Text style={styles.price}>¥{item.price?.toFixed(2) ?? 0}</Text>
            <Text style={styles.number}>×{item.number}</Text>
          </View>
       </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/item/searchItem')}>
        <Text style={styles.addBtnText}>添加商品</Text>
      </TouchableOpacity>
    </View>
  );
};

interface ItemTabsProps {
  filter: { rarity: string; series: string };
}

const ItemTabs: React.FC<ItemTabsProps> = ({ filter }) => (
  <Tab.Navigator>
    <Tab.Screen name="已上架">
      {() => <ItemList status="on" filter={filter} />}
    </Tab.Screen>
    <Tab.Screen name="待上架">
      {() => <ItemList status="off" filter={filter} />}
    </Tab.Screen>
    <Tab.Screen name="已售罄">
      {() => <ItemList status="sold" filter={filter} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const Main = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState({ rarity: '', series: '' });
  const navigation = useNavigation();
  

  useEffect(() => {
    navigation.setOptions({ title: '商品管理' });
  }, [navigation]);
  return (
    <View style={{ flex: 1 }}>
     
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('批量操作')}>
          <Text>批量操作</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setFilterVisible(true)}>
          <Text>筛选</Text>
        </TouchableOpacity>
      </View>

      <ItemTabs filter={filter} />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(selected) => {
          setFilter(selected);
          setFilterVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: 'green',
    padding: 12,
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  option: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  applyBtn: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
  cancelBtn: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 60,
    height: 90,
    marginRight: 10,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  series: {
    fontSize: 14,
    color: '#666',
  },
  rarity: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4f',
  },
  number: {
    fontSize: 14,
    color: '#555',
  },
});

export default Main;
