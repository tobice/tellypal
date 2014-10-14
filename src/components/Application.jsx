/** @jsx React.DOM */
var React = require('react');
var Link = require('react-router').Link;
var Navbar = require('./Navbar.jsx');

var Application = React.createClass({

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

                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <this.props.activeRouteHandler context={this.props.context}/>
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
