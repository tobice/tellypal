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

    getInitialState: function () {
        return {
            showMenu: false
        }
    },

    toggleMenu: function () {
        this.setState({
            showMenu: !this.state.showMenu
        });
    },

    render: function () {
        return (
            <Navbar className="navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <Link to="home" className="navbar-brand">
                            <i className="fa fa-film"></i> TellyPal
                        </Link>
                        <button className="navbar-toggle" type="button" onClick={this.toggleMenu}>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className={'navbar-collapse collapse' + (this.state.showMenu ? ' show' : '')}>
                        <ul className="nav navbar-nav">
                            <li> <Link to="myLibrary">My library</Link> </li>
                            <li> <Link to="home">Upcoming</Link> </li>
                        </ul>

                        <Search />
                        <div className="navbar-torrent-speed">
                            <TorrentSpeed />
                        </div>
                    </div>
                </div>
            </Navbar>
        );
    }
});

module.exports = NavbarComponent;
