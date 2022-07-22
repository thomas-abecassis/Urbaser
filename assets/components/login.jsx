import React, { useEffect, useState } from 'react'

function getTokenStorage() {
  let object = JSON.parse(localStorage.getItem('urbaconnectToken'))
  if (object == null) return null
  let now = new Date().getTime()

  if (now < object.expiration) return object.token
  return null
}

function Login(props) {
  let [crentials, setCrentials] = useState({
    username: '',
    password: '',
  })

  const handleChange = ({ currentTarget }) => {
    let { name, value } = currentTarget
    setCrentials({ ...crentials, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendCrentials()
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
      body: JSON.stringify(crentials),
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
          },
          (error) => {
            //erreur du serveur
            props.setToken(-2)
          }
        )
    })
  }
  //appelé au début de cycle de vie du component, on regarde si l'utilisateur s'est déjà connecté précedemment,
  //si c'est le cas le token JWT est présent dans le localstorage
  useEffect(() => {
    let token = getTokenStorage()
    props.setToken(token)
  }, [])

  //A la connexion on met à jour le localstorage, cache le modal et set la variable login
  //A la deconnexion on retire le token du localstorage
  useEffect(() => {
    if (props.isLogin()) {
      var object = {
        token: props.token,
        expiration: new Date().getTime() + 2629800000,
      } //now + 1 month in ms
      localStorage.setItem('urbaconnectToken', JSON.stringify(object))
      let modalLogin = bootstrap.Modal.getInstance(
        document.getElementById('modalLogin')
      )
      if (modalLogin) modalLogin.hide()
    } else {
      localStorage.removeItem('urbaconnectToken')
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

              <input
                type="hidden"
                name="_csrf_token"
                value="{{ csrf_token('authenticate') }}"
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
