import { Component } from "../core/core";
import weatherStore from '../store/weather';

export default class Air extends Component {
  constructor() {
    super()
    weatherStore.subscribe('air', () => {
      this.render()
    })
    weatherStore.subscribe('airState', () => {
      this.render()
    })
    weatherStore.subscribe('sidoName', () => {
      this.render()
    })
  }
  render() {
    this.el.classList.add('air')
    this.el.innerHTML = /* HTML */`
      <div class="air-information">
        <div class="title">
          <span>${weatherStore.state.sidoName}</span>
          미세먼지 농도
        </div>
        <div class="value">${weatherStore.state.airState} <span>${weatherStore.state.air}</span></div>
      </div>
    `
  }
}