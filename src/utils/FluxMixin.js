var _ = require('lodash');
var invariant = require('react/lib/invariant');

var FluxMixin = {
    getContext: function () {
        if (!this.props.context) {
            throw new Error('Context not available in this component!');
        }
        return this.props.context;
    },

    getStore: function(store) {
        return this.getContext().getStore(store);
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
    }
};

module.exports = FluxMixin;