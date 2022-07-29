import React, { useEffect, Fragment, useState } from 'react'
import Buttons from './buttons.jsx'
import logo from '../../public/ressources/images/logo.png'
import ButtonsAdmin from './buttonsAdmin.jsx'

function getImg() {
  let bg = document.querySelector('.js-background')
  return bg.dataset.background
}

//get url GET parameters with rewrite (corresponding of our depot)
function getDepot() {
  var params = window.location.pathname.split('/').slice(1)[0]
  return params
}

//return jwt token if expiration date is valid
function getTokenStorage() {
  let object = JSON.parse(localStorage.getItem('urbaconnectToken'))
  if (object == null) return null
  let now = new Date().getTime()

  if (now < object.expiration) return object.token
  return null
}

function Home() {
  let [error, setError] = useState(false)
  let [token, setToken] = useState()
  let [loaded, setLoaded] = useState(false)
  let [buttonsArray, setButtonsArray] = useState([])
  let [depot, setDepot] = useState(null)
  let [background, setBackground] = useState(null)

  //appelé au début de cycle de vie du component, on regarde si l'utilisateur s'est déjà connecté précedemment,
  //si c'est le cas le token JWT est présent dans le localstorage
  useEffect(() => {
    let token = getTokenStorage()
    setToken(token)
  }, [])

  useEffect(() => {
    setBackground(getImg())

    let dpt = getDepot()
    setDepot(dpt)

    //à changer en production
    fetch('/api/tools/' + dpt)
      .then((response) => response.json())
      .then(
        (response) => {
          setLoaded(true)
          setButtonsArray(response)
        },
        (error) => {
          setLoaded(true)
          setButtonsArray(-1)
          setError(true)
        }
      )
  }, [])

  const isLogin = () => {
    return token && token !== -1 && token !== -2
  }

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
              background +
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
              <Buttons buttonsArray={buttonsArray} loaded={loaded} />
            </div>
          </div>
        </div>
        {
          <ButtonsAdmin
            depot={depot}
            loaded={loaded}
            token={token}
            buttonsArray={buttonsArray}
            setButtonsArray={setButtonsArray}
            setBackground={setBackground}
            setToken={setToken}
            isLogin={isLogin}
          />
        }
      </div>
      <footer className="fixed-bottom text-center p-3 ">
        {isLogin() ? (
          <Fragment>
            <a
              href="#"
              className="link-secondary"
              onClick={() => {
                setToken(null)
                localStorage.removeItem('urbaconnectToken')
              }}
            >
              Déconnexion
            </a>
          </Fragment>
        ) : (
          <a
            href="#"
            className="link-secondary"
            data-bs-toggle="modal"
            data-bs-target="#modalLogin"
          >
            Connexion
          </a>
        )}
      </footer>
    </Fragment>
  )
}

export default Home
