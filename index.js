import React from 'react';
// import ReactDOM from 'react-dom';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		console.log('constructor', props);
	}
	render() {
		console.log('render');
		return <div>Hello Home Page</div>;
	}
}

console.log(<Home />);