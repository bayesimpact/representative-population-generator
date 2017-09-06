export function getThing(){
  let headers = new Headers({
    'Access-Control-Allow-Origin':'*'
  });
  let init = {
    method: "GET",
    headers: headers,
    mode: "cors",
    cache: 'default'
  };

  return window.fetch('http://localhost:80/areas?areas=[{"county":"sanFrancisco","zip":94102}]', init);
}