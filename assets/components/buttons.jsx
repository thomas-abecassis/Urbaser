import React, { Component, Fragment, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Button from './button.jsx'

//get url GET parameters with rewrite (corresponding of our depot)
function getDepot() {
  var params = window.location.pathname.split('/').slice(1)
  console.log(params)
  return params
}

function Buttons(props) {
  let depot = getDepot()

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
          setLoaded(true)
          setButtonsArray(-1)
          props.setError(true)
        }
      )
  }, [])

  return loaded ? (
    buttonsArray == -1 ? (
      <Fragment></Fragment>
    ) : (
      <div className=" d-grid gap-2">
        {buttonsArray.map((button) => (
          <Button
            key={button.name}
            name={button.name}
            url={button.url}
          ></Button>
        ))}
      </div>
    )
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
