// WeatherList.js
import { Component } from "../core/core";
import weatherStore from "../store/weather";
import Weather from "./Weather";

export default class WeatherList extends Component {
  constructor() {
    super()
    weatherStore.subscribe('information', () => {
      this.render()
    })
    weatherStore.subscribe('loading', () => {
      this.render()
    })
  }
  render() {
    this.el.classList.add('weather-list')
    this.el.innerHTML = /* HTML */`
      <div class="weather-title hide">
        <span>${weatherStore.state.searchText}</span>
        의 현재 날씨
      </div>
      <div class="weather-information"></div>
      <div class="the-loader hide"></div>
    `
    const weatherEl = this.el.querySelector('.weather-information')
    weatherEl.append(
      ...weatherStore.state.information.map(weather => new Weather({
        weather
      }).el)
    )

    const loaderEl = this.el.querySelector('.the-loader')
    const weatherTitleEl = this.el.querySelector('.weather-title')

    weatherStore.state.loading
      ? loaderEl.classList.remove('hide') & weatherTitleEl.classList.remove('hide') 
      : loaderEl.classList.add('hide') 

  }
}