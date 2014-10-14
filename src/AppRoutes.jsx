/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.Route;

var Application = require('./components/Application.jsx');
var Home = require('./components/pages/Home.jsx');
var Search = require('./components/pages/Search.jsx');
var Series = require('./components/pages/Series.jsx');

var AppRoutes = {
    get: function (context) {
        return (
            <Routes location="history">
                <Route name="home" path="/" handler={Application} context={context}>
                    <Route name="search" path="search/:query" handler={Search}/>
                    <Route name="series" handler={Series}/>
                    <DefaultRoute handler={Home}/>
                </Route>
            </Routes>
        )
    }
};

module.exports = AppRoutes;