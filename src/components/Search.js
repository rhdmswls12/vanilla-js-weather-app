import { Component } from "../core/core";
import { store, searchWeather } from "../store/weather";

export default class Search extends Component {
  render() {
    this.el.classList.add("search");
    this.el.innerHTML = /*HTML*/ `
      <input placeholder='Enter the location to search!' />
      <button class='btn btn-primary'>
        Search!
      </button>
    `;

    const inputEl = this.el.querySelector("input");
    inputEl.addEventListener("input", () => {
      store.state.searchText = inputEl.value;
    });
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && store.state.searchText.trim()) {
        searchWeather();
      }
    });
    const btnEl = this.el.querySelector(".btn");
    btnEl.addEventListener("click", () => {
      if (store.state.searchText.trim()) {
        searchWeather();
      }
    });
  }
}
