import React, { FunctionComponent } from 'react';

interface NotificationProps {
  type: 'success' | 'warning' | 'error';
  text: string;
}

const Notification: FunctionComponent<NotificationProps> = ({ type, text }) => {
  const getNotificationClass = () => {
    switch (type) {
      case 'success':
        return 'success-notification';
      case 'warning':
        return 'warning-notification';
      case 'error':
        return 'error-notification';
      default:
        return 'default-notification';
    }
  };

  return (
    <div className={`notification ${getNotificationClass()}`}>
      {text}
    </div>
  );
};

export default Notification;
