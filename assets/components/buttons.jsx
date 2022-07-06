import React, { Component, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Button from './button.jsx'

//get url GET parameters
function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function Buttons(props) {
  let query = useQuery()
  let depot = query.get('depot')

  let [loaded, setLoaded] = useState(false)
  let [buttonsArray, setButtonsArray] = useState([])

  useEffect(() => {
    //à changer en production
    fetch('/api/tools/' + depot)
      .then((response) => response.json())
      .then(
        (response) => {
          setLoaded(true)
          setButtonsArray(response)
        },
        (error) => {
          console.trace(error)
          setLoaded(false)
          setButtonsArray(error)
        }
      )
  }, [])

  return loaded ? (
    <div className=" d-grid gap-2">
      {buttonsArray.map((button) => (
        <Button key={button.name} name={button.name} url={button.url}></Button>
      ))}
    </div>
  ) : (
    <div
      className="d-block text-primary spinner-border mx-auto"
      style={{ width: '5rem', height: '5rem' }}
      role="status"
    >
      <span className="sr-only"></span>
    </div>
  )
}

export default Buttons
