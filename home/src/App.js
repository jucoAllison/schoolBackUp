import React, {useRef, useEffect} from 'react'
import './App.css'
const App = () => {
let input = useRef()
 
 
    return (
    <div>
       <form className="form" onSubmit={e=>{
         e.preventDefault();
         console.log(input.current.value)
       }}>
       <input ref={input} type="text"/>
       </form>
    </div>
  )
}

export default App;
