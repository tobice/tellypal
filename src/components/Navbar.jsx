/** @jsx React.DOM */

var React = require('react');
var Bootstrap = require('react-bootstrap');
var Navbar = Bootstrap.Navbar;
var Nav = Bootstrap.Nav;
var NavItem = Bootstrap.NavItem;
var Link = require('react-router').Link;

var Search = require('./Search.jsx');
var TorrentSpeed = require('./partials/TorrentSpeed.jsx');

var NavbarComponent = React.createClass({

    render: function () {
        return (
            <Navbar className="navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link to="home" className="navbar-brand">
                            <i className="fa fa-film"></i> TellyPal
                        </Link>
                        <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li> <Link to="home">My library</Link> </li>
                            <li> <Link to="home">Upcoming</Link> </li>
                            <li> <Link to="home">Downloads</Link> </li>
                        </ul>

                        <Search />
                        <div className="navbar-torrent-speed">
                            <TorrentSpeed />
                        </div>
                    </div>
                </div>
            </Navbar>
        );
        /*
        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <NavLink name="home" className="navbar-brand" context={this.props.context}>Isomorphic Sandbox</NavLink>
                        <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar-main">
                        <ul className="nav navbar-nav">
                            <li>
                                <NavLink name="page" navParams={{page: "strategy"}} context={this.props.context}>Strategy</NavLink>
                            </li>
                            <li>
                                <NavLink name="page" navParams={{page: "about"}} context={this.props.context}>About</NavLink>
                            </li>
                            <li>
                                <NavLink name="page" navParams={{page: "contact"}} context={this.props.context}>Contact</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
        */
    }
});

module.exports = NavbarComponent;
