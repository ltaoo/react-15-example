import React from 'react';
import ReactDOM from 'react-dom';

export default class Home extends React.Component {
	render() {
		return (
            <div>
                <button onClick={() => this.setState({ count: 0 })}>click</button>
            </div>
        );
	}
}

ReactDOM.render(<Home />, document.querySelector('#container'));
