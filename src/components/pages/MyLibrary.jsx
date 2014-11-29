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
var seriesActions = require('../../actions/seriesActions');
var SERIES_STORE = require('../../stores/SeriesStore').storeName;


var MyLibrary = React.createClass({
    mixins: [State, FluxMixin],
    storesToListenTo: [SERIES_STORE],

    getStateFromStores: function () {
        return {
            series: this.getStore(SERIES_STORE).getMyLibrary() || []
        }
    },

    initStores: function () {
        this.executeAction(seriesActions.loadMyLibrary);
    },

    render: function () {
        return (
            <div>
                <Grid>
                    <h1>My library</h1>
                    <br />
                </Grid>
                <Grid>
                    <Row>
                        {_.map(this.state.series, function (series) {
                            return (
                                <Col key={series.id} lg={2} md={3} sm={4} xs={6}>
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

module.exports = MyLibrary;
