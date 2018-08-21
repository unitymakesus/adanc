// import external dependencies
import 'jquery';
import 'materialize-css';

// Import everything from autoload
import "./autoload/**/*"

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import aboutUs from './routes/about';
import resources from './routes/resources';

// Web font loader
var WebFont = require('webfontloader');

WebFont.load({
 google: {
   families: ['Montserrat:300,400,400i,500,500i', 'Material+Icons'],
 },
});

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // About Us page, note the change from about-us to aboutUs.
  aboutUs,
  // Resources
  resources,
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
