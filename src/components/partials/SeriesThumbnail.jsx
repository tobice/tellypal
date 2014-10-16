/** @jsx React.DOM */
var React = require('react');
var Banner = require('./Banner.jsx');

var SeriesThumbnail = React.createClass({

    render: function () {
        var series = this.props.series;
        return (
            <div className="thumbnail">
                <Banner seriesid={series.id} type="poster" />
                <div className="caption">
                    <h4>{series.SeriesName}</h4>
                    <p>2000</p>
                </div>
            </div>
        )
    }
});

module.exports = SeriesThumbnail;