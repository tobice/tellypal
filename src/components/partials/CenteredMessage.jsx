/** @jsx React.DOM */
var React = require('react');

var Bootstrap = require('react-bootstrap');
var Well = Bootstrap.Well;

var CenteredMessage = React.createClass({
    render: function () {
        return (
            <Well>
                <div className="text-muted text-center">
                    {this.props.children}
                </div>
            </Well>
        );
    }
});

module.exports = CenteredMessage;