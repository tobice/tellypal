/** @jsx React.DOM */
var React = require('react');
var Banner = require('./Banner.jsx');
var Link = require('react-router').Link;

var seriesHelpers = require('../../utils/seriesHelpers.jsx');

var SeriesThumbnail = React.createClass({

    render: function () {
        var series = this.props.series;
        return (
            <div className="thumbnail">
                <Link to="series" params={{ seriesid: series.seriesid }}>
                    <Banner seriesid={series.id} type="poster" />
                </Link>
                <div className="caption">
                    <h4><Link to="series" params={{ seriesid: series.seriesid }}>{series.SeriesName}</Link></h4>
                    <p className="text-muted">{seriesHelpers.getYear(series.FirstAired)}</p>
                </div>
            </div>
        )
    }
});

module.exports = SeriesThumbnail;