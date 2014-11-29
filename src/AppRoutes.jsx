/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Application = require('./components/Application.jsx');
var Home = require('./components/pages/Home.jsx');
var Search = require('./components/pages/Search.jsx');
var Series = require('./components/pages/Series.jsx');
var Season = require('./components/pages/Season.jsx');
var MyLibrary = require('./components/pages/MyLibrary.jsx');

var AppRoutes =
    <Route name="home" path="/" handler={Application}>
        <Route name="search" path="search/:query" handler={Search}/>
        <Route name="series" path="series/:seriesid" handler={Series}>
            <DefaultRoute handler={Season}/>
            <Route name="season" path=":season" handler={Season}/>
        </Route>
        <Route name="myLibrary" path="mylibrary" handler={MyLibrary}/>
        <DefaultRoute handler={Home}/>
    </Route> ;

module.exports = AppRoutes;