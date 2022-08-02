import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function AccountEdit(props) {
  let [returnCode, setReturnCode] = useState(0)
  let [newPassword, setNewPassword] = useState()

  const editPassword = () => {
    setReturnCode(0)
    sendData(
      '/api/admin/editUser',
      { newPassword: newPassword },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
    })
  }

  return (
    <div
      className="modal fade"
      id="modalUserEdit"
      tabIndex="-1"
      aria-labelledby="modalEditUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier mon mot de passe</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              <label htmlFor="inputNewPassword">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="inputNewPassword"
                className="form-control mb-3"
                onChange={(e) => {
                  setNewPassword(e.target.value)
                }}
              />
              {newPassword && (
                <div className="d-block">
                  <button
                    type="button"
                    className=" mb-3 me-2 btn btn-secondary"
                    onClick={editPassword}
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setNewPassword(null)
                      document.getElementById('inputNewPassword').value = ''
                    }}
                    className="mb-3 btn btn-danger"
                  >
                    Annuler
                  </button>
                </div>
              )}
              {returnCode == 1 && (
                <p className="mt-1 d-block text-success">
                  Modification enregistrée
                </p>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountEdit
