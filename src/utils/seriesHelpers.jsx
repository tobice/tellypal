/** @jsx React.DOM */
var moment = require('moment');
var React = require('react');
var Bootstrap = require('react-bootstrap');
var Label = Bootstrap.Label;

var seriesHelpers = {
    getYear: function (firstAired) {
        return firstAired ? firstAired.replace(/(\d+)-(\d+)-(\d+)/, "$1") : '(unknown year)';
    },

    getActors: function (actors) {
        return actors.replace(/^\||\|$/g, '').replace(/\|/g, ', ');
    },

    getStatusLabel: function (status) {
        switch (status) {
            case 'Ended':
                return <Label bsStyle="danger">Ended</Label>
            case 'Continuing':
                return <Label bsStyle="success">Continuing</Label>
            default:
                return <Label>unknown</Label>
        }
    },

    getAiredMoment: function (aired) {
        // lets just say that the show was aired in the US timezone
        return moment(aired + ' -0400', 'YYYY-MM-DD HH:mm Z');
    }
};

module.exports = seriesHelpers;