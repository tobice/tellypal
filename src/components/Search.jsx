/** @jsx React.DOM */

var React = require('react/addons');
var Navigation = require('react-router').Navigation;
var Bootstrap = require('react-bootstrap');
var Input = Bootstrap.Input;
var Button = Bootstrap.Button;


var Search = React.createClass({
    mixins: [React.addons.LinkedStateMixin, Navigation],

    getInitialState: function () {
        // TODO: load from store
        return { query: '' }
    },

    handleSubmit: function () {
        this.transitionTo('search', {query: this.state.query});
        return false;
    },

    render: function () {
        return (
            <form onSubmit={this.handleSubmit} className="navbar-form navbar-right">
                <Input type="text" placeholder="Search shows..." valueLink={this.linkState('query')} />
                <Button type="submit" bsStyle="success"><i className="fa fa-search" /> Search</Button>
            </form>
        );
    }
});

module.exports = Search;