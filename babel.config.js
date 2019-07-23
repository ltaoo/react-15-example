module.exports = function (api) {
  	api.cache(false);

	const presets = [
		['@babel/preset-react'],
	];
	const plugins = [
        ['@babel/plugin-transform-function-name'],
        ['@babel/plugin-transform-parameters'],
        ['@babel/plugin-transform-arrow-functions'],
        ['@babel/plugin-transform-shorthand-properties'],
		[require.resolve('./plugins/index.js')],
	];

  return {
    presets,
    plugins
  };
}