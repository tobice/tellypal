/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var moment = require('moment');

var Bootstrap = require('react-bootstrap');
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Well = Bootstrap.Well;
var ProgressBar = Bootstrap.ProgressBar;

var TorrentJob = require('./TorrentJob.jsx');
var TimeoutTransitionGroup = require('./TimeoutTransitionGroup.jsx');
var If = require('./If.jsx');
var Icon = require('./Icon.jsx');
var CenteredMessage = require('./CenteredMessage.jsx');
var Banner = require('./Banner.jsx');

var FluxMixin = require('../../utils/FluxMixin');
var TORRENTUI_STORE = require('../../stores/TorrentUIStore').storeName;

var FinishedDownloadJobs = React.createClass({
    mixins: [FluxMixin],
    storesToListenTo: [TORRENTUI_STORE],

    getStateFromStores: function () {
        return this.getStore(TORRENTUI_STORE).getCurrentState();
    },

    render: function () {
        if (!this.state || this.state == null) {
            return <CenteredMessage>
                    <Icon type="spinner" spin /> Waiting for data
                </CenteredMessage>
        }

        if (this.state.finished.length == 0) {
            return <CenteredMessage>
                    <Icon type="ban" /> No finished downloads
                </CenteredMessage>
        }

        return <Row className="border-top">
                <TimeoutTransitionGroup
                    enterTimeout={500} leaveTimeout={500}
                    transitionName="show">
                    {_.map(this.state.finished, function (job, index) {
                        return <Col md={6} key={index}>
                                {this.renderJob(job)}
                            </Col>
                    }.bind(this))}
                </TimeoutTransitionGroup>
            </Row>
    },

    renderJob: function (job) {
        return (
            <Row className="torrent-job">
                <Col xs={2} className="torrent-job-image">
                    <div className="thumbnail">
                        <Banner seriesid={job.seriesid} type="poster" />
                    </div>
                </Col>
                <Col xs={10} className="torrent-job-body">
                    <h4>{job.SeriesName}
                        <span className="text-muted"> {job.jobDescription}</span>
                    </h4>
                    <ProgressBar striped bsStyle="warning" now={100} label="%(percent)s%" />
                    <div className="text-success">
                        <Icon type="check" /> Finished {moment(job.finished).fromNow()}
                    </div>
                </Col>
            </Row>
        )
    }
});

module.exports = FinishedDownloadJobs;