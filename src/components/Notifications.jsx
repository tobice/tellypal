/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var TimeoutTransitionGroup = require('./partials/TimeoutTransitionGroup.jsx');
var Bootstrap = require('react-bootstrap');
var FluxMixin = require('../utils/FluxMixin');
var NotificationStore = require('../stores/NotificationStore');
var Notification = require('./partials/Notification.jsx');
var notificationActions = require('../actions/notificationActions');


var Notifications = React.createClass({
    mixins: [FluxMixin],

    getStateFromStores: function () {
        var store = this.getStore(NotificationStore.storeName);
        var notifications = store.getNotifications();

        // Get new notifications that haven't been displayed yet and mark them
        // as showing. Since action 'markAsShowing' would trigger another
        // update of the store, we have to postpone it until current stack
        // is finished.
        _.defer(function () {
            var newNotifications = _.where(notifications, {status: NotificationStore.NEW});
            this.executeAction(notificationActions.markAsShowing, newNotifications);
        }.bind(this));

        return { notifications: notifications }
    },

    getStoresToListenTo: function () {
        return [NotificationStore.storeName];
    },

    initStores: function () { },

    render: function () {
        // console.log(this.state.notifications);
        return (
            <div className="notifications">
                <TimeoutTransitionGroup
                    enterTimeout={500} leaveTimeout={500}
                    transitionName="show">
                    {_.map(this.state.notifications, function (notification) {
                        return <Notification notification={notification} key={notification.id}/>
                    }.bind(this))}
                </TimeoutTransitionGroup>
            </div>);
    }
});

module.exports = Notifications;