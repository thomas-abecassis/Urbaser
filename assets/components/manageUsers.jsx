import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function ManageUsers(props) {
  let [returnCode, setReturnCode] = useState(0)
  let [users, setUsers] = useState([])

  const resetUser = (username) => {
    sendData(
      '/api/admin/resetPassword',
      { username: username },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
    })
  }

  const deleteUser = (username) => {
    sendData('/api/admin/deleteUser', { username: username }, props.token).then(
      (ret) => {
        if (ret.code == 1) {
          setReturnCode(2)
          let newUsers = users.filter((user) => user.username != username)
          setUsers(newUsers)
        } else setReturnCode(ret.code)
      }
    )
  }

  //On met à jour la liste d'utilisateur si on est au premier render ou si un nouveau utilisateur a été créé
  useEffect(() => {
    if (props.newUserCreated != false) {
      sendData('/api/admin/users', {}, props.token).then((ret) => {
        if (ret.code == 1) setUsers(ret.users)
      })
    }
  }, [props.newUserCreated])

  return (
    <div
      className="modal fade"
      id="modalManageUser"
      tabIndex="-1"
      aria-labelledby="modalManageUserLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gestion des comptes</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {returnCode == 1 && (
              <div className="mt-2 alert alert-success" role="alert">
                Le mot de passe de l'utilisateur a été réinitialisé
              </div>
            )}
            {returnCode == 2 && (
              <div className="mt-2 alert alert-success" role="alert">
                L'utilisateur a été supprimé
              </div>
            )}
            {(returnCode == -1 || returnCode == -2 || returnCode == -3) && (
              <div className="mt-2 alert alert-danger" role="alert">
                Erreur lors de l'envoi au serveur
              </div>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th style={{ whiteSpace: 'nowrap' }} scope="col">
                    Comptes
                  </th>
                  <th scope="col">Depot</th>
                  <th scope="col">Gestion</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <th scope="row">{user.id}</th>
                    <td>{user.username}</td>
                    <td>{user.depot}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          resetUser(user.username)
                          setReturnCode(0)
                        }}
                      >
                        Réinitialiser
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          deleteUser(user.username)
                          setReturnCode(0)
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
