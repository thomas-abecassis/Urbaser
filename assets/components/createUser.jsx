import React, { Fragment, useEffect, useState } from 'react'
import {
  ROLE_ADMIN,
  sendData,
  checkPasswordStrength,
  ROLE_ADMIN_DEPOT,
} from './Utils.js'

function CreateUser(props) {
  let [depots, setDepots] = useState([])
  let [depot, setDepot] = useState()
  let [adminType, setAdminType] = useState(1)
  let [returnCode, setReturnCode] = useState(0)
  let [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })

  const handleChangeCredentials = ({ currentTarget }) => {
    let { name, value } = currentTarget
    setCredentials({ ...credentials, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setReturnCode(0)
    sendNewUser()
  }

  const sendNewUser = () => {
    let dep = depot
    if (props.role.adminType == ROLE_ADMIN_DEPOT) dep = props.role.depot
    sendData(
      '/api/admin/createUser',
      {
        credentials: JSON.stringify(credentials),
        adminType: adminType,
        depot: dep,
      },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
      if (ret.code == 1) props.setNewUserCreated(true)
      else props.setNewUserCreated(false)
    })
  }

  useEffect(() => {
    sendData('/api/admin/depots', {}, props.token).then((ret) => {
      if (ret.code == 1) {
        setDepots(ret.data)
      }
    })
  }, [props.depot])

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
              {props.role.adminType == ROLE_ADMIN && (
                <Fragment>
                  <label htmlFor="inputAdminType">Type d'administrateur</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => {
                      setAdminType(e.target.value)
                    }}
                  >
                    <option value="1">Admin de dépot</option>
                    <option value="2">Admin</option>
                  </select>
                  {adminType == 1 && (
                    <Fragment>
                      <label htmlFor=" mt-2 inputAdminType">
                        Affectation dépot
                      </label>
                      <select
                        className=" form-select"
                        aria-label="Default select example"
                        onChange={(e) => {
                          setDepot(e.target.value)
                        }}
                      >
                        {depots.map((depot) => (
                          <option key={depot.slug} value={depot.slug}>
                            {depot.name}
                          </option>
                        ))}
                      </select>
                    </Fragment>
                  )}
                </Fragment>
              )}

              <label htmlFor="inputUsername">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                id="inputUsername"
                className="form-control"
                autoComplete="username"
                required
                autoFocus
                onChange={handleChangeCredentials}
              />
              <label htmlFor="inputPassword">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="inputPassword"
                className="form-control"
                autoComplete="current-password"
                required
                onChange={handleChangeCredentials}
              />
              {!checkPasswordStrength(credentials.password) && (
                <p className="mt-1 d-block text-danger">
                  Le mot de passe doit faire plus de 7 caractères et contenir au
                  moins une minuscule et majuscule
                </p>
              )}
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
              {checkPasswordStrength(credentials.password) &&
                credentials.username && (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Créer l'utilisateur
                  </button>
                )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
