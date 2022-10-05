const usersUrl = "http://jsonplaceholder.typicode.com/users"
const postsUrl = "http://jsonplaceholder.typicode.com/posts"

const app = {
}

/**
 * Returns all users, returns single user if user id passed to the function.
 * @param {?number} userId A positive user id number
 */
app.getUsersData = async (userId)=>{
    //If userId is supplied then fetch for a single user
    var result = userId ? {} : [];
    let url = userId? usersUrl + "/" + userId : usersUrl
    let userResponse = await fetch(url).then(app.handleErrors).catch((err)=>{
        throw new Error();
    })
    if(!userResponse || !userResponse.ok){
        //An Error Occured
     
    }else{
        var userData = await userResponse.json()
        if(userData.length){
            userData.forEach(async (element , index) => {
                let userPosts = await app.getUsersPosts(element.id);
                let letterObject = app.createUserLetter(element,userPosts);
                result.push(letterObject)
            });

        }else{
            let userPosts = await app.getUsersPosts(userData.id)
            let letterObject = app.createUserLetter(userData,userPosts);
            Object.assign(result,letterObject);
        }
    }
    return result
   // return Promise.resolve(result)
}
/**
 * Create a user letter object by appending user's post to user's data
 * @param {<Object>} userData an object of user's data
 * @param {Array.<Object>} posts an array of a single user's post
 * 
 */

app.createUserLetter = (user,posts)=>{
    //first we concatenate user address
    let userData = user;
    let tmpPosts = posts;
    let tmpAdr = userData.address;
    userData.address = `${tmpAdr.street},${tmpAdr.suite}. ${tmpAdr.zipcode} ${tmpAdr.city}`
    //then we append user's posts to their objects
    tmpPosts.forEach((el)=>{
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

app.getUsersPosts = async (userId,postId) => {
    let url = postId? postsUrl + "/" + postId : postsUrl;
    let searchParams = userId && !postId ?  new URLSearchParams({
        userId: userId
    }) : ''
        let postsResponse = await fetch(url + "?" + searchParams).then(app.handleErrors).catch((err)=>{
          
        })
        if(!postsResponse || !postsResponse.ok){
            //An error occured
            throw new Error()
        }else{
            let userPosts = await postsResponse.json()
            return userPosts
        }    
}

app.handleErrors = (response) =>{
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

module.exports = app
//export default app