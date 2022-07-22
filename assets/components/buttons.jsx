import React, { Component, Fragment, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Button from './button.jsx'

function Buttons(props) {
  console.log(props.buttonsArray)
  return props.loaded ? (
    props.buttonsArray !== -1 && (
      <div className=" d-grid gap-2">
        {props.buttonsArray.map((button) => (
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
