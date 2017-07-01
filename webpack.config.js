var path = require('path')

module.exports = {
	entry: './webpackImports.js',
	output: {
		path: __dirname + '/src/public',
		filename: 'bundle.js'
	},

	watch: true,

	module: {
		rules: [
			{
				test: /\.(scss|sass)$/,
				exclude: [
					/node-modules/
				],

				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	}
}