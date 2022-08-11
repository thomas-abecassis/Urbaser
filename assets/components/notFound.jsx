import React from 'react'

function NotFound() {
  return (
    <div className="vh-100 d-flex justify-content-center align-content-center flex-wrap">
      <h1
        style={{ height: 'fit-content' }}
        className="me-3 pe-3 align-top border-end d-inline-block align-content-center"
      >
        404
      </h1>
      <div
        style={{ height: 'fit-content' }}
        className="d-inline-block align-middle"
      >
        <h2 className="mt-2 font-weight-normal lead" id="desc">
          La page recherchée n'existe pas
        </h2>
      </div>
    </div>
  )
}

export default NotFound
