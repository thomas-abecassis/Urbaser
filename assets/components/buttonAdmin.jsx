import React, { Fragment, Component, useState } from 'react'

function ButtonAdmin(props) {
  let [image, setImage] = useState(null)

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
                {image && (
                  <Fragment>
                    <button
                      type="button"
                      className="mt-2 me-2 btn btn-secondary"
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Connexion
                </button>
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
