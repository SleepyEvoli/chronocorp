import {defineStore} from 'pinia';
import {EventNotification} from '@/interfaces';
import {ref, watch} from 'vue';

export const useEventStore = defineStore('event', () => {

    const eventNotifications = ref<EventNotification[]>([]);
    const maxNotifications = 10;
    const notificationTimeout = 2500;
    const notificationQueue = ref<EventNotificationQueueItem[]>([]);

    interface EventNotificationQueueItem {
        notification: EventNotification;
        timeout: NodeJS.Timeout;
    }

    watch(eventNotifications.value, () => {
        while (eventNotifications.value.length > maxNotifications) {
            eventNotifications.value.shift();
        }
    }, {deep: true});

    const createEventNotification = (title: string, body = ''): void => {
        const notification = {
            id: new Date().getTime().toString(),
            title: title,
            body: body,
            dateTime: new Date(),
        };

        eventNotifications.value.push(notification);
        addToNotificationQueue({
            notification: notification,
            timeout: setTimeout(() => {
                notificationQueue.value = notificationQueue.value.filter((n) => n.notification.id !== notification.id);
            }, notificationTimeout),
        });
    };

    const removeFromNotificationQueue = (id: string): void => {
        notificationQueue.value = notificationQueue.value.filter((n) => n.notification.id !== id);
    };

    const addToNotificationQueue = (notification: EventNotificationQueueItem): void => {
        notificationQueue.value.push(notification);
    };

    return {
        eventNotifications,
        notificationQueue,
        notificationTimeout,
        maxNotifications,
        createEventNotification,
        addToNotificationQueue,
        removeFromNotificationQueue,
    };
});
