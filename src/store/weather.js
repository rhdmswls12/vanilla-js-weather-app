import { Store } from "../core/core"

const store = new Store({
  searchText: '',
  information: [],
  air: 0,
  airState: '',
  loading: false,
  sidoName: '',
  defaultText: ''
})

export default store



export const dfs_xy_conv = (code, v1, v2) => {
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)

    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['x'] = v1;
        rs['y'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}

let today = new Date()
let year = today.getFullYear()
let month = today.getMonth() + 1
let date = today.getDate()
let hours = today.getHours()
let minutes = today.getMinutes()

if (minutes < 30) {
  hours = hours - 1
  if (hours < 0) {
    today.setDate(today.getDate() - 1)
    date = today.getDate()
    month = today.getMonth() + 1
    year = today.getFullYear()
    hours = 23
  }
}
if (hours < 10) {
  hours = '0' + hours
}
if (minutes < 10) {
  minutes = '0' + minutes
}
if (date < 10) {
  date = '0' + date
}
month = (month < 10) ? '0' + month : month

export const searchWeather = async () => {
  store.state.loading = true

  
  const airEl = document.querySelector('.air')
  

  // 위치 API
  const REST_API_KEY = 'cdc5b6a9678727fdaa8a73d9b2355814'
  const result = await fetch(`https://dapi.kakao.com/v2/local/search/address?query=${store.state.searchText}`, {
    method: "GET",
    headers: {
      "Authorization": `KakaoAK ${REST_API_KEY}`
    }
  })
  const locationJson = await result.json()
  let x = locationJson.documents[0].x // 경도
  let y = locationJson.documents[0].y // 위도
  console.log(locationJson)

  // 좌표 변환
  let rs = dfs_xy_conv("toXY",y, x)
  console.log(rs)
  let nx = rs['x'] // 좌표값
  let ny = rs['y']
  console.log(nx, ny)
  
  const serviceKey = '6o3Wnt66GnG4n3tCN3ZgU7/NXUVbDtADL61rtkIrjAZxeiLTbYT9eGlB62yqp4Zw6LdshmB4JdaoDhYYAdeBiA=='

  // 미세먼지 API
  const urlForAir = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?'
  let sidoArray = locationJson.documents[0].address.address_name.split('')
  let sidoName = sidoArray.slice(0, 2).join('')
  store.state.sidoName = sidoName
  const resForAir = await fetch(`${urlForAir}serviceKey=${serviceKey}&returnType=json&sidoName=${sidoName}`)
  const jsonForAir = await resForAir.json()
  let itemsForAir = jsonForAir.response.body.items[0]['pm10Value']
  if (itemsForAir <= 30) {
    store.state.airState = '좋음'
  } else if (itemsForAir <= 80) {
    store.state.airState = '보통'
  } else if (itemsForAir <= 150) {
    store.state.airState = '나쁨'
  } else if (itemsForAir == '-'){
    store.state.airState = '수치 없음'
  } else {
    store.state.airState = '매우 나쁨'
  }
  store.state.air = itemsForAir + ' ㎍/㎥'
  // 날씨 API
  const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
  let dateFormat = year + '' + month + '' + date
  let baseTime = hours + '00'
  console.log(dateFormat, baseTime)
  const res = await fetch(`${url}?serviceKey=${serviceKey}&dataType=json&numOfRows=10&pageNo=1&base_date=${dateFormat}&base_time=${baseTime}&nx=${nx}&ny=${ny}`)
  
  const json = await res.json()
  console.log(json)
  let response_item = json.response.body.items.item
  
  let copiedItems = [...response_item]
  if (copiedItems[0]['category'] == 'PTY') {
    if (copiedItems[0]['obsrValue'] == '1') {
      copiedItems[0]['obsrValue'] = '비'
    } else if (copiedItems[0]['obsrValue'] == '2') {
      copiedItems[0]['obsrValue'] = '비 또는 눈'
    } else if (copiedItems[0]['obsrValue'] == '3') {
      copiedItems[0]['obsrValue'] = '눈'
    } else if (copiedItems[0]['obsrValue'] == '4') {
      copiedItems[0]['obsrValue'] = '소나기'
    } else {
      copiedItems[0]['obsrValue'] = '없음'
    }
  }
  if (copiedItems[1]['category'] == 'REH') {
    copiedItems[1]['obsrValue'] += ' %' 
  }
  if (copiedItems[2]['category'] == 'RN1') {
    copiedItems[2]['obsrValue'] += ' mm' 
  }
  if (copiedItems[3]['category'] == 'T1H') {
    copiedItems[3]['obsrValue'] += ' ℃'
  }
  if (copiedItems[4]['category'] == 'UUU') {
    copiedItems[4]['obsrValue'] += ' m/s' 
  }
  if (copiedItems[5]['category'] == 'VEC') {
    copiedItems[5]['obsrValue'] += ' deg'
  }
  if (copiedItems[6]['category'] == 'VVV') {
    copiedItems[6]['obsrValue'] += ' m/s'
  }
  if (copiedItems[7]['category'] == 'WSD') {
    copiedItems[7]['obsrValue'] += ' m/s'
  }
  store.state.information = [...copiedItems]
  airEl.classList.remove('hide')
  store.state.loading = false
  const weatherTitleEl = document.querySelector('.weather-title')
  weatherTitleEl.classList.remove('hide')
} 



// 현재 위치 미세먼지 API


function onGeoOk(position) {
  const serviceKey = '6o3Wnt66GnG4n3tCN3ZgU7/NXUVbDtADL61rtkIrjAZxeiLTbYT9eGlB62yqp4Zw6LdshmB4JdaoDhYYAdeBiA=='

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  // 좌표 변환
  let rs = dfs_xy_conv("toXY",lat, lon)
  console.log(rs)
  let nx = rs['x'] // 좌표값
  let ny = rs['y']
  console.log(nx, ny)

  // 현재 위치 API
  let address = []
  let sidoName = ''
  const REST_API_KEY = 'cdc5b6a9678727fdaa8a73d9b2355814'
  axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}&input_coord=WGS84`,
    {headers:{Authorization: `KakaoAK ${REST_API_KEY}`}}
  )
  .then (res => {
    console.log(res.data.documents[0])
    address = res.data.documents[0].address_name.split(' ')
    sidoName = address[0].slice(0, 2)
    store.state.sidoName = sidoName
    store.state.defaultText = address[address.length - 1]
    // 현재 위치 미세먼지 API
    const urlForAir = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?'
    axios.get(`${urlForAir}serviceKey=${serviceKey}&returnType=json&sidoName=${sidoName}`)
    .then(res => {
      console.log(res.data.response.body.items[0])
      let itemsForAir = res.data.response.body.items[0]['pm10Value']
      if (itemsForAir <= 30) {
        store.state.airState = '좋음'
      } else if (itemsForAir <= 80) {
        store.state.airState = '보통'
      } else if (itemsForAir <= 150) {
        store.state.airState = '나쁨'
      } else if (itemsForAir == '-'){
        store.state.airState = '수치 없음'
      } else {
        store.state.airState = '매우 나쁨'
      }
      store.state.air = itemsForAir + ' ㎍/㎥'
    })
  })

  
  
  

  // 현재 위치 날씨 API
  const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
  let dateFormat = year + '' + month + '' + date
  let baseTime = hours + '00'
  console.log(dateFormat, baseTime)
  axios.get(`${url}?serviceKey=${serviceKey}&dataType=json&numOfRows=10&pageNo=1&base_date=${dateFormat}&base_time=${baseTime}&nx=${nx}&ny=${ny}`)
  .then(res => {
    console.log(res.data.response.body.items.item)
    let copiedItems = [...res.data.response.body.items.item]
  if (copiedItems[0]['category'] == 'PTY') {
    if (copiedItems[0]['obsrValue'] == '1') {
      copiedItems[0]['obsrValue'] = '비'
    } else if (copiedItems[0]['obsrValue'] == '2') {
      copiedItems[0]['obsrValue'] = '비 또는 눈'
    } else if (copiedItems[0]['obsrValue'] == '3') {
      copiedItems[0]['obsrValue'] = '눈'
    } else if (copiedItems[0]['obsrValue'] == '4') {
      copiedItems[0]['obsrValue'] = '소나기'
    } else {
      copiedItems[0]['obsrValue'] = '없음'
    }
  }
  if (copiedItems[1]['category'] == 'REH') {
    copiedItems[1]['obsrValue'] += ' %' 
  }
  if (copiedItems[2]['category'] == 'RN1') {
    copiedItems[2]['obsrValue'] += ' mm' 
  }
  if (copiedItems[3]['category'] == 'T1H') {
    copiedItems[3]['obsrValue'] += ' ℃'
  }
  if (copiedItems[4]['category'] == 'UUU') {
    copiedItems[4]['obsrValue'] += ' m/s' 
  }
  if (copiedItems[5]['category'] == 'VEC') {
    copiedItems[5]['obsrValue'] += ' deg'
  }
  if (copiedItems[6]['category'] == 'VVV') {
    copiedItems[6]['obsrValue'] += ' m/s'
  }
  if (copiedItems[7]['category'] == 'WSD') {
    copiedItems[7]['obsrValue'] += ' m/s'
  }
  console.log(copiedItems)
  store.state.information = [...copiedItems]
  })
  
}
function onGeoError() {
  alert('위치 권한을 확인해주세요')
}
navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError)