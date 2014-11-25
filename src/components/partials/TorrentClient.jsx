/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;

var FluxMixin = require('../../utils/FluxMixin');
var torrentActions = require('../../actions/torrentActions');
var notificationActions = require('../../actions/notificationActions');
var NotificationStore = require('../../stores/NotificationStore');
var TORRENTUI_STORE = require('../../stores/TorrentUIStore').storeName;

var TorrentJob = require('./TorrentJob.jsx');

var TorrentClient = React.createClass({
    mixins: [FluxMixin],
    storesToListenTo: [TORRENTUI_STORE],

    getStateFromStores: function () {
        return this.getStore(TORRENTUI_STORE).getCurrentState();
    },

    render: function () {
        if (!this.state || this.state == null) {
            return <div>Waiting for data...</div>
        }

        return (
            <div>
                <Row>
                    {_.map(this.state.torrents, function (torrent, hash) {
                        return (
                            <Col md={6} key={hash}>
                                <TorrentJob torrent={torrent} />
                            </Col>
                        )
                    })}
                </Row>
                <pre>
                    {JSON.stringify(this.state, null, 4)}
                </pre>
            </div>
        )
    }
});

module.exports = TorrentClient;
