var _ = require('lodash');
var React = require('react');
var invariant = require('react/lib/invariant');

var FluxMixin = {
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    },

    getFlux: function () {
        if (!this.context.flux) {
            throw new Error('Flux not available in this component!');
        }
        return this.context.flux;
    },

    getStore: function(store) {
        return this.getFlux().getStore(store);
    },

    getInitialState: function () {
        invariant(
            this.getStateFromStores,
            'FluxMixin expects method getStateFromStores() to be defined'
        );
        return this.getStateFromStores();
    },

    componentDidMount: function () {
        invariant(
            this.getStoresToListenTo,
            'FluxMixin expects method getStoresToListenTo() to be defined'
        );
        invariant(
            this.initStores,
            'FluxMixin expects method initStores() to be defined'
        );

        _.each(this.getStoresToListenTo(), function (store) {
            this.getStore(store).addChangeListener(this._onChange);
        }.bind(this));
        this.initStores(this.props);
    },

    componentWillUnmount: function () {
        _.each(this.getStoresToListenTo(), function (store) {
            this.getStore(store).removeChangeListener(this._onChange);
        }.bind(this));
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
        this.initStores(nextProps);
    },

    _onChange: function () {
        this.setState(this.getStateFromStores());
    },

    executeAction: function (actionController, payload) {
        return this.getFlux().executeAction(actionController, payload);
    }
};

module.exports = FluxMixin;