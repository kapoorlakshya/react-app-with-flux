"use strict"; // Evaluate everything in strict mode

var React = require('react'); // Import React using the CommonJS pattern
var Router = require('react-router');
var Link = Router.Link;

var Home = React.createClass({
  render: function () { // Return value is displayed to the screen
    return (
      <div className="jumbotron">
        <h1>Zeiter React</h1>
        <p>React, React Router, and Flux for ultra-responsive webb apps.</p>
        <Link to="about" className="btn btn-primary btn-lg">
          Learn More
        </Link>
      </div>
    ); // Necessary if multi-line HTML is used
  }
});

module.exports = Home; // CommonJS pattern
