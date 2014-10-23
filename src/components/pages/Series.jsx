/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var ActiveState = require('react-router').ActiveState;

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Jumbotron = Bootstrap.Jumbotron;
var Button = Bootstrap.Button;
var Badge = Bootstrap.Badge;

var Banner = require('../partials/Banner.jsx');
var Loading = require('../partials/Loading.jsx');
var If = require('../partials/If.jsx');
var FluxMixin = require('../../utils/FluxMixin');
var seriesActions = require('../../actions/seriesActions');
var seriesHelpers = require('../../utils/seriesHelpers.jsx');
var SERIES_STORE = require('../../stores/SeriesStore').storeName;

var Series = React.createClass({

    mixins: [ActiveState, FluxMixin],

    getStateFromStores: function (props) {
        props = props || this.props;
        return {
            series: this.getStore(SERIES_STORE).getSeries(props.params.seriesid)
        }
    },

    getStoresToListenTo: function () {
        return [SERIES_STORE];
    },

    initStores: function (props) {
        if (!this.getStore(SERIES_STORE).hasSeries(props.params.seriesid)) {
            this.getContext().executeAction(seriesActions.loadSeries, props.params.seriesid);
        }
    },

    render: function () {
        var series = this.state.series;
        if (!series) {
            return <Loading />;
        }

        return (
            <div className="series">
                {this.renderHeader()}
                {this.renderSeasons()}
            </div>
        );
    },

    renderHeader: function () {
        var series = this.state.series;
        return (
            <Grid className="series-header">
                <Row>
                    <Col sm={3}>
                        <div className="thumbnail">
                            <Banner seriesid={series.id} type="poster" />
                        </div>
                    </Col>
                    <Col sm={9}>
                        <div className="pull-right">
                            <Button bsStyle="primary">
                                <i className="fa fa-plus" /> Add to my library
                            </Button>
                        </div>
                        <h1>
                            {series.SeriesName}
                            <span className="text-muted small"> ({seriesHelpers.getYear(series.FirstAired)})</span>
                        </h1>
                        <p className="text-muted">{seriesHelpers.getActors(series.Actors)}</p>
                        <p className="lead">{series.Overview}</p>
                        <dl className="dl-horizontal">
                            <dt>Status</dt>
                            <dd>{seriesHelpers.getStatusLabel(series.Status)}</dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>Number of seasons</dt>
                            <dd><Badge>{series.seasonCount}</Badge></dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>Number of episodes</dt>
                            <dd><Badge>{series.episodeCount}</Badge></dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>TVDB Rating</dt>
                            <dd><Badge>{series.Rating}</Badge></dd>
                        </dl>
                    </Col>
                </Row>
            </Grid>
        );
    },

    renderSeasons: function () {
        return (
            <Grid className="series-seasons">
                <Row>
                    <Col lg={12}>
                        <ul className="nav nav-tabs">
                            {_.map(this.getSeasonSeq(), this.renderSeasonTab)}
                        </ul>
                    </Col>
                </Row>

                <this.props.activeRouteHandler context={this.props.context} defaultSeason={this.getDefaultSeason()} />
            </Grid>
        );
    },

    renderSeasonTab: function (season) {
        // We could use Tab instead but we have to handle the default season
        var series = this.state.series;
        var currentSeason = this.getActiveParams().season || this.getDefaultSeason();
        return (
            <li key={season} className={season == currentSeason ? 'active' : ''}>
                <Link to="season" params={{seriesid: series.id, season: season}}>
                    Season {season}
                </Link>
            </li>
        );
    },

    /**
     * Returns 1..N sequence where N is number of seasons.
     * @returns {Array.<int>}
     */
    getSeasonSeq: function () {
        return _.map(new Array(this.state.series.seasonCount), function (value, key) {
            return key + 1;
        });
    },

    getDefaultSeason: function () {
        return this.state.series.seasonCount;
    }
});

module.exports = Series;
