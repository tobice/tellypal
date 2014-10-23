/** @jsx React.DOM */
var React = require('react');
var Grid = require('react-bootstrap').Grid;

var Loading = React.createClass({
    render: function () {
        return (
            <Grid className="text-muted">
                <i className="fa fa-spin fa-spinner"></i> Loading...
            </Grid>
        );
    }
});

module.exports = Loading;