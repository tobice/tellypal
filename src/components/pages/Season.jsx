/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Button = Bootstrap.Button;

var Loading = require('../partials/Loading.jsx');
var FirstAired = require('../partials/FirstAired.jsx');
var If = require('../partials/If.jsx');
var FluxMixin = require('../../utils/FluxMixin');
var seriesActions = require('../../actions/seriesActions');
var seriesHelpers = require('../../utils/seriesHelpers.jsx');
var SERIES_STORE = require('../../stores/SeriesStore').storeName;


var Season = React.createClass({
    mixins: [FluxMixin],

    getStateFromStores: function (props) {
        props = props || this.props;
        var seriesid = props.params.seriesid;
        var season = props.params.season || props.defaultSeason;
        return {
            season: season,
            episodes: this.getStore(SERIES_STORE).getSeason(seriesid, season) || null
        }
    },

    getStoresToListenTo: function () {
        return [SERIES_STORE];
    },

    initStores: function (props) {
        var seriesid = props.params.seriesid;
        var season = props.params.season || props.defaultSeason;
        if (!this.getStore(SERIES_STORE).hasSeason(seriesid, season)) {
            this.getContext().executeAction(seriesActions.loadSeason, {
                seriesid: seriesid,
                season: season
            });
        }
    },

    render: function () {
        var episodes = this.state.episodes;
        if (!episodes) {
            return <div className="season"><Loading /></div>;
        }

        return (
            <div className="season">
                {_.map(episodes, this.renderEpisode)}
            </div>
        );
    },

    renderEpisode: function (episode) {
        return (
            <Row>
                <Col md={6}><strong>{episode.EpisodeNumber}.</strong> {episode.EpisodeName}</Col>
                <Col md={3}><FirstAired aired={episode.FirstAired} /></Col>
                <Col md={3}>
                    <Button bsStyle="warning" bsSize="xsmall"><i className="fa fa-download" /> SD</Button>{' '}
                    <Button bsStyle="warning" bsSize="xsmall"><i className="fa fa-download" /> 720p</Button>{' '}
                    <Button bsStyle="warning" bsSize="xsmall"><i className="fa fa-download" /> 1080p</Button>
                </Col>
            </Row>
        )
    }

});

module.exports = Season;