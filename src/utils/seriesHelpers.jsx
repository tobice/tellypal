var _ = require('lodash');
var printf = require('printf');
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
    },

    isAired: function (aired) {
        if (!aired) {
            return false;
        }

        var airedMoment = this.getAiredMoment(aired);
        if (!airedMoment.isValid()) {
            return false;
        }

        return moment().isAfter(airedMoment);
    },

    makeQueryForEpisode: function (SeriesName, season, episode, quality) {
        quality = quality || '';
        return printf("%s S%02iE%02i %s", SeriesName, season, episode, quality).trim();
    },

    episodesToSeason: function (episodes) {
        var seasons = {};

        _.each(episodes, function (episode) {
            var season = parseInt(episode.Combined_season);
            var episodeNo = parseInt(episode.Combined_episodenumber);
            if (!seasons[season]) {
                seasons[season] = {};
            }
            seasons[season][episodeNo] = episode;
        });
        return seasons;
    },

    seasonsToEpisodes: function (seasons) {
        var episodes = [];
        _.each(seasons, function (season) {
            _.each(season, function (episode) {
                episodes.push(episode);
            })
        });
        return episodes;
    }
};

module.exports = seriesHelpers;