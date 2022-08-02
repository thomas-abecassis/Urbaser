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
    props.setDepot(e.target.value)
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
            <option key={depot.slug} value={depot.slug}>
              {depot.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default DepotSelect
