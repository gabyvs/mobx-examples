import React, {Component} from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface CounterProps {
  store: {
    count: number
    increment: () => void
    decrement: () => void
  }
}

const appState = observable({
  count: 0,
  increment: function () {
    this.count++;
  },
  decrement: function () {
    this.count--;
  }
});

const Counter = observer(class Counter extends Component<CounterProps> {
  handleDecrement = () => { this.props.store.decrement(); };

  handleIncrement = () => { this.props.store.increment(); };

  render() {
    return (
      <div className="container">
        Counter: {this.props.store.count}<br />
        <button onClick={this.handleDecrement}>-</button>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
});

const CounterApp: React.FC = () => {
  return (
    <Counter store={appState} />
  );
};

export default CounterApp;
