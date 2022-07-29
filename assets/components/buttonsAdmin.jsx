import React, { Fragment } from 'react'
import DepotModification from './depotModification.jsx'
import Login from './login.jsx'
import CreateUser from './createUser.jsx'
import ManageUsers from './manageUsers.jsx'

function ButtonsAdmin(props) {
  return (
    <Fragment>
      {props.isLogin() && props.depot && props.loaded && (
        <Fragment>
          {' '}
          <div className=" position-absolute bottom-0 end-0 me-5 mb-5">
            <button
              type="button"
              className="d-block mb-3 btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalAdmin"
            >
              Modifier le site
            </button>
            <button
              href="#"
              className="btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalCreateUser"
            >
              Création Compte
            </button>
          </div>
          <DepotModification
            token={props.token}
            buttonsArray={props.buttonsArray}
            depot={props.depot}
            setBackground={props.setBackground}
            setButtonsArray={props.setButtonsArray}
          ></DepotModification>
        </Fragment>
      )}
      <Login setToken={props.setToken} token={props.token}></Login>
      <CreateUser token={props.token} />
      <ManageUsers token={props.token} />
    </Fragment>
  )
}

export default ButtonsAdmin
