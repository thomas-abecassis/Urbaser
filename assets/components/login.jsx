import React, { useEffect, useState } from 'react'

function getTokenStorage() {
  let object = JSON.parse(localStorage.getItem('urbaconnectToken'))
  if (object == null) return null
  let now = new Date().getTime()

  if (now < object.expiration) return object.token
  return null
}

function Login(props) {
  let [token, setToken] = useState()
  let [crentials, setCrentials] = useState({
    username: '',
    password: '',
  })

  const handleChange = ({ currentTarget }) => {
    let { name, value } = currentTarget
    setCrentials({ ...crentials, [name]: value })
  }

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
        setToken(-1)
      } else
        return response.json().then(
          (json) => {
            //Bon mot de passe
            setToken(json.token)
          },
          (error) => {
            setToken(-2)
          }
        )
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendCrentials()
  }

  useEffect(() => {
    let token = getTokenStorage()

    if (token !== null) {
      props.setLogin(true)
      return
    }
  }, [])

  useEffect(() => {
    if (token && token !== -2 && token !== -1) {
      var object = {
        token: token,
        expiration: new Date().getTime() + 2629800000,
      } //now + 1 month in ms
      localStorage.setItem('urbaconnectToken', JSON.stringify(object))
      let modalLogin = bootstrap.Modal.getInstance(
        document.getElementById('modalLogin')
      )
      modalLogin.hide()
      props.setLogin(true)
    }
  }, [token])

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
              {token == -1 && (
                <p className="mt-1 d-block text-danger">
                  Nom d'utilisateur ou mot de passe erroné(s)
                </p>
              )}
              {token == -2 && (
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
