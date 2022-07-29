export function sendData(url, data, auth = null) {
  let formData = new FormData()

  for (var key in data) {
    formData.append(key, data[key])
  }

  let init = {
    method: 'POST',
    body: formData,
    headers: {},
  }

  if (auth) {
    init.headers.Authorization = 'Bearer ' + auth
  }

  return myFetch(url, init)
}

function myFetch(url, init) {
  return fetch(url, init).then((response) => {
    if (response.status !== 200) {
      return { code: -1 }
    } else
      return response.json().then(
        (json) => {
          return json
        },
        (error) => {
          return { code: -2 }
        }
      )
  })
}

export function deepComparison(array1, array2) {
  let arrString1 = JSON.stringify(array1)
  let arrString2 = JSON.stringify(array2)
  return arrString1 == arrString2
}

export function deepCopy(array) {
  return JSON.parse(JSON.stringify(array))
}
