import React, { Fragment } from 'react'
import DepotModification from './depotModification.jsx'
import CreateUser from './createUser.jsx'
import ManageUsers from './manageUsers.jsx'
import AccountEdit from './accountEdit.jsx'
import CreateDepot from './createDepot.jsx'
import { ROLE_ADMIN } from './Utils.js'

function ButtonsAdmin(props) {
  return (
    <Fragment>
      {props.isLogin() && props.depot && props.loaded && (
        <Fragment>
          <div className=" position-absolute bottom-0 end-0 me-5 mb-5">
            <button
              type="button"
              className="d-block mb-3 btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalUserEdit"
            >
              Modifier mon compte
            </button>
            <button
              type="button"
              className="d-block mb-3 btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalAdmin"
            >
              Modifier le site
            </button>
            {props.role == ROLE_ADMIN && (
              <button
                href="#"
                className="d-block mb-3 btn btn-primary btn-lg rounded-pill"
                data-bs-toggle="modal"
                data-bs-target="#modalCreateDepot"
              >
                Créer dépot
              </button>
            )}
            <button
              href="#"
              className="d-block mb-3 btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalCreateUser"
            >
              Création Compte
            </button>
            <button
              href="#"
              className="btn btn-primary btn-lg rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#modalManageUser"
            >
              Gestion Comptes
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
      {props.isLogin() && props.depot && props.loaded && (
        <CreateUser role={props.role} token={props.token} />
      )}
      {props.isLogin() && props.depot && props.loaded && (
        <ManageUsers role={props.role} token={props.token} />
      )}
      <CreateDepot token={props.token}></CreateDepot>
      <AccountEdit token={props.token}></AccountEdit>
    </Fragment>
  )
}

export default ButtonsAdmin
