import React from 'react'

function Button(props) {
  return (
    <a className="btn btn-primary btn-lg btn-block mt-5 p-3" href={props.url}>
      {props.name}
    </a>
  )
}

export default Button
