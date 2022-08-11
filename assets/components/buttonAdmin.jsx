import React from 'react'

function ButtonAdmin(props) {
  return (
    <button
      href="#"
      className={
        props.isLarge
          ? 'd-block mb-3 btn btn-primary btn-lg rounded-pill'
          : 'btn btn-primary btn-lg btn-block mt-5 p-3 rounded-pill'
      }
      data-bs-toggle="modal"
      data-bs-target={props.modalName}
    >
      {props.name}
    </button>
  )
}

export default ButtonAdmin
