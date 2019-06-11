import React from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

interface TemperatureProps {
  temperature: TemperatureStore
}

class TemperatureStore {
  constructor(t: number) {
    this._temperatureCelsius = t;
  }

  @observable _unit = "C";
  @observable _temperatureCelsius: number;

  @computed get temperatureKelvin() {
    return this._temperatureCelsius + 273.15;
  }

  @computed get temperatureFahrenheit() {
    return this._temperatureCelsius * (9/5) + 32;
  }

  @computed get temperature() {
    switch (this._unit) {
      case "K": return this.temperatureKelvin + "K";
      case "F": return this.temperatureFahrenheit + "F";
      default: return this._temperatureCelsius + "C";
    }
  }

  set unit(u: string) {
    this._unit = u;
  }

  set temperatureCelsius(t: number) {
    this._temperatureCelsius = t;
  }
}

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
    this.props.temperature.temperatureCelsius = parseInt(this.state.celsiusValue);
    this.setState({
      ...this.state,
      celsiusValue: ''
    });
  }

  handleUnitChange = () => {
    this.props.temperature.unit = this.state.unit;
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