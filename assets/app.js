/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css'

// start the Stimulus application
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js')

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import logo from '../public/ressources/images/logo.png'
import NotFound from './components/notFound.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className="vh-100 d-flex flex-column">
      <nav className="navbar navbar-lg navbar-light bg-light">
        <a className="navbar-brand ms-5" href="#">
          <img
            src={logo}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt=""
          />
        </a>
      </nav>
      <Routes>
        <Route path="/depot/:depotSlug" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
)
