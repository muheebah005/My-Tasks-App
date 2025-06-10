import React from 'react';
import * as Notification from "expo-notifications";
import * as Device from "expo-device";


Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notification.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notification.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for notifications!');
      return;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
}

export async function scheduleTaskNotification(taskText) {
  const trigger = {
    type: 'date',              
    date: new Date(Date.now() + 60 * 1000), 
  };

  console.log('Scheduling notification for:', taskText, 'at', trigger.date);

  const notificationId = await Notification.scheduleNotificationAsync({
    content: {
      title: "Task Reminder",
      body: `Time to complete: ${taskText}`,
      sound: true,
    },
    trigger,
  });

  console.log('Notification scheduled with ID:', notificationId);
  return notificationId;
}

export async function cancelNotification(notificationId) {
  if (notificationId) {
    await Notification.cancelScheduledNotificationAsync(notificationId);
  }
}
