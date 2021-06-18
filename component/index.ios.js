/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { NativeEventEmitter, NativeModules } from 'react-native';
import invariant from 'invariant';

const { RNPushNotification } = NativeModules;
const PushNotificationEmitter = new NativeEventEmitter(RNPushNotification);
const _notifHandlers = new Map();

const DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
const NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
const NOTIF_REGISTRATION_ERROR_EVENT = 'remoteNotificationRegistrationError';
const DEVICE_LOCAL_NOTIF_EVENT = 'localNotificationReceived';

/**
 *
 * Handle push notifications for your app, including permission handling and
 * icon badge number.
 *
 * See https://reactnative.dev/docs/pushnotificationios.html
 */
class NotificationsComponent {
  _data; // Object;
  _alert; // string | NotificationAlert;
  _title; // string;
  _subtitle; //  string;
  _sound; // string;
  _category; // string;
  _contentAvailable // ContentAvailable;
  _badgeCount; // number;
  _notificationId; // string;
  /**
   * The id of action the user has taken taken.
   */
  _actionIdentifier; // ?string;
  /**
   * The text user has input if user responded with a text action.
   */
  _userText; // ?string;
  _isRemote; // boolean;
  _remoteNotificationCompleteCallbackCalled; // boolean;
  _threadID; // string;
  _fireDate; // string | Date;

  /**
   * Schedules the localNotification for immediate presentation.
   */
  static presentLocalNotification(details) {
    RNPushNotification.presentLocalNotification(details);
  }

  /**
   * Schedules the localNotification for future presentation.
   */
  static scheduleLocalNotification(details) {
    RNPushNotification.scheduleLocalNotification(details);
  }

  /**
   * Sets notification category to notification center.
   * Used to set specific actions for notifications that contains specified category
   */
  static setNotificationCategories(categories) {
    RNPushNotification.setNotificationCategories(categories);
  }

  /**
   * Cancel all pending notifications
   */
  static cancelAllLocalNotifications() {
    RNPushNotification.cancelAllLocalNotifications();
  }

  /**
   * Cancel local notifications.
   */
  static cancelLocalNotifications(identifiers /* string[] */) {
    RNPushNotification.cancelAllLocalNotifications(identifiers);
  }

  /**
   * Remove all delivered notifications from Notification Center.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#removealldeliverednotifications
   */
  static removeAllDeliveredNotifications() {
    RNPushNotification.removeAllDeliveredNotifications();
  }

  /**
   * Provides you with a list of the app’s notifications that are still displayed in Notification Center.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getdeliverednotifications
   */
  static getDeliveredNotifications(callback /*  (notifications: Array<Object>) => void */) {
    RNPushNotification.getDeliveredNotifications(callback);
  }

  /**
   * Removes the specified notifications from Notification Center
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#removedeliverednotifications
   */
  static removeDeliveredNotifications(identifiers /* Array<string> */) {
    RNPushNotification.removeDeliveredNotifications(identifiers);
  }

  /**
   * Sets the badge number for the app icon on the home screen.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#setapplicationiconbadgenumber
   */
  static setApplicationIconBadgeNumber(number /* number */) {
    RNPushNotification.setApplicationIconBadgeNumber(number);
  }

  /**
   * Gets the current badge number for the app icon on the home screen.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getapplicationiconbadgenumber
   */
  static getApplicationIconBadgeNumber(callback /* Function */) {
    RNPushNotification.getApplicationIconBadgeNumber(callback);
  }

  /**
   * Gets the local notifications that are currently scheduled.
   * @deprecated - use `getPendingNotificationRequests`
   */
  static getScheduledLocalNotifications(callback /* Function */) {
    RNPushNotification.getScheduledLocalNotifications(callback);
  }

  /**
   * Gets the pending local notification requests.
   */
  static getPendingNotificationRequests(
    callback /* (requests: NotificationRequest[]) => void */
  ) {
    RNPushNotification.getPendingNotificationRequests(callback);
  }

  /**
   * Attaches a listener to remote or local notification events while the app
   * is running in the foreground or the background.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#addeventlistener
   */
  static addEventListener(type /* PushNotificationEventName */, handler /* Function */) {
    invariant(
      type === 'notification' ||
      type === 'register' ||
      type === 'registrationError' ||
      type === 'localNotification',
      'NotificationsComponent only supports `notification`, `register`, `registrationError`, and `localNotification` events',
    );
    let listener;

    if (type === 'notification') {
      listener = PushNotificationEmitter.addListener(
        DEVICE_NOTIF_EVENT,
        (notifData) => {
          handler(new NotificationsComponent(notifData));
        },
      );
    } else if (type === 'localNotification') {
      listener = PushNotificationEmitter.addListener(
        DEVICE_LOCAL_NOTIF_EVENT,
        (notifData) => {
          handler(new NotificationsComponent(notifData));
        },
      );
    } else if (type === 'register') {
      listener = PushNotificationEmitter.addListener(
        NOTIF_REGISTER_EVENT,
        (registrationInfo) => {
          handler(registrationInfo.deviceToken);
        },
      );
    } else if (type === 'registrationError') {
      listener = PushNotificationEmitter.addListener(
        NOTIF_REGISTRATION_ERROR_EVENT,
        (errorInfo) => {
          handler(errorInfo);
        },
      );
    }

    _notifHandlers.set(type, listener);
  }

  /**
   * Removes the event listener. Do this in `componentWillUnmount` to prevent
   * memory leaks.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#removeeventlistener
   */
  static removeEventListener(type /* PushNotificationEventName */) {
    invariant(
      type === 'notification' ||
      type === 'register' ||
      type === 'registrationError' ||
      type === 'localNotification',
      'NotificationsComponent only supports `notification`, `register`, `registrationError`, and `localNotification` events',
    );
    const listener = _notifHandlers.get(type);
    if (!listener) {
      return;
    }
    listener.remove();
    _notifHandlers.delete(type);
  }

  /**
   * Requests notification permissions from iOS, prompting the user's
   * dialog box. By default, it will request all notification permissions, but
   * a subset of these can be requested by passing a map of requested
   * permissions.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#requestpermissions
   */
  static requestPermissions(permissions) {
    return RNPushNotification.requestPermissions(permissions);
  }

  /**
   * Unregister for all remote notifications received via Apple Push Notification service.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#abandonpermissions
   */
  static abandonPermissions() {
    RNPushNotification.abandonPermissions();
  }

  /**
   * See what push permissions are currently enabled. `callback` will be
   * invoked with a `permissions` object.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#checkpermissions
   */
  static checkPermissions(callback /* Function */) {
    invariant(typeof callback === 'function', 'Must provide a valid callback');
    RNPushNotification.checkPermissions(callback);
  }

  /**
   * This method returns a promise that resolves to either the notification
   * object if the app was launched by a push notification, or `null` otherwise.
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getinitialnotification
   */
  static getInitialNotification() {
    return RNPushNotification.getInitialNotification().then(
      (notification) => {
        return notification && new NotificationsComponent(notification);
      },
    );
  }

  /**
   * Open App Settings
   */
  static openAppSettings() {
    RNPushNotification.openAppSettings();
  }

  /**
   * You will never need to instantiate `NotificationsComponent` yourself.
   * Listening to the `notification` event and invoking
   * `getInitialNotification` is sufficient
   *
   */
  constructor(nativeNotif /* Object */) {
    this._data = {};
    this._remoteNotificationCompleteCallbackCalled = false;
    this._isRemote = nativeNotif.remote;
    if (this._isRemote) {
      this._notificationId = nativeNotif.notificationId;
    }

    this._actionIdentifier = nativeNotif.actionIdentifier;
    this._userText = nativeNotif.userText;
    if (nativeNotif.remote) {
      // Extract data from Apple's `aps` dict as defined:
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html
      Object.keys(nativeNotif).forEach((notifKey) => {
        const notifVal = nativeNotif[notifKey];

        if (notifKey === 'aps') {
          this._alert = notifVal.alert;
          this._title = notifVal?.alertTitle;
          this._subtitle = notifVal?.subtitle;
          this._sound = notifVal.sound;
          this._badgeCount = notifVal.badge;
          this._category = notifVal.category;
          this._contentAvailable = notifVal['content-available'];
          this._threadID = notifVal['thread-id'];
          this._fireDate = notifVal.fireDate;
        } else {
          this._data[notifKey] = notifVal;
        }
      });
    } else {
      // Local notifications aren't being sent down with `aps` dict.
      // TODO: remove applicationIconBadgeNumber on next major version
      this._badgeCount =
        nativeNotif.badge || nativeNotif.applicationIconBadgeNumber;
      // TODO: remove soundName on next major version
      this._sound = nativeNotif.sound || nativeNotif.soundName;
      this._alert = nativeNotif.body;
      this._title = nativeNotif?.title;
      this._subtitle = nativeNotif?.subtitle;
      this._threadID = nativeNotif['thread-id'];
      this._data = nativeNotif.userInfo;
      this._category = nativeNotif.category;
      this._fireDate = nativeNotif.fireDate;
    }
  }

  /**
   * This method is available for remote notifications that have been received via:
   * `application:didReceiveRemoteNotification:fetchCompletionHandler:`
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#finish
   */
  finish(fetchResult /* string */) {
    if (
      !this._isRemote ||
      !this._notificationId ||
      this._remoteNotificationCompleteCallbackCalled
    ) {
      return;
    }
    this._remoteNotificationCompleteCallbackCalled = true;

    RNPushNotification.onFinishRemoteNotification(this._notificationId, fetchResult);
  }

  /**
   * An alias for `getAlert` to get the notification's main message string
   */
  getMessage() {
    if (typeof this._alert === 'object') {
      return this._alert?.body;
    }
    return this._alert;
  }

  /**
   * Gets the sound string from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getsound
   */
  getSound() {
    return this._sound;
  }

  /**
   * Gets the category string from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getcategory
   */
  getCategory() {
    return this._category;
  }

  /**
   * Gets the notification's main message from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getalert
   */
  getAlert() {
    return this._alert;
  }

  /**
   * Gets the notification's title from the `aps` object
   *
   */
  getTitle() {
    if (typeof this._alert === 'object') {
      return this._alert?.title;
    }
    return this._title;
  }

  /**
   * Gets the notification's subtitle from the `aps` object
   *
   */
  getSubtitle() {
    if (typeof this._alert === 'object') {
      return this._alert?.subtitle;
    }
    return this._subtitle;
  }

  /**
   * Gets the content-available number from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getcontentavailable
   */
  getContentAvailable() {
    return this._contentAvailable;
  }

  /**
   * Gets the badge count number from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getbadgecount
   */
  getBadgeCount() {
    return this._badgeCount;
  }

  /**
   * Gets the data object on the notif
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getdata
   */
  getData() {
    return this._data;
  }

  /**
   * Gets the thread ID on the notif
   *
   * See https://reactnative.dev/docs/pushnotificationios.html#getthreadid
   */
  getThreadID() {
    return this._threadID;
  }

  /**
   * Get's the action id of the notification action user has taken.
   */
  getActionIdentifier() {
    return this._actionIdentifier;
  }

  /**
   * Gets the text user has inputed if user has taken the text action response.
   */
  getUserText() {
    return this._userText;
  }
}

module.exports = {
  component: NotificationsComponent
};
