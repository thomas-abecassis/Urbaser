import React, { Fragment } from 'react'
import DepotModification from './depotModification.jsx'
import CreateUser from './createUser.jsx'
import ManageUsers from './manageUsers.jsx'
import AccountEdit from './accountEdit.jsx'
import CreateDepot from './createDepot.jsx'
import { ROLE_ADMIN } from './Utils.js'
import ButtonAdmin from './buttonAdmin.jsx'

function ButtonsAdmin(props) {
  const buttons = (isLarge) => (
    <Fragment>
      <ButtonAdmin
        isLarge={isLarge}
        name="Modifier mon compte"
        modalName="#modalUserEdit"
      />
      <ButtonAdmin
        isLarge={isLarge}
        name="Modifier le site"
        modalName="#modalAdmin"
      />
      {props.role.adminType == ROLE_ADMIN && (
        <ButtonAdmin
          isLarge={isLarge}
          name="Créer dépôt"
          modalName="#modalCreateDepot"
        />
      )}
      <ButtonAdmin
        isLarge={isLarge}
        name="Créer compte"
        modalName="#modalCreateUser"
      />
      <ButtonAdmin
        isLarge={isLarge}
        name="Gérer comptes"
        modalName="#modalManageUser"
      />
    </Fragment>
  )

  return (
    <Fragment>
      {props.isLogin() && props.depot && props.loaded && (
        <Fragment>
          <div className="d-none d-lg-block position-absolute bottom-0 end-0 me-4 mb-5">
            {buttons(true)}
          </div>
          <div className=" d-lg-none d-grid gap-2">{buttons(false)}</div>
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
      <CreateDepot setDepot={props.setDepot} token={props.token}></CreateDepot>
      <AccountEdit token={props.token}></AccountEdit>
    </Fragment>
  )
}

export default ButtonsAdmin
