const cityInput=document.querySelector(".city");
const seraschBtn=document.querySelector(".searchbtn");
const apiKey='c53efd51cba5f6a84e9ec602d015b38f'
const notFound=document.querySelector(".notfound-city")
const searchCitySection=document.querySelector(".search-city")
const weatherInfo=document.querySelector('.weather-info')
const countryText=document.querySelector('.country-txt')
const tempText=document.querySelector('.temp-txt')
const conditionText=document.querySelector('.condition-txt')
const humidityText=document.querySelector('.humadity-value')
const windValue=document.querySelector('.wind-value')
const weatherImg=document.querySelector('.weather-summary-img')
const currentDateText=document.querySelector(".current-date-txt")
const forecastContainer=document.querySelector('.forcast-item-container')
seraschBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value);
        cityInput.value=''
        cityInput.blur()
    }
   
    
})
cityInput.addEventListener('keydown',(event)=>{
  if(event.key=="Enter"&& 
    cityInput.value.trim()!=''
  ){
     updateWeatherInfo(cityInput.value)
     cityInput.value=''
     cityInput.blur();
  }
    
})
function getWeatherIcon(id){
if(id <=232 ) return 'thunderstorm.svg'
if(id <=321 ) return 'drizzle.svg'
if(id <=531 ) return 'rain.svg'
if(id <=622) return 'snow.svg'
if(id <=781) return 'atmosphere.svg'
if(id <=800) return 'clear.svg'
else return 'clouds.svg'

}
function getCurrentDate(){
    const currentDate=new Date()
    const options={
        weekday:'short',
        day:"2-digit",
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
    
}

async function getFetchData(endPoint,city){
 const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=matric`

const response= await fetch(apiUrl)
 return response.json()
}


async function updateWeatherInfo(city){
    const weatherData=await getFetchData('weather',city)
    if(weatherData.cod !=200){
       showDisplaySection(notFound)
       return
    }
    showDisplaySection(weatherInfo)
   const {
      name:country,
      main:{temp,humidity},
      weather:[{id,main}],
      wind:{speed}

   }=weatherData

   countryText.textContent=country
   tempText.textContent=Math.round(temp)+"F"
   conditionText.textContent=main
   humidityText.textContent=humidity +'%'
   windValue.textContent=speed + "M/s"
   currentDateText.textContent=getCurrentDate()

 weatherImg.src=`/assets/weather/${getWeatherIcon(id)}`
   await updateForcastInfo(city)
}
async function updateForcastInfo(city){
    const forcastDate=await getFetchData("forecast",city)

    const timeTaken='12:00:00'
    const todayDate=new Date().toISOString().split('T')[0]
    forecastContainer.innerHTML=''
    forcastDate.list.forEach(forcastWeather=>{
        if(forcastWeather.dt_txt.includes(timeTaken) &&!forcastWeather.dt_txt.includes(todayDate)){
            updateForcastItems(forcastWeather)
        }
        
    })
}
function updateForcastItems(weatherData){
const {
dt_txt:date,
weather:[{id}],
main:{temp}
}=weatherData

const dateTaken=new Date(date)
const dateOptions={
    day:"2-digit"
    ,
    month:"short",

}
const dateRes=dateTaken.toLocaleDateString('en-US',dateOptions)

const forecastItem=`
 <div class="forcast-item">
            <h5 class="forcast-item-date regular-txt">${dateRes}</h5>
            <img src="./assets/weather/${getWeatherIcon(id)}" alt="" class="forcast-img">
           <h5 class="forcast-temp">${Math.round(temp)} </h5>
        </div>`
        
        forecastContainer.insertAdjacentHTML('beforeend',forecastItem)

}




function showDisplaySection(section){
 [weatherInfo,searchCitySection,notFound].forEach(section => section.style.display="none")
 section.style.display="flex"
}


