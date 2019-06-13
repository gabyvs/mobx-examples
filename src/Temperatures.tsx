import React                                      from 'react';
import { observable, computed } from 'mobx';
import { observer }             from 'mobx-react';

class TemperatureStore {
  constructor(t: number) {
    this._temperatureCelsius = t;
  }

  id = Math.random();
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

const ar: TemperatureStore[] = [];
const temps = observable(ar);
temps.push(new TemperatureStore(25));
temps.push(new TemperatureStore(30));

const mapTemps = observable.map({
  "Amsterdam": new TemperatureStore(25),
  "Rome": new TemperatureStore(30)
});

const Temperatures = observer(({temperatures, mapTemperatures}) => {
  return (
    <div>
      <div>With an array</div>
      {temperatures.map((t: TemperatureStore) => (
        <div key={t.id}>{t.temperature}</div>
      ))}
      <div>With a map</div>
      {mapTemperatures.forEach((city: string, t: TemperatureStore) => {
        return (
          <div key={t.id}>{city}: {t.temperature}</div>
        )
      })}
    </div>
  )
});

const TemperaturesApp: React.FC = () => {
  return (
    <Temperatures temperatures={temps} mapTemperatures={mapTemps} />
  );
};

export default TemperaturesApp;