import { useEffect, useState } from "react";
import { notificationData } from "../data/navigationData";

export function useNotifications(role) {
  const [notificationItems, setNotificationItems] = useState([]);

  useEffect(() => {
    setNotificationItems(notificationData[role] || []);
  }, [role]);

  const unreadCount = notificationItems.filter(
    (notification) => notification.unread,
  ).length;

  const markAllAsRead = () => {
    setNotificationItems((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const markAsRead = (id) => {
    setNotificationItems((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  return {
    notificationItems,
    unreadCount,
    markAllAsRead,
    markAsRead,
  };
}