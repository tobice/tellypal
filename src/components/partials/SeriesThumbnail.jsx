/** @jsx React.DOM */
var React = require('react');
var Banner = require('./Banner.jsx');

var SeriesThumbnail = React.createClass({

    getYear: function () {
        var firstAired = this.props.series.FirstAired;
        return firstAired ? firstAired.replace(/(\d+)-(\d+)-(\d+)/, "$1") : '(unknown year)';
    },

    render: function () {
        var series = this.props.series;
        return (
            <div className="thumbnail">
                <Banner seriesid={series.id} type="poster" />
                <div className="caption">
                    <h4><a href="#">{series.SeriesName}</a></h4>
                    <p className="text-muted">{this.getYear()}</p>
                </div>
            </div>
        )
    }
});

module.exports = SeriesThumbnail;