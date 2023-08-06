import { useState,useEffect } from "react"
import axios from "axios"


const Filter = (props) => {
    return (
        <div>
            filter shown with<input value = {props.newSearch} onChange={props.handleSearchChange}/>
        </div>
    )
}

const Countries = (props) => {


    if (props.searchedcountries.length > 10){
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    }
    else if (props.searchedcountries.length === 1 && props.weather.length !== 0){

        return (
            <div>
                <h1>{props.searchedcountries[0].name.common}</h1>
                <p>capital {props.searchedcountries[0].capital}</p>
                <p>area {props.searchedcountries[0].area}</p>
                <h2>languages</h2>
                <ul>
                    {Object.values(props.searchedcountries[0].languages).map(language => 
                    <li key={language}>{language}</li>
                    )}
                </ul>
                <img src={props.searchedcountries[0].flags.png} alt="flag" width="100" height="100"></img>
                <h1>weather in {props.searchedcountries[0].capital}</h1>
                <p>temperature: {props.weather.list[0].main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${props.weather.list[0].weather[0].icon}@2x.png`} alt="weather icon" width="100" height="100"></img>
                <p>wind: {props.weather.list[0].wind.speed} m/s</p>
            </div>
        )

    }
    else{    
        return (
        <div>
            {props.searchedcountries.map(country => {
                return (
                    <p key={country.name.common}>
                    {country.name.common} 
                    <button onClick={ 
                        () => {
                            props.setNewSearch(country.name.common)
                        }
                     }>show</button>
                    </p>
                )
            }
)}
        </div>
    )}

}

const App=()=>{
    const [countries, setCountries] = useState([])
    const [newSearch, setNewSearch] = useState('')
    const [newWeather, setNewWeather] = useState([])
    
      const handleSearchChange = (event) => {
        console.log(event.target.value)
        setNewSearch(event.target.value)
      }
      const api_key = process.env.REACT_APP_API_KEY
    console.log(api_key)
      const searchedcountries = countries.filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase()))
    

    useEffect(()=>{
        console.log('effect')
        axios
        .get('https://restcountries.com/v3.1/all')
        .then(response=>{
            console.log('promise fulfilled')
            // setNotes(response.data)
            setCountries(response.data)
            // console.log(response.data)
        })
    },[])


    
    useEffect(()=>{
        console.log('effect2')
        if (searchedcountries.length === 1){
        axios
        .get(`https://api.openweathermap.org/data/2.5/find?q=${searchedcountries[0].capital}&appid=${api_key}&units=metric`)
        .then(response=>{
            console.log('promise fulfilled2')
            // setNotes(response.data)
            setNewWeather(response.data)
            console.log(response.data)
            console.log(newWeather)
        })        }
        else{
            console.log('effect2 else')
            setNewWeather([])
        }
},[newSearch])


    return(
        <div>
        <h2>Find countries</h2>
        <Filter newSearch = {newSearch} handleSearchChange = {handleSearchChange}/>
        <Countries searchedcountries = {searchedcountries} setNewSearch={setNewSearch} weather={newWeather} />
        </div>

    )    
}

export default App