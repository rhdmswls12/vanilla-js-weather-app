import { Component } from "../core/core";

export default class Headline extends Component {
  render() {
    this.el.classList.add('headline')
    this.el.innerHTML = /*HTML*/`
      <h1>
        How's the<br> 
        <span>Weather</span><br>
        Today?
      </h1>
      <p>
        The short-term forecasts API of the National Public Data site was utilized.
      </p>
    `
  }
}