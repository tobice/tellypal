/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Button = Bootstrap.Button;
var ProgressBar = Bootstrap.ProgressBar;

var seriesHelpers = require('../../utils/seriesHelpers.jsx');
var FluxMixin = require('../../utils/FluxMixin');
var torrentActions = require('../../actions/torrentActions');
var notificationActions = require('../../actions/notificationActions');
var NotificationStore = require('../../stores/NotificationStore');
var SERIES_STORE = require('../../stores/SeriesStore').storeName;
var TORRENTUI_STORE = require('../../stores/TorrentUIStore').storeName;

var EpisodeDownload = React.createClass({
    mixins: [FluxMixin],

    getStateFromStores: function (props) {
        props = props || this.props;
        var series = this.getStore(SERIES_STORE).getSeries(props.seriesid);
        var query = seriesHelpers.makeQueryForEpisode(series.SeriesName, props.season, props.episode);
        return {
            loading: this.state && this.state.loading,
            torrent: this.getStore(TORRENTUI_STORE).findTorrent(query)
        }
    },

    getStoresToListenTo: function () {
        return [TORRENTUI_STORE];
    },

    initStores: function () { },

    handleClick: function (quality) {
        var flux = this.getFlux();

        var params = {
            seriesid: this.props.seriesid,
            season: this.props.season,
            episode: this.props.episode,
            quality: quality
        };

        this.setState({loading: true});
        flux.executeAction(torrentActions.downloadEpisode, params)
            .then(function (torrent) {
                var message = 'Torrent ' + torrent.name + ' has been added for download';
                flux.notify('Downloading started!', message, NotificationStore.INFO);
            })
            .catch(function (err) {
                flux.notify('Downloading episode failed', err.responseText, NotificationStore.DANGER);
            })
            .finally(function () {
                this.setState({loading: false});
            }.bind(this));
    },

    render: function () {
        var torrent = this.state.torrent;
        if (torrent) {
            var active = torrent.download_payload_rate != 0 && torrent.progress != 100;
            return (
                <div>
                    <ProgressBar striped active={active} bsStyle="warning" now={torrent.progress} label="%(percent)s%" />
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderButton('any quality', '')}
                    {this.renderButton('720p', '720p')}
                    {this.renderButton('1080p', '1080p')}
                </div>
            )
        }
    },

    renderButton: function (label, quality) {
        var disabled = this.state.loading;
        return (
            <Button bsStyle="primary" bsSize="xsmall" disabled={disabled} onClick={this.handleClick.bind(this, quality)} style={{marginLeft: '8px'}}>
                <i className="fa fa-download" /> {label}
            </Button>
        )
    }
});

module.exports = EpisodeDownload;