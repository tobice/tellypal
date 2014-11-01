/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var Button = Bootstrap.Button;

var torrentActions = require('../../actions/torrentActions');

var EpisodeDownload = React.createClass({

    getInitialState: function() {
        return { loading: false }
    },

    handleClick: function (quality) {
        var params = {
            seriesid: this.props.seriesid,
            season: this.props.season,
            episode: this.props.episode,
            quality: quality
        };

        this.setState({loading: true});
        this.props.context.executeAction(torrentActions.downloadEpisode, params)
            .catch(function () {})
            .then(function () {
                this.setState({loading: false});
            }.bind(this));
    },

    render: function () {
        return (
            <div>
                {this.renderButton('any quality', '')}
                {this.renderButton('720p', '720p')}
                {this.renderButton('1080p', '1080p')}
            </div>
        )
    },

    renderButton: function (label, quality) {
        var disabled = this.state.loading;
        return (
            <Button bsStyle="primary" bsSize="xsmall" disabled={disabled} onClick={this.handleClick.bind(this, quality)} style={{marginLeft: '8px'}}>
                <i className="fa fa-download" /> {label}
            </Button>
        )
    }
});

module.exports = EpisodeDownload;