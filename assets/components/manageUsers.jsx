import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function ManageUsers(props) {
  let [returnCode, setReturnCode] = useState(0)

  let [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  let [users, setUsers] = useState([])

  const resetUser = (id) => {
    sendData(
      '/api/admin/resetPassword',
      { credentials: JSON.stringify(credentials), id: id },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
    })
  }

  const deleteUser = (id) => {
    sendData(
      '/api/admin/deleteUser',
      { credentials: JSON.stringify(credentials), id: id },
      props.token
    ).then((ret) => {
      if (ret.code == 1) {
        setReturnCode(2)
        let newUsers = users.filter((user) => user.id != id)
        setUsers(newUsers)
      } else setReturnCode(ret.code)
    })
  }

  useEffect(() => {
    sendData(
      '/api/admin/users',
      { credentials: JSON.stringify(credentials) },
      props.token
    ).then((ret) => {
      if (ret.code == 1) setUsers(ret.users)
    })
  }, [])

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
                Le mot de passe de l'utilisateur a été réinitialiser
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
                  <th scope="col">Username</th>
                  <th scope="col">Depot</th>
                  <th scope="col">Gestion</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <th scope="row">{user.id}</th>
                    <td>{user.username}</td>
                    <td>{user.depot}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          resetUser(user.id)
                          setReturnCode(0)
                        }}
                      >
                        Réinitialiser
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          deleteUser(user.id)
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
