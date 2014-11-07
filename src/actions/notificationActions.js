var _ = require('lodash');
var NotificationStore = require('../stores/NotificationStore');

notificationActions = {

    add: function (context, payload) {
        // Let's wait with the notification until the end of the current stack,
        // just for the sake of consistency (we've had some problems with
        // notification not disappearing properly, this might fix it)
        _.defer(function () {
            context.dispatch('NOTIFICATION_ADD', payload);
        });
    },

    dismiss: function (context, id) {
        context.dispatch('NOTIFICATION_SET_STATUS', {
            notifications: [id],
            status: NotificationStore.DISMISSED
        });
    },

    markAsShowing: function (context, notifications) {
        if (notifications.length == 0) {
            return;
        }

        // Mark notifications as showing
        context.dispatch('NOTIFICATION_SET_STATUS', {
            notifications: _.pluck(notifications, 'id'),
            status: NotificationStore.SHOWING
        });

        // Dismiss notifications after duration expires
        _.each(notifications, function (notification) {
            setTimeout(function () {
                context.dispatch('NOTIFICATION_SET_STATUS', {
                    notifications: [notification.id],
                    status: NotificationStore.DISMISSED
                });
            }, notification.duration)
        });
    }
};

module.exports = notificationActions;