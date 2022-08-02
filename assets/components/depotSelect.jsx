import React, { Component, Fragment, useEffect, useState } from 'react'
import Button from './button.jsx'
import { sendData } from './Utils.js'

function DepotSelect(props) {
  let [depots, setDepots] = useState([])

  useEffect(() => {
    sendData('/api/admin/depots', {}, props.token).then((ret) => {
      if (ret.code == 1) {
        setDepots(ret.data)
      }
    })
  }, [])

  const handleSelect = (e) => {
    let depotsFilter = depots.filter((depot) => depot.name == e.target.value)
    if (depotsFilter.length == 1) props.setDepot(depotsFilter[0].slug)
  }

  return (
    <div className="position-absolute w-100 mt-2 row justify-content-md-center">
      <div className="col col-lg-6">
        <select
          className=" form-select "
          aria-label="Default select example"
          onChange={handleSelect}
        >
          <option defaultValue>Selection dépot</option>
          {depots.map((depot) => (
            <option key={depot.slug}>{depot.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default DepotSelect
