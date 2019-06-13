import React                            from 'react';
import { observable, computed, action } from 'mobx';
import { observer }                     from 'mobx-react';

interface TemperatureProps {
  temperature: TemperatureStore
}

// Example with class
class TemperatureStore {
  constructor(t: number) {
    this.temperatureCelsius = t;
  }

  @observable unit = "C";
  @observable temperatureCelsius: number;

  @computed get temperatureKelvin() {
    return this.temperatureCelsius + 273.15;
  }

  @computed get temperatureFahrenheit() {
    return this.temperatureCelsius * (9/5) + 32;
  }

  @computed get temperature() {
    switch (this.unit) {
      case "K": return this.temperatureKelvin + "K";
      case "F": return this.temperatureFahrenheit + "F";
      default: return this.temperatureCelsius + "C";
    }
  }

  @action setUnit(u: string) {
    this.unit = u;
  }

  @action setCelsius(t: number) {
    this.temperatureCelsius = t;
  }

  @action setTemperatureAndUnit(degrees: number, unit: string) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }
}
// Example with observable object
const t1 = observable({
  unit: 'C', // every property will be an observable property
  temperatureCelsius: 25,
  temperatureKelvin: function () {  // every function without arguments will be a computed property
    return this.temperatureCelsius + 273.15;
  },
  temperatureFahrenheit: function () {
    return this.temperatureCelsius * (9/5) + 32;
  },
  temperature: function () {
    switch (this.unit) {
      case "K": return this.temperatureKelvin + "K";
      case "F": return this.temperatureFahrenheit + "F";
      default: return this.temperatureCelsius + "C";
    }
  }
});

const t = new TemperatureStore(25);

const Temperature = observer(class Temperature extends React.Component<TemperatureProps> {

  state = {
    celsiusValue: '',
    unit: ''
  };

  handleChange = (event: any) => {
    console.log(event.target.name, event.target.value);
    this.setState({ ...this.state, [event.target.name]: event.target.value})
  }

  handleTemperatureChange = () => {
    this.props.temperature.setCelsius(parseInt(this.state.celsiusValue));
    this.setState({
      ...this.state,
      celsiusValue: ''
    });
  }

  handleUnitChange = () => {
    this.props.temperature.setUnit(this.state.unit);
    this.setState({
      ...this.state,
      unit: ''
    });
  }

  render() {
    return (
      <div>
        <div>{this.props.temperature.temperature}</div>

        <div>
          Change values: <br />
          Temperature in celsius: <input name="celsiusValue" type="text" value={this.state.celsiusValue} onChange={this.handleChange}/>
          <button onClick={this.handleTemperatureChange}>Set temperature in Celsius</button>
        </div>
        <div>
          Unit: <input type="text" value={this.state.unit} onChange={this.handleChange} name="unit"/>
          <button onClick={this.handleUnitChange}>Set unit</button>
        </div>
      </div>
    )
  }
});

const TemperatureApp: React.FC = () => {
  return (
    <Temperature temperature={t} />
  );
};

export default TemperatureApp;