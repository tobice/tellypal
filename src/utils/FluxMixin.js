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
        if (!this.getStateFromStores) {
            return null;
        }
        return this.getStateFromStores();
    },

    componentDidMount: function () {
        if (this.storesToListenTo) {
            _.each(this.storesToListenTo, function (store) {
                this.getStore(store).addChangeListener(this._onChange);
            }.bind(this));
        }
        this.doInitStores(this.props);
    },

    componentWillUnmount: function () {
        if (this.storesToListenTo) {
            _.each(this.storesToListenTo, function (store) {
                this.getStore(store).removeChangeListener(this._onChange);
            }.bind(this));
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.getStateFromStores) {
            this.setState(this.getStateFromStores(nextProps));
        }
        this.doInitStores(nextProps);
    },

    _onChange: function () {
        if (this.getStateFromStores) {
            this.setState(this.getStateFromStores());
        }
    },

    executeAction: function (actionController, payload) {
        return this.getFlux().executeAction(actionController, payload);
    },

    doInitStores: function (props) {
        if (this.initStores) {
            this.initStores(props);
        }
    }
};

module.exports = FluxMixin;