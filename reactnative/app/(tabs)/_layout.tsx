import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import 'nativewind';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

export default function TabLayoutWrapper() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option: string) => {
    setModalVisible(false);
   
    if(option==='option1'){
      console.log("1")
      router.push('/add')
      return
    }
    if(option==='option2'){
      console.log("2")
      router.push('../item/main')
      return
    }
  };

  return (
    <>
      <TabLayout onAddPress={() => setModalVisible(true)} />
      <AddMenuModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
      />
    </>
  );
}

// 分离主 Tabs 定义，使其可以接收自定义 props
function TabLayout({ onAddPress }: { onAddPress: () => void }) {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '主页',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index_all"
        options={{
          title: 'All',
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="index_follow"
        options={{
          title: 'Follow',
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
          <Tabs.Screen
        name="discover"
        options={{
          title: 'discover',
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
  name="add"
  options={{
    title: 'Add',
    tabBarButton: (props) => (
      <TouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.7}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -20, 
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            backgroundColor: '#2ecc71',
            borderRadius: 35,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5, 
          }}
        >
          <Text style={{ color: 'white', fontSize: 32 }}>+</Text>
        </View>
      </TouchableOpacity>
    ),
    tabBarLabelStyle: {
      display: 'none',
    },
  }}
/>
      <Tabs.Screen
        name="profile"
        options={{
          title: '个人资料',
          tabBarIcon: ({ color }) => (
           <MaterialCommunityIcons name="account" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}

function AddMenuModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onSelect('option1')}
            >
              <Text style={styles.menuText}>发布动态</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onSelect('option2')}
            >
              <Text style={styles.menuText}>出售商品</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onSelect('option3')}
            >
              <Text style={styles.menuText}>To Be Continued....</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  modalContainer: {
    position: 'absolute',
    bottom: 100, // 离底部 tab 一定距离
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  modalContent: {
    width: 200,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
