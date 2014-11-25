/** @jsx React.DOM */
var React = require('react');
var TorrentClient = require('../partials/TorrentClient.jsx');

var Home = React.createClass({

    render: function () {
        return (
            <div>
                <h1>Home</h1>
                <hr />
                <TorrentClient />
            </div>
        );
    }
});

module.exports = Home;
