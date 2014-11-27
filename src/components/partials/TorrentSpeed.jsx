/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Icon = require('./Icon.jsx');

var FluxMixin = require('../../utils/FluxMixin');
var TORRENTUI_STORE = require('../../stores/TorrentUIStore').storeName;
var stringHelpers = require('../../utils/stringHelpers');

var TorrentSpeed = React.createClass({
    mixins: [FluxMixin],
    storesToListenTo: [TORRENTUI_STORE],

    getStateFromStores: function () {
        return this.getStore(TORRENTUI_STORE).getCurrentState();
    },

    render: function () {
        if (!this.state || this.state == null) {
            return this.renderMonitor('?', '?');
        } else {
            return this.renderMonitor(
                stringHelpers.fileSize(this.state.stats.download_rate),
                stringHelpers.fileSize(this.state.stats.upload_rate));
        }
    },

    renderMonitor: function (download, upload) {
        return (
            <div>
                <span className="text-success">
                    <Icon type="arrow-down" /> {download}/s
                </span>
                {' '}
                <span className="text-muted">
                    <Icon type="arrow-up" /> {upload}/s
                </span>
            </div>
        );
    }
});

module.exports = TorrentSpeed;