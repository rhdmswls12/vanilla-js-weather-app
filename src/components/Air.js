import { Component } from "../core/core";
import { store } from "../store/weather";

export default class Air extends Component {
  constructor() {
    super();
    store.subscribe("air", () => {
      this.render();
    });
    store.subscribe("airState", () => {
      this.render();
    });
    store.subscribe("sidoName", () => {
      this.render();
    });
  }
  render() {
    this.el.classList.add("air");
    this.el.innerHTML = /* HTML */ `
      <div class="air-information">
        <div class="title">
          <span>${store.state.sidoName}</span>
          미세먼지 농도
        </div>
        <div class="value">
          ${store.state.airState} <span>${store.state.air}</span>
        </div>
      </div>
    `;
  }
}
