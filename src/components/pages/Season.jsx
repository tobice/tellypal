/** @jsx React.DOM */
var React = require('react');
var State = require('react-router').State;
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Button = Bootstrap.Button;

var Loading = require('../partials/Loading.jsx');
var If = require('../partials/If.jsx');
var EpisodeDownload = require('../partials/EpisodeDownload.jsx');
var FluxMixin = require('../../utils/FluxMixin');
var seriesActions = require('../../actions/seriesActions');
var seriesHelpers = require('../../utils/seriesHelpers.jsx');
var SERIES_STORE = require('../../stores/SeriesStore').storeName;

var Season = React.createClass({
    mixins: [State, FluxMixin],
    storesToListenTo: [SERIES_STORE],

    getStateFromStores: function (props) {
        props = props || this.props;
        var params = this.getParams();
        var seriesid = params.seriesid;
        var season = params.season || props.defaultSeason;
        return {
            season: season,
            episodes: this.getStore(SERIES_STORE).getSeason(seriesid, season) || null
        }
    },

    initStores: function (props) {
        var params = this.getParams();
        var seriesid = params.seriesid;
        var season = params.season || props.defaultSeason;
        if (!this.getStore(SERIES_STORE).hasSeason(seriesid, season)) {
            this.executeAction(seriesActions.loadSeason, {
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
        var isAired = seriesHelpers.isAired(episode.FirstAired);
        return (
            <Row key={episode.EpisodeNumber} className={isAired ? 'episode-aired' : 'episode-upcoming'}>
                <Col md={6}><strong>{episode.EpisodeNumber}.</strong> {episode.EpisodeName}</Col>
                <Col md={3}>
                    {episode.FirstAired ? seriesHelpers.getAiredMoment(episode.FirstAired).calendar() : 'TBA'}
                </Col>
                <Col md={3} className="text-right">
                    <If test={isAired}>
                        <EpisodeDownload
                            seriesid={this.getParams().seriesid}
                            season={this.state.season}
                            episode={episode.EpisodeNumber} />
                    </If>
                </Col>
            </Row>
        )
    }

});

module.exports = Season;