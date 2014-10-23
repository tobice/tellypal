/** @jsx React.DOM */
var React = require('react');
var moment = require('moment');
var seriesHelpers = require('../../utils/seriesHelpers.jsx');

var FirstAired = React.createClass({
    render: function () {
        if (!this.props.aired) {
            return <div className="aired aired-tba">TBA</div>
        }

        var aired = seriesHelpers.getAiredMoment(this.props.aired);
        var className;
        switch (true) {
            case moment().isAfter(aired): className = 'aired-past'; break;
            case moment().isSame(aired, 'day'): className = 'aired-today'; break;
            case moment().isBefore(aired):
            default: className = 'aired-future';
        }

        return ( <div className={'aired ' + className}>{aired.calendar()}</div> );
    }
});

module.exports = FirstAired;