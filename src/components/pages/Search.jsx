/** @jsx React.DOM */
var React = require('react');
var State = require('react-router').State;
var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Promise = require('bluebird');
var _ = require('lodash');

var FluxMixin = require('../../utils/FluxMixin');
var SeriesThumbnail = require('../partials/SeriesThumbnail.jsx');
var searchActions = require('../../actions/searchActions');
var SEARCH_STORE = require('../../stores/SearchStore').storeName;


var Search = React.createClass({
    mixins: [State, FluxMixin],
    storesToListenTo: [SEARCH_STORE],

    getStateFromStores: function () {
        return this.getStore(SEARCH_STORE).getContents() || {};
    },

    initStores: function () {
        this.executeAction(searchActions.search, this.getParams().query);
    },

    render: function () {
        return (
            <div>
                <Grid>
                    <h1>Search for "{this.getParams().query}"</h1>
                    <br />
                </Grid>
                <Grid>
                    <Row>
                        {_.map(this.state.results, function (series) {
                            return (
                                <Col key={series.seriesid} lg={2} md={3} sm={4} xs={6}>
                                    <SeriesThumbnail series={series} />
                                </Col>
                                );
                        })}
                    </Row>
                </Grid>
            </div>
        );
    }
});

module.exports = Search;
