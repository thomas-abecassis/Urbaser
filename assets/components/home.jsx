import React, { useEffect, Fragment, useState } from 'react'
import Buttons from './buttons.jsx'
import ButtonsAdmin from './buttonsAdmin.jsx'
import DepotSelect from './depotSelect.jsx'
import Login from './login.jsx'
import { ROLE_ADMIN, ROLE_ADMIN_DEPOT } from './Utils.js'

//get url GET parameters with rewrite (corresponding of our depot)
function getDepot() {
  var params = window.location.pathname.split('/').splice(-1)
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
  let [background, setBackground] = useState()
  let [role, setRole] = useState({ adminType: 0, depot: null })

  //appelé au début de cycle de vie du component, on regarde si l'utilisateur s'est déjà connecté précedemment,
  //si c'est le cas le token JWT est présent dans le localstorage
  useEffect(() => {
    let token = getTokenStorage()
    setToken(token)
    let dpt = getDepot()
    setDepot(dpt)
  }, [])

  useEffect(() => {
    if (!depot) return

    history.replaceState(null, '', depot)
    //à changer en production
    fetch('/api/tools/' + depot)
      .then((response) => response.json())
      .then(
        (response) => {
          setLoaded(true)
          if (response.code == 1) {
            setButtonsArray(response.data.tools)
            setBackground(response.data.image)
            setError(false)
          } else {
            setButtonsArray([])
            setError(true)
          }
        },
        (error) => {
          setLoaded(true)
          setButtonsArray(-1)
          setError(true)
        }
      )
  }, [depot])

  const isLogin = () => {
    return token && token !== -1 && token !== -2
  }

  return (
    <Fragment>
      <div
        className="container-fluid d-flex flex-column flex-grow-1 bg-image"
        style={
          background
            ? {
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/uploads/" +
                  background +
                  "')",
                backgroundSize: 'cover',
              }
            : {
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/uploads/defaultBackground.jpg')",
                backgroundSize: 'cover',
              }
        }
      >
        <div className="position-absolute w-100 mt-2 row justify-content-md-center">
          <div className="container">
            {error && (
              <div className="mt-2 alert alert-danger" role="alert">
                Il semblerait que le dépot fournit dans l'URL n'existe pas
              </div>
            )}
          </div>
          <div className="col col-lg-6">
            {role.adminType == ROLE_ADMIN && (
              <DepotSelect
                token={token}
                setDepot={setDepot}
                depot={depot}
              ></DepotSelect>
            )}
          </div>
        </div>
        <div className="row justify-content-md-center align-items-center flex-grow-1">
          <div className="col col-lg-6">
            <Buttons buttonsArray={buttonsArray} loaded={loaded} />
            {!error &&
              (role.adminType == ROLE_ADMIN ||
                (role.adminType == ROLE_ADMIN_DEPOT &&
                  role.depot == depot)) && (
                <ButtonsAdmin
                  depot={depot}
                  loaded={loaded}
                  token={token}
                  buttonsArray={buttonsArray}
                  setButtonsArray={setButtonsArray}
                  setBackground={setBackground}
                  setToken={setToken}
                  isLogin={isLogin}
                  setRole={setRole}
                  role={role}
                  setDepot={setDepot}
                />
              )}
          </div>
        </div>

        <Login setRole={setRole} setToken={setToken} token={token}></Login>
        <div className="mt-auto text-center p-3 ">
          {isLogin() ? (
            <Fragment>
              <a
                href="#"
                className="link-secondary"
                onClick={() => {
                  setToken(null)
                  setRole(0)
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
        </div>
      </div>
    </Fragment>
  )
}

export default Home
