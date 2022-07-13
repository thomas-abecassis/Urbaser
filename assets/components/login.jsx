import React, { useState } from 'react'

function Login() {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 class="modal-title">Connexion</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form method="post">
            <div className="modal-body">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                name="username"
                id="inputUsername"
                className="form-control"
                autoComplete="username"
                required
                autoFocus
              />
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                name="password"
                id="inputPassword"
                className="form-control"
                autoComplete="current-password"
                required
              />

              <input
                type="hidden"
                name="_csrf_token"
                value="{{ csrf_token('authenticate') }}"
              />
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
  )
}

export default Login
