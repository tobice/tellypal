/** @jsx React.DOM */
var React = require('react');
var Promise = require('bluebird');
var _ = require('lodash');

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
                <h1>Search for "{this.props.params.query}"</h1>
                {_.map(this.state.results, function (series) {
                    return (<h5 key={series.seriesid}>{series.SeriesName}</h5>);
                })}
            </div>
        );
    }
});

module.exports = Search;
