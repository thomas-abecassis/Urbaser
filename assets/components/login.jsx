import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function setTokenLocalStorage(token) {
  var object = {
    token: token,
    expiration: new Date().getTime() + 2629800000,
  } //now + 1 month in ms
  localStorage.setItem('urbaconnectToken', JSON.stringify(object))
}

function Login(props) {
  let [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })

  const handleChange = ({ currentTarget }) => {
    let { name, value } = currentTarget
    setCredentials({ ...credentials, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendCrentials()
  }

  const getRole = (token) => {
    sendData('/api/admin/role', {}, token).then((ret) => {
      if (ret.code != -1) props.setRole(ret.data)
      console.log(ret.data)
    })
  }

  //envoit username + mot de passe à l'api, si la combinaison est bonne le serveur renvoie un token JWT et on le set,
  // si elle est mauvaise on set le token a -1, si le serveur a une erreur a -2
  const sendCrentials = () => {
    let init = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }

    return fetch('/api/login_check', init).then((response) => {
      if (response.status == 401) {
        //Si on met le mauvais mot de passe
        props.setToken(-1)
      } else
        return response.json().then(
          (json) => {
            //Bon mot de passe
            props.setToken(json.token)
            getRole(json.token)
          },
          (error) => {
            //erreur du serveur
            props.setToken(-2)
          }
        )
    })
  }
  //A la connexion on met à jour le localstorage, cache le modal et set la variable login
  //A la deconnexion on retire le token du localstorage
  useEffect(() => {
    if (props.token && props.token !== -1 && props.token !== -2) {
      getRole(props.token)
      setTokenLocalStorage(props.token)
      let modalLogin = bootstrap.Modal.getInstance(
        document.getElementById('modalLogin')
      )
      if (modalLogin) modalLogin.hide()
    }
  }, [props.token])

  return (
    <div
      className="modal fade"
      id="modalLogin"
      tabIndex="-1"
      aria-labelledby="modalLoginLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Connexion</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                name="username"
                id="inputUsername"
                className="form-control"
                autoComplete="username"
                required
                autoFocus
                onChange={handleChange}
              />
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                name="password"
                id="inputPassword"
                className="form-control"
                autoComplete="current-password"
                required
                onChange={handleChange}
              />
              {props.token == -1 && (
                <p className="mt-1 d-block text-danger">
                  Nom d'utilisateur ou mot de passe erroné(s)
                </p>
              )}
              {props.token == -2 && (
                <p className="mt-1 d-block text-danger">
                  Problème de communication avec le serveur
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
                Connexion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
