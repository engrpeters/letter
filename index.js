const usersUrl = 'http://jsonplaceholder.typicode.com/users'
const postsUrl = 'http://jsonplaceholder.typicode.com/posts'

const checkInteger = (i) => {
  return typeof (i) === 'number'
}
const app = {
}
/**
 * Returns all users, returns single user if user id passed to the function.
 * @param {?number} userId A positive user id number
 */
app.getUsersData = async (userId) => {
  if (userId && !checkInteger(userId)) {
    throw new Error('Expected userId to be a number')
  }
  const result = userId ? {} : []
  const url = userId ? usersUrl + '/' + userId : usersUrl
  const userResponse = await fetch(url).then(app.handleErrors).catch((err) => {
    throw new Error(err.message)
  })
  if (!userResponse || !userResponse.ok) {
    console.log(userResponse)
  } else {
    const userData = await userResponse.json()
    if (userData.length) {
      userData.forEach(async (element) => {
        const userPosts = await app.getUsersPosts(element.id)
        const letterObject = app.createUserLetter(element, userPosts)
        result.push(letterObject)
      })
    } else {
      const userPosts = await app.getUsersPosts(userData.id)
      const letterObject = app.createUserLetter(userData, userPosts)
      Object.assign(result, letterObject)
    }
  }
  console.log(result)
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
  userData.address = `${tmpAdr.street},${tmpAdr.suite}. ${tmpAdr.zipcode} ${tmpAdr.city}`
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
  if (!checkInteger(userId) && !checkInteger(postId)) {
    throw new TypeError('Expected userId or post to be a number')
  }
  const url = postId ? postsUrl + '/ ' + postId : postsUrl
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
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}
