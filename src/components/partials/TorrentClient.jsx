/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Well = Bootstrap.Well;

var TorrentJob = require('./TorrentJob.jsx');
var TimeoutTransitionGroup = require('./TimeoutTransitionGroup.jsx');
var If = require('./If.jsx');
var Icon = require('./Icon.jsx');
var CenteredMessage = require('./CenteredMessage.jsx');

var FluxMixin = require('../../utils/FluxMixin');
var TORRENTUI_STORE = require('../../stores/TorrentUIStore').storeName;

var TorrentClient = React.createClass({
    mixins: [FluxMixin],
    storesToListenTo: [TORRENTUI_STORE],

    getStateFromStores: function () {
        return this.getStore(TORRENTUI_STORE).getCurrentState();
    },

    render: function () {
        if (!this.state || this.state == null) {
            return (
                <CenteredMessage>
                    <Icon type="spinner" spin /> Waiting for data
                </CenteredMessage>
            )
        }

        return (
            <div>
                <Row>
                    <TimeoutTransitionGroup
                        enterTimeout={500} leaveTimeout={500}
                        transitionName="show">
                        <If test={_.isEmpty(this.state.torrents)}>
                            <Col md={12}>
                                <CenteredMessage>
                                    <Icon type="ban" /> No downloads in progress
                                </CenteredMessage>
                            </Col>
                        </If>
                        {_.map(this.state.torrents, function (torrent, hash) {
                            return (
                                <Col md={6} key={hash}>
                                    <TorrentJob torrent={torrent} />
                                </Col>
                            )
                        })}
                    </TimeoutTransitionGroup>
                </Row>
            </div>
        )
    }
});

module.exports = TorrentClient;
