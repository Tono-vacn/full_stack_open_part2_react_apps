import React from 'react'

const Header = (props) => {
    console.log(props)
    return (
      <div>
        <h1>
        {props.name}
        </h1>
      </div>
    )
  }
  const Part = (props) => {
    return (
      <li>{props.name}{props.numbers}</li>  
    )
  }
  const Content = (props) => {
    // console.log(props.course.parts)
    return (
      <div>
      <ul>
      {props.parts.map(part => 
      <Part key={part.id} name={part.name} numbers={part.exercises}/>
      )}
      </ul>
      </div>
    )
  }
  
  const Total = (props) => {
    // console.log(props.course.parts)
    return (
      <div>
        <p>Total of exercise {props.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>
      </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        <Header name={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts}/>
      </div>
    )
  }

  export default Course