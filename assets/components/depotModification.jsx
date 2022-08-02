import React, { Component, useState, useEffect } from 'react'
import { deepCopy, deepComparison, sendData } from './Utils.js'

function DepotModification(props) {
  const [image, setImage] = useState(null)
  const [newButtons, setNewButtons] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    setNewButtons(deepCopy(props.buttonsArray)) //deep copy
  }, [props.buttonsArray])

  const handleClickImage = (event) => {
    event.preventDefault()
    sendData(
      '/api/admin/uploadImage',
      { image: image, depot: props.depot },
      props.token
    ).then((ret) => {
      if (ret.code == -1 || ret.code == -2) {
        setErrorImage(true)
      } else {
        props.setBackground(ret.file)
        setImage(null)
      }
    })
  }

  const handleClickTools = (event) => {
    event.preventDefault()
    sendData(
      '/api/admin/uploadTools',
      {
        tools: JSON.stringify(newButtons),
        depot: props.depot,
      },
      props.token
    ).then((ret) => {
      if (ret.code == -1 || ret.code == -2) {
        setError(true)
      } else {
        props.setButtonsArray(deepCopy(newButtons))
      }
    })
  }

  return (
    <div
      className="modal fade"
      id="modalAdmin"
      tabIndex="-1"
      aria-labelledby="modalAdmin"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier site</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              {error && (
                <div className="mt-2 alert alert-danger" role="alert">
                  Erreur lors de l'envoi au serveur
                </div>
              )}
              <label className="form-label">Image de fond</label>
              <input
                id="imageInput"
                type="file"
                name="image"
                className=" mb-3 form-control"
                onChange={(event) => {
                  setImage(event.target.files[0])
                }}
              />
              {image && (
                <div className="d-block">
                  <button
                    type="button"
                    className=" mb-3 me-2 btn btn-secondary"
                    onClick={handleClickImage}
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setImage(null)
                      document.getElementById('imageInput').value = ''
                    }}
                    className="mb-3 btn btn-danger"
                  >
                    Annuler
                  </button>
                </div>
              )}
              <label className="form-label">Outils</label>
              {newButtons.map((button, index) => (
                <div className="input-group mb-3" key={'button' + button.id}>
                  <input
                    type="text"
                    className="form-control"
                    value={button.name}
                    aria-label="nom outil"
                    onChange={(event) => {
                      let arrCopy = [...newButtons]
                      arrCopy[index].name = event.target.value
                      setNewButtons(arrCopy)
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={button.url}
                    aria-label="url outil"
                    onChange={(event) => {
                      let arrCopy = [...newButtons]
                      arrCopy[index].url = event.target.value
                      setNewButtons(arrCopy)
                    }}
                  />
                </div>
              ))}
              {!deepComparison(props.buttonsArray, newButtons) && (
                <div className="d-block">
                  <button
                    type="button"
                    className=" mb-3 me-2 btn btn-secondary"
                    onClick={handleClickTools}
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setNewButtons(deepCopy(props.buttonsArray))
                    }}
                    className="mb-3 btn btn-danger"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DepotModification
