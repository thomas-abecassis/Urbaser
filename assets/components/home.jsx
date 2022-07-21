import React, { Fragment, useState } from 'react'
import Buttons from './buttons.jsx'
import Login from './login.jsx'
import logo from '../../public/ressources/images/logo.png'
import ButtonAdmin from './buttonAdmin.jsx'

function getImg() {
  let bg = document.querySelector('.js-background')
  return bg.dataset.background
}

function Home() {
  let [error, setError] = useState(false)
  let [login, setLogin] = useState(false)

  return (
    <Fragment>
      <div className="vh-100 d-flex flex-column">
        <nav className="navbar navbar-lg navbar-light bg-light">
          <a className="navbar-brand ms-5" href="#">
            <img
              src={logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt=""
            />
          </a>
        </nav>
        <div
          className="container-fluid d-flex flex-column flex-grow-1 bg-image"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/uploads/" +
              getImg() +
              "')",
            backgroundSize: 'cover',
          }}
        >
          {error && (
            <div className="mt-2 alert alert-danger" role="alert">
              Il semblerait que le dépot fournit dans l'URL n'existe pas
            </div>
          )}
          <div className="row justify-content-md-center align-items-center flex-grow-1">
            <div className="col col-lg-6">
              <Buttons setError={setError} />
            </div>
          </div>
        </div>
        {login && <ButtonAdmin></ButtonAdmin>}
      </div>
      <Login setLogin={setLogin}></Login>
      <footer className="fixed-bottom text-center p-3 ">
        <a
          href="#"
          className="link-secondary"
          data-bs-toggle="modal"
          data-bs-target="#modalLogin"
        >
          Login
        </a>
      </footer>
    </Fragment>
  )
}

export default Home
