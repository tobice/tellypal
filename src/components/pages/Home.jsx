/** @jsx React.DOM */
var React = require('react');
var TorrentClient = require('../partials/TorrentClient.jsx');
var FinishedDownloadJobs = require('../partials/FinishedDownloadJobs.jsx');
var Icon = require('../partials/Icon.jsx');

var Home = React.createClass({

    render: function () {
        return (
            <div>
                <h1 className="border-bottom">Downloading</h1>
                <TorrentClient />

                <h3 className="border-bottom">Last finished downloads</h3>
                <FinishedDownloadJobs />
            </div>
        );
    }
});

module.exports = Home;
