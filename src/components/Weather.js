import { Component } from "../core/core";

export default class Weather extends Component {
  constructor(props) {
    super({
      props
    })
  }
  render() {
    const { weather } = this.props
    const weatherCategory = {
      'T1H': '기온',
      'RN1': '1시간 강수량',
      'UUU': '동서바람성분',
      'VVV': '남북바람성분',
      'REH': '습도',
      'PTY': '강수형태',
      'VEC': '풍향',
      'WSD': '풍속'
    }
    
    
    this.el.classList.add('weather')
    this.el.innerHTML = /* HTML */`
      <div class="info">
        <div class="category">
          ${weatherCategory[weather.category]}
        </div>
        <div class="image">
          <!-- ... -->
        </div>
        <div class="value">
          ${weather.obsrValue}
        </div>
      </div>
    `
  }
}