import React, { Fragment, useState } from 'react'
import { sendData, checkPasswordStrength } from './Utils.js'

function AccountEdit(props) {
  let [returnCode, setReturnCode] = useState(0)
  let [newPassword, setNewPassword] = useState('')
  let [oldPassword, setOldPassword] = useState('')

  const editPassword = () => {
    setReturnCode(0)
    sendData(
      '/api/admin/editUser',
      { newPassword: newPassword, oldPassword: oldPassword },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
      let modalConfirmation = bootstrap.Modal.getInstance(
        document.getElementById('modalPasswordConfirmation')
      )
      let modalPassword = bootstrap.Modal.getInstance(
        document.getElementById('modalUserEdit')
      )
      modalConfirmation.hide()
      modalPassword.show()
    })
  }

  const passwordConfirmation = (
    <div
      className="modal fade"
      id="modalPasswordConfirmation"
      tabIndex="-1"
      aria-labelledby="confirmationMotDePasse"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation de mot de passe</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Êtes vous sûr de vouloir modifier votre mot de passe ?</p>
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
              onClick={editPassword}
              type="button"
              className="btn btn-primary"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Fragment>
      {passwordConfirmation}
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
                <label htmlFor="inputNewPassword">Ancien mot de passe</label>
                <input
                  type="password"
                  name="oldPassword"
                  id="inputOldPassword"
                  className="form-control mb-3"
                  onChange={(e) => {
                    setOldPassword(e.target.value)
                  }}
                />
                <label htmlFor="inputNewPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  id="inputNewPassword"
                  className="form-control mb-3"
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                  }}
                />
                {checkPasswordStrength(newPassword) && newPassword && (
                  <div className="d-block">
                    <button
                      type="button"
                      className=" mb-3 me-2 btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPasswordConfirmation"
                    >
                      Valider
                    </button>
                  </div>
                )}
                {!checkPasswordStrength(newPassword) && (
                  <p className="mt-1 d-block text-danger">
                    Le mot de passe doit faire plus de 7 caractères et contenir
                    au moins une minuscule et majuscule
                  </p>
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
                    L'ancien mot de passe ne correspond pas
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
    </Fragment>
  )
}

export default AccountEdit
