/** @jsx React.DOM */
var React = require('react');
var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Promise = require('bluebird');
var _ = require('lodash');

var SeriesThumbnail = require('../partials/SeriesThumbnail.jsx');
var searchActions = require('../../actions/searchActions');

var Search = React.createClass({

    getInitialState: function () {
        this.context = this.props.context;
        this.SearchStore = this.context.getStore('SearchStore');
        return this.SearchStore.getContents() || {};
    },

    executeSearch: function (query) {
        this.context.executeAction(searchActions.search, query);
    },

    componentDidMount: function () {
        this.SearchStore.addChangeListener(this._onChange);
        this.executeSearch(this.props.params.query);
    },

    componentWillUnmount: function () {
        this.SearchStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function (nextProps) {
        this.context = this.props.context;
        this.SearchStore = this.context.getStore('SearchStore');
        this.executeSearch(nextProps.params.query);
    },

    _onChange: function () {
        this.setState(this.SearchStore.getContents());
    },

    render: function () {
        return (
            <div>
                <Grid>
                    <h1>Search for "{this.props.params.query}"</h1>
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
