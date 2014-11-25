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

var torrentActions = require('../../actions/torrentActions');
var notificationActions = require('../../actions/notificationActions');
var NotificationStore = require('../../stores/NotificationStore');
var stringHelpers = require('../../utils/stringHelpers');

var TorrentJob = React.createClass({
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
                        <DropdownButton bsStyle="default" bsSize="xsmall" title="Remove">
                            <MenuItem eventKey="1"><Icon type="times" /> Remove</MenuItem>
                            <MenuItem eventKey="2"><Icon type="times" /> Remove with data</MenuItem>
                        </DropdownButton>
                    </div>
                </Col>
            </Row>
        )
    }
});

module.exports = TorrentJob;