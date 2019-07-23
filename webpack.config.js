const path = require('path');
const fs = require('fs');

module.exports = {
	mode: 'development',
	entry: './index.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist'),
	},
	resolve: {
		modules: ['node_modules'],
	},
	module: {
		rules: [
			{ parser: { requireEnsure: false } },
			{
				oneOf: [
					{
						test: /\.(js|jsx)$/,
						loader: 'babel-loader',
						include: [
							path.resolve(__dirname, './index.js'),
							fs.realpathSync(path.resolve(__dirname, './node_modules')),
						],
						options: {
							babelrc: false,
							presets: [
								['@babel/preset-react'],
							],
							plugins: [
								['@babel/plugin-transform-function-name'],
								[require.resolve('./plugins/index.js')],
							],
						},
					}
				],
			},
		],
	},
	devServer: {
		contentBase: path.join(__dirname),
		port: 8000,
	},
}