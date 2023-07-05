const userTab = document.querySelector('[data-user-weather]');
const searchTab = document.querySelector('[data-search-weather]');

const grantAccess = document.querySelector('.grantLocation');
const searchForm = document.querySelector('[data-search-form]');
const loadingScreen = document.querySelector('.loadingContainer');
const userInfoContainer = document.querySelector('.weatherInfo');
const errorHandlerPage = document.querySelector('[data-error-handling]');

let currTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currTab.classList.add('currentTab');
getSessionInfo();


function switchTab(clickTab){
    if(clickTab != currTab){
        currTab.classList.remove('currentTab');
        currTab = clickTab
        currTab.classList.add('currentTab');
        if(!searchForm.classList.contains('active')){
            grantAccess.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
            errorHandlerPage.classList.remove('active');
        }
        else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            errorHandlerPage.classList.remove('active');
            getSessionInfo();
        }
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

function getSessionInfo(){
    const localCoords = sessionStorage.getItem("user-coordinates");
    if(!localCoords){
        grantAccess.classList.add('active');
    }
    else{
        //json.parse is used to convert string to object
        const coordinates = JSON.parse(localCoords);
        fetchUserWeatherInfo(coordinates); 
    }
}

async function fetchUserWeatherInfo(coordinates){
    // In the given code snippet, the line const {lat, long} = coordinates; is using object destructuring to extract the lat and long properties from the coordinates object. 
    const {lat,long} = coordinates;
    grantAccess.classList.remove('active');
    loadingScreen.classList.add('active');
    try {
        console.log(lat,long);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const result = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(result);
    } catch (error) {
        loadingScreen.classList.remove('active');
        console.log("error in your weather");
    }
}

function renderWeatherInfo(result){
    const cityName = document.querySelector('[data-city-name]');
    const countryIcon =  document.querySelector('[data-city-img]');
    const description =  document.querySelector('[data-des]');
    const weatherIcon =  document.querySelector('[data-des-icon]');
    const temperture =  document.querySelector('[data-temp]');
    const windSpeed =  document.querySelector('[data-wind-speed]');
    const humidity =  document.querySelector('[data-humidity]');
    const clouds =  document.querySelector('[data-cloud]');

    cityName.innerText = result?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${result?.sys?.country.toLowerCase()}.png`;
    description.innerText = result?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${result?.weather?.[0]?.icon}.png`;
    temperture.innerText = `${result?.main?.temp} C`;
    windSpeed.innerText = `${result?.wind?.speed}m/s`;
    humidity.innerText = `${result?.main?.humidity}%`;
    clouds.innerText = `${result?.clouds?.all}%`;
}

function getCurrnetLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // console.log("no geo location");
    }
}
function showPosition(position){
    const userCoordinates = {
        lat :position.coords.latitude,
        long :position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccBtn = document.querySelector('[data-grant-access]');
grantAccBtn.addEventListener('click',getCurrnetLocation);

let searchInput = document.querySelector('[data-search-input]');
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value === "")return
    else{
        searchFetchUserWeatherInfo(searchInput.value);
    }
})

async function searchFetchUserWeatherInfo(inputValue){
    try {
        let city = inputValue;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log("hi")
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        errorHandlerPage.classList.remove('active');
        console.log(data?.cod);
        if(data?.cod == 200){
            renderWeatherInfo(data);
        }
        else{
            userInfoContainer.classList.remove('active');
            errorHandlerPage.classList.add('active');
        }

    } catch (error) {
        console.log("hl")
    }
}