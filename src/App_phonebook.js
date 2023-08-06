import { useState,useEffect } from "react"
import axios from "axios"
import phonebookServices from './services/phonebook'
import phonebook from "./services/phonebook"


const Filter = (props) => {
    return (
        <div>
            filter shown with<input value = {props.newSearch} onChange={props.handleSearchChange}/>
        </div>
    )
}

const PersonForm = (props) => {
    return (
        <form onSubmit={props.addPerson}>
        <div>
          name: <input value = {props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value = {props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

const Persons = (props) => {
    return (
        <div>
            {props.searchedpersons.map(person => 
            <p key={person.id}>
            {person.name} {person.number}
            <button onClick={ 
                        () => {
                            if (window.confirm(`Delete ${person.name}?`)) {
                                phonebookServices.deleteperson(person.id)
                                .then(response => {
                                    console.log(response)
                                    props.setPersons(props.persons.filter(p => p.id !== person.id))
                                })
                                .catch(error => {
                                    alert(
                                        `the person '${person.name}' was already deleted from server`
                                    )
                                    props.setPersons(props.persons.filter(p => p.id !== person.id))
                                })
                            }
                        }
                     }>delete</button>
            </p>
            )}
        </div>
    )
}

const Notification=({message,flag})=>{
    const successStyle={
        color:'green',
        background:'lightgrey',
        fontSize:20,
        borderStyle:'solid',
        borderRadius:5,
        padding:10,
        marginBottom:10
    }

    const errorStyle={
        color:'red',
        background:'lightgrey',
        fontSize:20,
        borderStyle:'solid',
        borderRadius:5,
        padding:10,
        marginBottom:10
    }

    if (message===null){
        return null
    }
    else if (flag==='error'){
        return (
            <div style={errorStyle}>
                {message}
            </div>
        )
    }
    else{
        return (
            <div style={successStyle}>
                {message}
            </div>
        )
    }
}

const App=()=>{
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    // const [newID, setNewID] = useState(5)
    const [newSearch, setNewSearch] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [flag, setFlag] = useState('')


    const addPerson = (event) => {
        event.preventDefault()
        // console.log('button clicked', event.target)
        const newperson = {
            name: newName,
            number: newNumber,
            // id: newID
            // date: new Date().toISOString(),
            // important: Math.random() < 0.5,
            // id: notes.length + 1,
          }
        if (persons.some(person => person.name === newName) ){
            // window.alert(`${newName} is already added to phonebook`)
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const person = persons.find(p => p.name === newName)
                const changedperson = { ...person, number: newNumber }
                phonebookServices.update(person.id, changedperson)
                .then(returnedperson => {
                    setPersons(persons.map(p => p.id !== person.id ? p : returnedperson))
                    setNewName('')
                    setNewNumber('')
                })
                .catch(error => {
                    // alert(
                    //     `the person '${person.name}' was already deleted from server`
                    // )
                    setFlag('error')
                    setErrorMessage(
                        `Information of '${person.name}' has already been removed from server`
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                    setPersons(persons.filter(p => p.id !== person.id))
                })
            }}
        else{

          phonebookServices.create(newperson)
          .then(returnedperson => {
            // console.log(response)
            setPersons(persons.concat(returnedperson))
            setNewName('')
            setNewNumber('')
            setFlag('success')
            setErrorMessage(
                `Added '${returnedperson.name}'`
            )
            setTimeout(() => {
                setErrorMessage(null)
            },5000)
          })
          .catch(error => {
            // console.log(error.response.data)
            setFlag('error')
            setErrorMessage(
                error.response.data.error
            )
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
          })

            // setPersons(persons.concat(newperson))
            // setNewName('')
            // setNewNumber('')
            // setNewID(newID + 1)
        }
      }
    
      const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
      }
    
      const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
      }
    
      const handleSearchChange = (event) => {
        console.log(event.target.value)
        setNewSearch(event.target.value)
      }
    
      const searchedpersons = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
    

    useEffect(()=>{
        console.log('effect')
        phonebook.getAll()
        .then(initialbook=>{
            // console.log('promise fulfilled')
            // setNotes(response.data)
            setPersons(initialbook)
            // console.log(response.data)
        })
    },[])

    return(
        <div>
        <h2>Phonebook</h2>
        <Filter newSearch = {newSearch} handleSearchChange = {handleSearchChange}/>
        <h2>add a new</h2>
        <Notification message={errorMessage} flag={flag}/>
        <PersonForm addPerson = {addPerson} newName = {newName} handleNameChange = {handleNameChange} newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
        <h2>Numbers</h2>
        <Persons searchedpersons = {searchedpersons} setPersons = {setPersons} persons = {persons}/>
        </div>

    )    
}


export default App