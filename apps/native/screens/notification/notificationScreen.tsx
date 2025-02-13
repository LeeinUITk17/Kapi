import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import NotificationItem from '~/components/NotificationItem';
import axiosInstance from '~/helper/axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) throw new Error('User not authenticated');

        const response = await axiosInstance.get(`/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data as Notification[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Failed to fetch notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('User not authenticated');

      await axiosInstance.put(
        `/notifications/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
      Alert.alert('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Failed to mark notification as read');
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem notification={item} onMarkAsRead={markAsRead} />
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f1aa6a]">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f1aa6a] p-4">
      <Text className="mb-4 text-2xl font-bold">Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No notifications available.</Text>}
      />
    </View>
  );
};

export default NotificationScreen;
