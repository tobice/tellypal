/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <i className={'fa fa-' + this.props.type + (this.props.spin ? ' fa-spin' : '')} />
        )
    }
});