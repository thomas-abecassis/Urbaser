import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function CreateUser(props) {
  let [returnCode, setReturnCode] = useState(0)
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
    setReturnCode(0)
    sendNewUser()
  }

  const sendNewUser = () => {
    sendData(
      '/api/admin/createUser',
      { credentials: JSON.stringify(credentials) },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
    })
  }

  return (
    <div
      className="modal fade"
      id="modalCreateUser"
      tabIndex="-1"
      aria-labelledby="modalCreateUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Créer un admin</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              <label htmlFor="inputUsername">Nom d'utilisateur</label>
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
              <label htmlFor="inputPassword">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="inputPassword"
                className="form-control"
                autoComplete="current-password"
                required
                onChange={handleChange}
              />
              {returnCode == 1 && (
                <p className="mt-1 d-block text-success">Utilisateur créé </p>
              )}
              {returnCode == -1 && (
                <p className="mt-1 d-block text-danger">
                  Problème de communication avec le serveur
                </p>
              )}
              {returnCode == -2 && (
                <p className="mt-1 d-block text-danger">
                  Problème de communication avec le serveur
                </p>
              )}
              {returnCode == -3 && (
                <p className="mt-1 d-block text-danger">
                  Nom d'utilisateur déjà existant
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fermer
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
                Créer l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
