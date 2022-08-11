import React, { useEffect, useState } from 'react'
import { sendData } from './Utils.js'

function DepotSelect(props) {
  let [depots, setDepots] = useState([])

  useEffect(() => {
    let findDepot = depots.find((depot) => depot.slug == props.depot)
    if (findDepot) return
    sendData('/api/admin/depots', {}, props.token).then((ret) => {
      if (ret.code == 1) {
        setDepots(ret.data)
      }
    })
  }, [props.depot])

  const handleSelect = (e) => {
    props.setDepot(e.target.value)
  }

  let findDepot = depots.find((depot) => depot.slug == props.depot)

  return (
    <select
      className=" form-select "
      aria-label="Default select example"
      onChange={handleSelect}
    >
      {findDepot && (
        <option key={findDepot.slug} value={findDepot.slug}>
          {findDepot.name}
        </option>
      )}
      {depots.map(
        (depot) =>
          (!findDepot || findDepot.slug != depot.slug) && (
            <option key={depot.slug} value={depot.slug}>
              {depot.name}
            </option>
          )
      )}
    </select>
  )
}

export default DepotSelect
