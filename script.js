const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
function renderData(data){
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} C`
    document.body.appendChild(newPara);
}
async function fetchWeather(){
    try {
        let city = "haryana";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log("Weather data:-> " , data);   
        renderData(data);
    } catch (error) {
        
    }
}
async function fetchWeatherLatLog(){
    try {
        let latitude = 15.3333;
        let longitude = 17.3333;
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        let data = await result.json();
        renderData(data);
    } catch (error) {
        
    }
}

function getCurrnetLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("no geo location");
    }
}

function showPosition(position){
    let lat = position.coords.latitude;
    let log = position.coords.longitude;
    console.log(lat+" "+log);
}

