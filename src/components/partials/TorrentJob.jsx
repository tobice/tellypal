/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var moment = require('moment');

var Bootstrap = require('react-bootstrap');
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Button = Bootstrap.Button;
var ProgressBar = Bootstrap.ProgressBar;
var DropdownButton = Bootstrap.DropdownButton;
var MenuItem = Bootstrap.MenuItem;

var Banner = require('./Banner.jsx');
var If = require('./If.jsx');
var Icon = require('./Icon.jsx');

var FluxMixin = require('../../utils/FluxMixin');
var torrentActions = require('../../actions/torrentActions');
var stringHelpers = require('../../utils/stringHelpers');

var TorrentJob = React.createClass({
    mixins: [FluxMixin],

    resume: function () {
        this.executeAction(torrentActions.resume, this.props.torrent.hash);
    },

    pause: function () {
        this.executeAction(torrentActions.pause, this.props.torrent.hash);
    },

    remove: function (withData) {
        this.executeAction(torrentActions.remove, {
            hash: this.props.torrent.hash,
            withData: withData
        });
    },

    render: function () {
        var torrent = this.props.torrent;
        var active = torrent.download_payload_rate != 0 && torrent.progress != 100;

        return (
            <Row className="torrent-job">
                <Col xs={2} className="torrent-job-image">
                    <div className="thumbnail">
                        <Banner seriesid={torrent.job.seriesid} type="poster" />
                    </div>
                </Col>
                <Col xs={10} className="torrent-job-body">
                    <h4>{torrent.job.SeriesName}
                        <span className="text-muted"> {torrent.job.jobDescription}</span>
                    </h4>
                    <ProgressBar striped active={active} bsStyle="warning" now={torrent.progress} label="%(percent)s%" />
                    <div className="torrent-job-info">
                        <span className="text-success">
                            <Icon type="arrow-down" /> {stringHelpers.fileSize(torrent.download_payload_rate)}/s
                        </span>
                        <span className="text-muted">
                            <Icon type="arrow-up" /> {stringHelpers.fileSize(torrent.upload_payload_rate)}/s
                        </span>
                        <If test={torrent.eta > 0}>
                            <span className="text-info">
                                <Icon type="clock-o" /> {moment.duration(torrent.eta, 'seconds').humanize()}
                            </span>
                        </If>
                        <div className="torrent-job-toolbar">
                            <If test={torrent.state != 'Paused'}>
                                <Button bsStyle="default" bsSize="xsmall" onClick={this.pause}>
                                    <Icon type="pause" />
                                </Button>
                            </If>
                            <If test={torrent.state == 'Paused'}>
                                <Button bsStyle="default" bsSize="xsmall" onClick={this.resume}>
                                    <Icon type="play" />
                                </Button>
                            </If>
                            {' '}
                            <DropdownButton bsStyle="default" bsSize="xsmall" title="Remove">
                                <MenuItem eventKey="1" onClick={this.remove.bind(this, false)}><Icon type="times" /> Remove</MenuItem>
                                <MenuItem eventKey="2" onClick={this.remove.bind(this, true)}><Icon type="times" /> Remove with data</MenuItem>
                            </DropdownButton>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
});

module.exports = TorrentJob;