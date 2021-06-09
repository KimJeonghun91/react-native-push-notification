declare module "react-native-push-notification" {

  // Type definitions for react-native-push-notification 7.2
  // Project: https://github.com/zo0r/react-native-push-notification#readme
  // Definitions by: Paito Anderson <https://github.com/PaitoAnderson>
  //                 Tom Sawkins <https://github.com/tomSawkins>
  //                 Andrew Li <https://github.com/Li357>
  //                 Clément Rucheton <https://github.com/rucheton>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 3.5


  export type ContentAvailable = 1 | null | void;

  export type FetchResult = {
    NewData: string,
    NoData: string,
    ResultFailed: string,
  };

  export type AuthorizationStatus = {
    UNAuthorizationStatusNotDetermined: 0,
    UNAuthorizationStatusDenied: 1,
    UNAuthorizationStatusAuthorized: 2,
    UNAuthorizationStatusProvisional: 3,
  };

  /**
   * An event emitted by PushNotificationIOS.
   */
  export type PushNotificationEventName = {
    /**
     * Fired when a remote notification is received. The handler will be invoked
     * with an instance of `PushNotificationIOS`.
     */
    notification: string,
    /**
     * Fired when a local notification is received. The handler will be invoked
     * with an instance of `PushNotificationIOS`.
     */
    localNotification: string,
    /**
     * Fired when the user registers for remote notifications. The handler will be
     * invoked with a hex string representing the deviceToken.
     */
    register: string,
    /**
     * Fired when the user fails to register for remote notifications. Typically
     * occurs when APNS is having issues, or the device is a simulator. The
     * handler will be invoked with {message: string, code: number, details: any}.
     */
    registrationError: string,
  };

  export type NotificationRequest = {
    /**
     * identifier of the notification.
     * Required in order to retrieve specific notification.
     */
    id: string,
    /**
     * A short description of the reason for the alert.
     */
    title?: string,
    /**
     * A secondary description of the reason for the alert.
     */
    subtitle?: string,
    /**
     * The message displayed in the notification alert.
     */
    body?: string,
    /**
     * The number to display as the app's icon badge.
     */
    badge?: number,
    /**
     * The sound to play when the notification is delivered.
     */
    sound?: string,
    /**
     * The category of this notification. Required for actionable notifications.
     */
    category?: string,
    /**
     * The thread identifier of this notification.
     */
    threadId?: string,
    /**
     * The date which notification triggers.
     */
    fireDate?: Date,
    /**
     * Sets notification to repeat daily.
     * Must be used with fireDate.
     */
    repeats?: boolean,
    /**
     * Sets notification to be silent
     */
    isSilent?: boolean,
    /**
     * Optional data to be added to the notification
     */
    userInfo?: Object,
  };

  /**
   * Alert Object that can be included in the aps `alert` object
   */
  export type NotificationAlert = {
    title?: string,
    subtitle?: string,
    body?: string,
  };

  /**
   * Notification Category that can include specific actions
   */
  export type NotificationCategory = {
    /**
     * Identifier of the notification category.
     * Notification with this category will have the specified actions.
     */
    id: string,
    actions: NotificationAction[],
  };



  /**
   * Notification Action that can be added to specific categories
   */
  export type NotificationAction = {
    /**
     * Identifier of Action.
     * This value will be returned as actionIdentifier when notification is received.
     */
    id: string,
    /**
     * Text to be shown on notification action button.
     */
    title: string,
    /**
     * Option for notification action.
     */
    options?: {
      foreground?: boolean,
      destructive?: boolean,
      authenticationRequired?: boolean,
    },
    /**
     * Option for textInput action.
     * If textInput prop exists, then user action will automatically become a text input action.
     * The text user inputs will be in the userText field of the received notification.
     */
    textInput?: {
      /**
       * Text to be shown on button when user finishes text input.
       * Default is "Send" or its equivalent word in user's language setting.
       */
      buttonTitle?: string,
      /**
       * Placeholder for text input for text input action.
       */
      placeholder?: string,
    },
  };



  export interface PushNotificationPermissions {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
  }

  export interface ReceivedNotification {
    foreground: boolean;
    userInteraction: boolean;
    message: string | object;
    data: Record<string, any>;
    userInfo: Record<string, any>;
    subText?: string;
    badge: number;
    alert: object;
    sound: string;
    id: number;
    action?: string;
    finish: (fetchResult: string) => void;
  }

  export interface PushNotificationOptions {
    onRegister?: (token: { os: string; token: string }) => void;
    onNotification?: (notification: Omit<ReceivedNotification, "userInfo">) => void;
    onAction?: (notification: ReceivedNotification) => void;
    onRegistrationError?: (error: any) => void;
    onRemoteFetch?: (notificationData: any) => void;
    permissions?: PushNotificationPermissions;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  export class PushNotificationObject {
    /* Android only properties */
    ticker?: string;
    showWhen?: boolean;
    autoCancel?: boolean;
    largeIcon?: string;
    largeIconUrl?: string;
    smallIcon?: string;
    bigText?: string;
    subText?: string;
    bigPictureUrl?: string;
    bigLargeIcon?: string;
    bigLargeIconUrl?: string;
    color?: string;
    vibrate?: boolean;
    vibration?: number;
    tag?: string;
    group?: string;
    groupSummary?: boolean;
    ongoing?: boolean;
    priority?: "max" | "high" | "low" | "min" | "default";
    visibility?: "private" | "public" | "secret";
    importance?: "default" | "max" | "high" | "low" | "min" | "none" | "unspecified";
    ignoreInForeground?: boolean;
    shortcutId?: string;
    channelId?: string;
    onlyAlertOnce?: boolean;
    allowWhileIdle?: boolean;
    timeoutAfter?: number | null;
    messageId?: string;

    when?: number | null;
    usesChronometer?: boolean;

    actions?: string[];
    invokeApp?: boolean;

    /* iOS only properties */
    category?: any;

    /* iOS and Android properties */
    id?: number;
    title?: string;
    message: string;
    userInfo?: any;
    playSound?: boolean;
    soundName?: string;
    number?: string | number;
    repeatType?: "week" | "day" | "hour" | "minute" | "time";
    repeatTime?: number;
  }

  export class PushNotificationScheduleObject extends PushNotificationObject {
    date: Date;
    allowWhileIdle?: boolean;
  }

  export class PushNotificationDeliveredObject {
    identifier: string;
    title: string;
    body: string;
    tag: string;
    group: string;
    category?: string;
    userInfo?: any;
  }

  export class PushNotificationScheduledLocalObject {
    id: number;
    date: Date;
    title: string;
    body: string;
    soundName: string;
    repeatInterval: number;
    number: number;
    data: Record<string, any>;
  }

  export class ChannelObject {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    soundName?: string;
    importance?: number;
    vibrate?: boolean;
    playSound?: boolean;
  }

  export interface PushNotification {
    configure(options: PushNotificationOptions): void;
    unregister(): void;
    localNotification(notification: PushNotificationObject): void;
    localNotificationSchedule(notification: PushNotificationScheduleObject): void;
    requestPermissions(permissions?: Array<"alert" | "badge" | "sound">): Promise<PushNotificationPermissions>;
    subscribeToTopic(topic: string): void;
    unsubscribeFromTopic(topic: string): void;
    presentLocalNotification(notification: PushNotificationObject): void;
    scheduleLocalNotification(notification: PushNotificationScheduleObject): void;
    cancelLocalNotifications(details: { id: string }): void;
    clearLocalNotification(tag: string, notificationID: number): void;
    cancelAllLocalNotifications(): void;
    setApplicationIconBadgeNumber(badgeCount: number): void;
    getApplicationIconBadgeNumber(callback: (badgeCount: number) => void): void;
    popInitialNotification(callback: (notification: ReceivedNotification | null) => void): void;
    abandonPermissions(): void;
    checkPermissions(callback: (permissions: PushNotificationPermissions) => void): void;
    clearAllNotifications(): void;
    removeAllDeliveredNotifications(): void;
    getDeliveredNotifications(callback: (notifications: PushNotificationDeliveredObject[]) => void): void;
    getScheduledLocalNotifications(callback: (notifications: PushNotificationScheduledLocalObject[]) => void): void;
    removeDeliveredNotifications(identifiers: string[]): void;
    invokeApp(notification: PushNotificationObject): void;
    getChannels(callback: (channel_ids: string[]) => void): void;
    channelExists(channel_id: string, callback: (exists: boolean) => void): void;
    createChannel(channel: ChannelObject, callback: (created: boolean) => void): void;
    channelBlocked(channel_id: string, callback: (blocked: boolean) => void): void;
    deleteChannel(channel_id: string): void;
  }

  export default PushNotification;
}
