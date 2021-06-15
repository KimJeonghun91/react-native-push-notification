'use strict';

import { NativeModules, DeviceEventEmitter } from "react-native";

let RNPushNotification = NativeModules.ReactNativePushNotification;
let _notifHandlers = new Map();

var DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
var NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
var NOTIF_ACTION_EVENT = 'notificationActionReceived';
var REMOTE_FETCH_EVENT = 'remoteFetch';

class NotificationsComponent {
  static getInitialNotification() {
    return RNPushNotification.getInitialNotification()
      .then(function (notification) {
        if (notification && notification.dataJSON) {
          return JSON.parse(notification.dataJSON);
        }
        return null;
      });
  }

  static requestPermissions() {
    RNPushNotification.requestPermissions();
  }

  static subscribeToTopic(topic) {
    RNPushNotification.subscribeToTopic(topic);
  }

  static unsubscribeFromTopic(topic) {
    RNPushNotification.unsubscribeFromTopic(topic);
  }

  static cancelLocalNotifications(details) {
    RNPushNotification.cancelLocalNotifications(details);
  }

  static clearLocalNotification(details, tag) {
    RNPushNotification.clearLocalNotification(details, tag);
  }

  static cancelAllLocalNotifications() {
    RNPushNotification.cancelAllLocalNotifications();
  }

  static presentLocalNotification(details) {
    RNPushNotification.presentLocalNotification(details);
  }

  static scheduleLocalNotification(details) {
    RNPushNotification.scheduleLocalNotification(details);
  }

  static setApplicationIconBadgeNumber(number) {
    if (!RNPushNotification.setApplicationIconBadgeNumber) {
      return;
    }
    RNPushNotification.setApplicationIconBadgeNumber(number);
  }
  static checkPermissions(callback) {
    RNPushNotification.checkPermissions().then(alert => callback({ alert }));
  }
  addEventListener(type, handler) {
    let listener;
    if (type === 'notification') {
      listener = DeviceEventEmitter.addListener(
        DEVICE_NOTIF_EVENT,
        function (notifData) {
          if (notifData && notifData.dataJSON) {
            let data = JSON.parse(notifData.dataJSON);
            handler(data);
          }
        }
      );
    } else if (type === 'register') {
      listener = DeviceEventEmitter.addListener(
        NOTIF_REGISTER_EVENT,
        function (registrationInfo) {
          handler(registrationInfo.deviceToken);
        }
      );
    } else if (type === 'remoteFetch') {
      listener = DeviceEventEmitter.addListener(
        REMOTE_FETCH_EVENT,
        function (notifData) {
          if (notifData && notifData.dataJSON) {
            let notificationData = JSON.parse(notifData.dataJSON);
            handler(notificationData);
          }
        }
      );
    } else if (type === 'action') {
      listener = DeviceEventEmitter.addListener(
        NOTIF_ACTION_EVENT,
        function (actionData) {
          if (actionData && actionData.dataJSON) {
            var action = JSON.parse(actionData.dataJSON);
            handler(action);
          }
        }
      );
    }

    _notifHandlers.set(type, listener);
  }

  static removeEventListener(type, handler) {
    let listener = _notifHandlers.get(type);
    if (!listener) {
      return;
    }
    listener.remove();
    _notifHandlers.delete(type);
  }

  static registerNotificationActions(details) {
    RNPushNotification.registerNotificationActions(details);
  }

  static clearAllNotifications() {
    RNPushNotification.clearAllNotifications();
  }

  static removeAllDeliveredNotifications() {
    RNPushNotification.removeAllDeliveredNotifications();
  }

  static getDeliveredNotifications(callback) {
    RNPushNotification.getDeliveredNotifications(callback);
  }

  static getScheduledLocalNotifications(callback) {
    RNPushNotification.getScheduledLocalNotifications(callback);
  }

  static removeDeliveredNotifications(identifiers) {
    RNPushNotification.removeDeliveredNotifications(identifiers);
  }

  static abandonPermissions() {
    RNPushNotification.abandonPermissions();
  }

  static invokeApp(data) {
    RNPushNotification.invokeApp(data);
  }

  static getChannels(callback) {
    RNPushNotification.getChannels(callback);
  }

  static channelExists(channel_id, callback) {
    RNPushNotification.channelExists(channel_id, callback);
  }

  static createChannel(channelInfo, callback) {
    RNPushNotification.createChannel(channelInfo, callback);
  }

  static channelBlocked(channel_id, callback) {
    RNPushNotification.channelBlocked(channel_id, callback);
  }

  static deleteChannel(channel_id) {
    RNPushNotification.deleteChannel(channel_id);
  }
}

module.exports = {
  component: NotificationsComponent
};

