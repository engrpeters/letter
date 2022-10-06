import app from './index.js'

window.onload = async () => {
  const e = React.createElement
  function CodeBlock (data) {
    console.log(JSON.stringify(data, null, '\t'))
    return e('code', {}, [JSON.stringify(data, null, 3)])
  };
  class UsersData extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        users: props.users
      }
    }

    render () {
      const userElements = this.state.users.map((el) => {
        return (e(User, { key: el.id, user: el }))
      })

      return (e('div', { className: 'users-data' }, userElements))
    }
  }
  function User (props) {
    return e('pre', { className: 'User' }, e(CodeBlock, props.user))
  };

  class App extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        users: []
      }
      this.loadUsersData().then((res) => {
        setTimeout(() => {
          this.setState({ users: res })
        }, 1000)
      })
    }

    async loadUsersData () {
      return await app.getUsersData()
    }

    render () {
      if (this.state.users.length) {
        return (e(UsersData, { users: this.state.users }, 'lago na wa'))
      } else {
        // console.log(this.state.users)
      }
    }
  }
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(e(App, {}, 'Jesus is Lord'))
}
