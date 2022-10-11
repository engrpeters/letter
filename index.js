const usersUrl = 'http://jsonplaceholder.typicode.com/users'
const postsUrl = 'http://jsonplaceholder.typicode.com/posts'

const checkInteger = (i) => {
  return typeof (i) === 'number'
}
const app = {
}
/**
 * Returns all users, returns single user if user id passed to the function.
 * @param {?number | undefined | null} userId A positive user id number
 *
 */
app.getUsersData = async (userId, userOnly) => {
  if (userId && !checkInteger(userId)) {
    throw new Error('Expected' + userId + 'to be a number')
  }

  const result = userId ? {} : []
  const url = userId ? usersUrl + '/' + userId : usersUrl
  const userResponse = await fetch(url).then(app.handleErrors)
    .catch((err) => {
      console.log(err)
      throw new Error(err.message)
    })
  if (!userResponse || !userResponse.ok) {
    console.log('There was an http error')
  } else {
    const userData = await userResponse.json()

    if (userOnly) {
      return userData
    } else {
      if (userData.length) {
        userData.forEach((element) => {
          app.getUsersPosts(element.id).then((posts) => {
            const letterObject = app.createUserLetter(element, posts)
            result.push(letterObject)
          })
          return result
        })
        return result
      } else {
        const userPosts = await app.getUsersPosts(userData.id)
        const letterObject = app.createUserLetter(userData, userPosts)
        Object.assign(result, letterObject)
        return result
      }
    }
  }

  return result
}
/**
 * Create a user letter object by appending user's post to user's data
 * @param {<Object>} userData an object of user's data
 * @param {Array.<Object>} posts an array of a single user's post
 */

app.createUserLetter = (user, posts) => {
  if (!posts.length) {
    throw new Error('Expected posts to be an array')
  }
  const userData = user
  const tmpPosts = posts
  const tmpAdr = userData.address
  const tmpComp = userData.company
  userData.address = `${tmpAdr.street},${tmpAdr.suite}. ${tmpAdr.zipcode} ${tmpAdr.city}`
  userData.company = tmpComp.name
  tmpPosts.forEach((el) => {
    delete el.userId
  })
  userData.posts = tmpPosts.slice()

  return userData
}
/**
 * Returns single user's posts if user id passed to the function,
 * returns a single post if a post's id or both parameters are passed, returns all users posts if no paramater is passed
 * @param {?number} userId A positive user id number
 * @param {?number} postId A positive post id number
 */
app.getUsersPosts = async (userId, postId) => {
  if ((userId && !checkInteger(userId)) && (postId && !checkInteger(postId))) {
    throw new TypeError('Expected userId or post to be a number')
  }
  const url = postId ? postsUrl + '/' + postId : postsUrl
  const searchParams = (userId && !postId)
    ? (new URLSearchParams({
        userId
      }))
    : ''
  const postsResponse = await fetch(url + '?' + searchParams).then(app.handleErrors)
  if (!postsResponse || !postsResponse.ok) {
    console.log(postsResponse)
  } else {
    const userPosts = await postsResponse.json()

    return userPosts
  }
}

app.handleErrors = (response) => {
  if ((!response.ok && !response.json) || !response.ok) {
    throw Error(response.statusText)
  }

  return response
}

export default app
