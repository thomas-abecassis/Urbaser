import React, { Fragment, useEffect, useState } from 'react'
import { ROLE_ADMIN, sendData } from './Utils.js'
import slugify from 'react-slugify'

function CreateDepot(props) {
  let [depotName, setDepotName] = useState()
  let [depotSlug, setDepotSlug] = useState()
  let [returnCode, setReturnCode] = useState()

  const handleSubmit = (event) => {
    event.preventDefault()
    setReturnCode(0)
    sendNewDepot()
  }

  const sendNewDepot = () => {
    sendData(
      '/api/admin/createDepot',
      {
        depotName: depotName,
        depotSlug: depotSlug,
      },
      props.token
    ).then((ret) => {
      setReturnCode(ret.code)
    })
  }

  return (
    <div
      className="modal fade"
      id="modalCreateDepot"
      tabIndex="-1"
      aria-labelledby="modalCreateDepotLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Créer un dépot</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              <label htmlFor="inputDepotName">Nom du dépot</label>
              <input
                type="text"
                id="inputDepotName"
                className="form-control"
                required
                onChange={(e) => {
                  setDepotName(e.target.value)
                  document.getElementById('inputDepotSlug').value = slugify(
                    e.target.value
                  )
                  setDepotSlug(slugify(e.target.value))
                }}
              />
              <label htmlFor="inputDepotSlug">Nom dans l'url</label>
              <input
                type="text"
                id="inputDepotSlug"
                className="form-control"
                required
                onChange={(e) => {
                  setDepotSlug(slugify(e.target.value))
                }}
              />
              {returnCode == 1 && (
                <p className="mt-1 d-block text-success">Dépot créé </p>
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
                  Slug de dépot déjà existant
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
                Créer le dépot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDepot
