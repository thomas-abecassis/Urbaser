import React, { Fragment, Component, useState } from 'react'

function sendData(apiCall, data, auth = null) {
  let formData = new FormData()

  for (var key in data) {
    formData.append(key, data[key])
  }

  for (var key of formData.keys()) {
    console.log(key)
  }

  let init = {
    method: 'POST',
    body: formData,
    headers: {},
  }

  if (auth) {
    init.headers.Authorization = 'Bearer ' + auth
  }

  return fetch('/api/' + apiCall, init).then((response) => {
    if (response.status !== 200) {
      return -1
    } else
      return response.text().then(
        (text) => {
          return text
        },
        (error) => {
          return -2
        }
      )
  })
}

function ButtonAdmin(props) {
  let [image, setImage] = useState(null)
  let [errorImage, setErrorImage] = useState(false)

  const handleClickImage = (event) => {
    event.preventDefault()
    sendData(
      'uploadImage',
      { image: image, depot: props.depot },
      props.token
    ).then((ret) => {
      if (ret == '-1') {
        setErrorImage(true)
      } else {
        props.setBackground(ret)
      }
    })
  }

  return (
    <Fragment>
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
                <label htmlFor="inputUsername">Image de fond</label>
                <input
                  id="imageInput"
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={(event) => {
                    setImage(event.target.files[0])
                  }}
                />
                {errorImage && (
                  <div className="mt-2 alert alert-danger" role="alert">
                    Erreur lors de l'envoi de l'image au serveur
                  </div>
                )}
                {image && (
                  <Fragment>
                    <button
                      type="button"
                      className="mt-2 me-2 btn btn-secondary"
                      onClick={handleClickImage}
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => {
                        setImage(null)
                        document.getElementById('imageInput').value = ''
                      }}
                      className="mt-2 btn btn-danger"
                    >
                      Supprimer
                    </button>
                  </Fragment>
                )}
                {props.loaded &&
                  props.buttonsArray !== -1 &&
                  props.buttonsArray.map((button) => button.name)}
              </div>
            </form>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary btn-lg position-absolute bottom-0 end-0 me-5 mb-5 rounded-pill"
        data-bs-toggle="modal"
        data-bs-target="#modalAdmin"
      >
        Modifier le site
      </button>
    </Fragment>
  )
}

export default ButtonAdmin
