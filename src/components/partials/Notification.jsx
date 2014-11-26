/** @jsx React.DOM */

var React = require('react');
var Bootstrap = require('react-bootstrap');
var Alert = Bootstrap.Alert;
var notificationActions = require('../../actions/notificationActions');
var consts = require('../../consts');

var Notification = React.createClass({
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    handleAlertDismiss: function () {
        this.context.flux.executeAction(notificationActions.dismiss, this.props.notification.id);
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
            case consts.SUCCESS: return "check";
            case consts.DANGER: return "times";
            case consts.WARNING: return "warning";
            case consts.INFO:
            default:
                return "info-circle";
        }
    }
});

module.exports = Notification;