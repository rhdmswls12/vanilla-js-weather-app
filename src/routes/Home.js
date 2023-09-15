import { Component } from "../core/core";
import Headline from "../components/Headline";
import Search from '../components/Search';
import Air from "../components/Air";
import WeatherList from "../components/WeatherList";
import TheFooter from "../components/TheFooter";

export default class Home extends Component {
  render() {
    const headline = new Headline().el
    const search = new Search().el
    const air = new Air().el
    const weatherList = new WeatherList().el
    const theFooter = new TheFooter().el

    this.el.classList.add('container')
    this.el.append(
      headline,
      search,
      air,
      weatherList,
      theFooter
    )
  }
}