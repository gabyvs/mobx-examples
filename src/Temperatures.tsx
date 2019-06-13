import React                            from 'react';
import { observable, computed, action } from 'mobx';
import { observer }                     from 'mobx-react';

class TemperatureStore {
  constructor(t: number) {
    this.temperatureCelsius = t;
  }

  id = Math.random();
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

  @action setUnit = (u: string) => {
    this.unit = u;
  }

  @action setCelsius = (t: number) => {
    this.temperatureCelsius = t;
  }

  @action setTemperatureAndUnit = (degrees: number, unit: string) => {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }

  @action increment = () => {
    this.setCelsius(this.temperatureCelsius + 1);
  }
}

const ar: TemperatureStore[] = [];
const temps = observable(ar);
temps.push(new TemperatureStore(25));
temps.push(new TemperatureStore(30));

const mapTemps = observable.map({
  "Amsterdam": new TemperatureStore(25),
  "Rome": new TemperatureStore(30)
});

const Temperatures = observer(({temperatures, mapTemperatures}) => (
  <div>
    <div>With an array</div>
    {temperatures.map((t: TemperatureStore) => (
      <SingleTemperature key={t.id} temperature={t}/>
    ))}
    <div>With a map</div>
    {[...mapTemperatures].map(([key, value]) => (
      <div key={value.id}>{key}: {value.temperature}</div>
    ))}
  </div>
));

const SingleTemperature = observer(({ temperature}) => (
  <div onClick={temperature.increment}>{temperature.temperature}</div>
));

const TemperaturesApp: React.FC = () => {
  return (
    <div>
      <Temperatures temperatures={temps} mapTemperatures={mapTemps} />
    </div>
  );
};

export default TemperaturesApp;