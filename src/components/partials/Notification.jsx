/** @jsx React.DOM */

var React = require('react');
var Bootstrap = require('react-bootstrap');
var Alert = Bootstrap.Alert;
var NotificationStore = require('../../stores/NotificationStore');
var notificationActions = require('../../actions/notificationActions');

var Notification = React.createClass({
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    handleAlertDismiss: function () {
        this.flux.executeAction(notificationActions.dismiss, this.props.notification.id);
    },

    render: function () {
        var notification = this.props.notification;
        return (
            <div className="notification">
                <Alert bsStyle={notification.type} onDismiss={this.handleAlertDismiss}>
                    <h4>{this.renderIcon()} {notification.title}</h4>{' '}
                    {notification.message}
                </Alert>
            </div>
        )
    },

    renderIcon: function () {
        var notification = this.props.notification;
        var className = "fa fa-fw fa-" + this.getIconType(notification.type);
        return <i className={className} />;

    },

    getIconType: function (type) {
        switch (type) {
            case NotificationStore.SUCCESS: return "check";
            case NotificationStore.DANGER: return "times";
            case NotificationStore.WARNING: return "warning";
            case NotificationStore.INFO:
            default:
                return "info-circle";
        }
    }


});

module.exports = Notification;