import React from 'react'

function LoginForm(props) {
  let element = document.querySelector('.js-csrf')
  let crsf = element.dataset.crsf

  return (
    <div className="mt-5 container">
      <form method="post">
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
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
        <input type="hidden" name="_csrf_token" value={crsf}></input>
        <button className="mt-2 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
      </form>
    </div>
  )
}

export default LoginForm
