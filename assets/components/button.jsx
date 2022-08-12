import React from 'react'

function Button(props) {
  return (
    <a
      className="overflow-hidden btn btn-primary btn-lg btn-block mt-5 p-3"
      href={props.url}
      style={{ minHeight: '4rem' }}
    >
      {props.name}
    </a>
  )
}

export default Button
