// WeatherList.js
import { Component } from "../core/core";
import { store } from "../store/weather";
import Weather from "./Weather";

export default class WeatherList extends Component {
  constructor() {
    super();
    store.subscribe("information", () => {
      this.render();
    });
    store.subscribe("loading", () => {
      this.render();
    });
    store.subscribe("defaultText", () => {
      this.render();
    });
  }
  render() {
    this.el.classList.add("weather-list");
    this.el.innerHTML = /* HTML */ `
      <div class="weather-title">
        <span
          >${store.state.searchText
            ? store.state.searchText
            : store.state.defaultText}</span
        >
        의 현재 날씨
      </div>
      <div class="weather-information"></div>
      <div class="the-loader hide"></div>
    `;
    const weatherEl = this.el.querySelector(".weather-information");
    weatherEl.append(
      ...store.state.information.map(
        (weather) =>
          new Weather({
            weather,
          }).el
      )
    );

    const loaderEl = this.el.querySelector(".the-loader");
    const weatherTitleEl = this.el.querySelector(".weather-title");
    // weatherTitleEl.classList.add('hide')

    store.state.loading
      ? loaderEl.classList.remove("hide")
      : loaderEl.classList.add("hide");
  }
}
