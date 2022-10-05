let React
let ReactDOM

window.onload = () => {
  const e = React.createElement
  function codeBlock (data) {
    return e('code', {}, JSON.stringify(data))
  };
  function User (user) {
    return e('div', { className: 'User' }, e(codeBlock, user))
  };
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(e(User, { id: 3 }))
}
