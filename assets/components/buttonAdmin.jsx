import React, { Component } from 'react'

function ButtonAdmin(props) {
  return (
    <button
      href={props.url}
      type="button"
      className="btn btn-primary btn-lg position-absolute bottom-0 end-0 me-5 mb-5 rounded-pill"
    >
      Modifier le site
    </button>
  )
}

export default ButtonAdmin
