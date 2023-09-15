import { Component } from "../core/core";

export default class TheFooter extends Component {
  constructor() {
    super({
      tagName: 'footer'
    })
  }
  render() {
    this.el.innerHTML = /* HTML */`
      <div>
        <a href="https://github.com/rhdmswls12/vanilla-js-weather-app">GitHub Repository</a>
      </div>
      <div>
        <a href="https://github.com/rhdmswls12">
          ${new Date().getFullYear()}
          Eunjin
        </a>
      </div>
    `
  }
}