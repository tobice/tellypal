/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Navbar = require('./Navbar.jsx');
var Notifications = require('./Notifications.jsx');

var Application = React.createClass({

    childContextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    getChildContext: function () {
        return {flux: this.props.flux};
    },

    render: function () {
        return (
            <html>
                <head>
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>TellyPal</title>
                    <link href="/styles.css" rel="stylesheet"/>
                </head>
                <body>
                    <Navbar />
                    <Notifications />

                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <RouteHandler />

                                <br />
                                <hr />
                                <p className="text-muted text-center">
                                    Powered by{' '}
                                    <a href="http://thetvdb.com/" target="_blank">The TVDB</a>,{' '}
                                    <a href="http://torrentz.com/" target="_blank">Torrentz</a> and{' '}
                                    <a href="http://deluge-torrent.org/" target="_blank">Deluge BitTorrent Client</a>
                                </p>
                                <br /><br />
                            </div>
                        </div>
                    </div>

                    <script src="/scripts.js"></script>
                </body>
            </html>
        );
    }
});

module.exports = Application;
