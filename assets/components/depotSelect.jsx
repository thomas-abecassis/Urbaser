import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function DepotSelect(props) {
  let [depots, setDepots] = useState([])
  let [depotCourant, setDepotCourant] = useState()

  //On met à jour la liste de dépots du select + setDepotCourant
  useEffect(() => {
    sendData('/api/admin/depots', {}, props.token).then((ret) => {
      if (ret.code == 1) {
        setDepots(ret.data)
        setDepotCourant(ret.data.find((depot) => depot.slug == props.depot))
      }
    })
  }, [props.depot])

  const handleSelect = (e) => {
    props.setDepot(e.target.value)
  }

  return (
    <select
      className=" form-select "
      aria-label="Default select example"
      onChange={handleSelect}
      value={depotCourant && depotCourant.slug}
    >
      {depotCourant && (
        <option key={depotCourant.slug} value={depotCourant.slug}>
          {depotCourant.name}
        </option>
      )}
      {depots.map(
        (depot) =>
          (!depotCourant || depotCourant.slug != depot.slug) && (
            <option key={depot.slug} value={depot.slug}>
              {depot.name}
            </option>
          )
      )}
    </select>
  )
}

export default DepotSelect
