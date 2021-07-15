const prod_config = require('./webpack.config');

module.exports = {
    ...prod_config,
    mode: 'development'
}