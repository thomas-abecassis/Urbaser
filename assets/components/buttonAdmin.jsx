import React, { Fragment, Component, useState, useEffect } from 'react'

function sendData(apiCall, data, auth = null) {
  let formData = new FormData()

  for (var key in data) {
    formData.append(key, data[key])
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

function deepComparison(array1, array2) {
  let arrString1 = JSON.stringify(array1)
  let arrString2 = JSON.stringify(array2)
  return arrString1 == arrString2
}

function ButtonAdmin(props) {
  const [image, setImage] = useState(null)
  const [newButtons, setNewButtons] = useState([])
  const [error, setError] = useState(false)

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
        setImage(null)
      }
    })
  }

  const handleClickTools = (event) => {
    event.preventDefault()
    sendData(
      'uploadTools',
      {
        tools: JSON.stringify(newButtons),
        depot: props.depot,
      },
      props.token
    ).then((ret) => {
      if (ret == '-1') {
        setError(true)
      } else {
        props.setButtonsArray(JSON.parse(JSON.stringify(newButtons)))
      }
    })
  }

  useEffect(() => {
    setNewButtons(JSON.parse(JSON.stringify(props.buttonsArray))) //deep copy
  }, [])

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
                {error && (
                  <div className="mt-2 alert alert-danger" role="alert">
                    Erreur lors de l'envoi au serveur
                  </div>
                )}
                <label className="form-label">Image de fond</label>
                <input
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
                        setNewButtons(
                          JSON.parse(JSON.stringify(props.buttonsArray))
                        )
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
