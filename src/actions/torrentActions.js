
var torrentActions = {

    downloadEpisode: function (context, params) {
        var torrents = context.getApi('TorrentsApi');
        return torrents.call('downloadEpisode', params.seriesid, params.season, params.episode, params.quality);
    }
};

module.exports = torrentActions;