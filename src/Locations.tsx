import React                                  from 'react';
import { observable, computed, action, when } from 'mobx';
import { observer }                           from 'mobx-react';

class TemperatureStore {
  constructor(location: string) {
    this.location = location;
    this.fetch();
  }

  id = Math.random();
  @observable unit = "C";
  @observable temperatureCelsius = 25;
  @observable location = 'Amsterdam, NL';
  @observable loading = true;

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

  @action fetch() {
    const APPID = ''; // YOUR API KEY HERE
    fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${this.location}`)
      .then(res => res.json())
      .then(action((json: any)  => {
        this.temperatureCelsius = json.main.temp - 273.15;
        this.loading = false;
      }))
      .catch(() => {
        // in case you don't have an API key
        const someTemperature = Math.random() * 40;
        this.temperatureCelsius = someTemperature;
        this.loading = false;
      })
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

const Temperatures = observer(({temperatures}) => (
  <div>
    <TemperatureInput temperatures={temperatures} />
    {temperatures.map((t: TemperatureStore) => (
      <SingleTemperature key={t.id} temperature={t}/>
    ))}
  </div>
))

interface TemperatureInputProps {
  temperatures: TemperatureStore[]
}

@observer
class TemperatureInput extends React.Component<TemperatureInputProps> {
  @observable input = "";

  render() {
    return (
      <li>
        Destination:
        <input onChange={this.onChange} value={this.input}/>
        <button onClick={this.onSubmit}>Add</button>
      </li>
    )
  }

  @action onChange = (e: any) => {
    this.input = e.target.value;
  }

  @action onSubmit = () => {
    this.props.temperatures.push(
      new TemperatureStore(this.input)
    );
    this.input = "";
  }
}

const SingleTemperature = observer(({ temperature}) => (
  <div onClick={temperature.increment}>
    {temperature.location}:
    {temperature.loading ? "loading..." : temperature.temperature}
    </div>
));

const LocationsApp: React.FC = () => {
  return (
    <div>
      <Temperatures temperatures={temps} />
    </div>
  );
};

export default LocationsApp;

function isNice(t: TemperatureStore) {
  return t.temperatureCelsius > 25 && t.temperatureCelsius < 35;
}

// triggers a side effect whenever a certain condition is met
when(
  () => temps.some(isNice), // expression evaluated until returns true,
  () => {
    const t = temps.find(isNice);
    t && alert("Book now! " + t.location)
  } // invoked as soon as the first returns true
)
