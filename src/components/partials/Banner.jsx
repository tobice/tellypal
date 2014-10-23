/** @jsx React.DOM */
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var request = require('superagent');

var Banner = React.createClass({

    getInitialState: function () {
        return {imageLoaded: false}
    },

    makeUrl: function () {
        return "/banner/" + this.props.seriesid + "/" + this.props.type + ".jpg";
    },

    componentDidMount: function () {
        // Preload image
        var img = new Image();
        img.onload = function () {
            if (this.isMounted()) {
                this.setState({imageLoaded: true});
            }
        }.bind(this);
        img.setAttribute('src', this.makeUrl());
    },

    render: function () {
        return (
            <div className={"banner banner-" + this.props.type}>
                <div className="placeholder"></div>
                <ReactCSSTransitionGroup transitionName="fade">
                    {this.state.imageLoaded ? this.renderImage() : this.renderLoading()}
                </ReactCSSTransitionGroup>
            </div>
        );
    },

    renderImage: function () {
        return (
            <img src={this.makeUrl()} key="image" />
        )
    },

    renderLoading: function() {
        return (
            <div className="banner-loading" key="loading">
                <i className="fa fa-spin fa-spinner"></i> Loading...
            </div>
        )
    }
});

module.exports = Banner;