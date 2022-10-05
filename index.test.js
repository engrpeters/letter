import 'whatwg-fetch'
import {describe, expect, jest, test} from '@jest/globals'
import app from './index.js'
import * as mockData from './__mocks__/data.js'


//jest.mock('./__mocks__/data.js')
//const app = require('./index.js')

describe("api unit tests",()=>{
   test("get a single user data",async () =>{
        let data = await app.getUsersData(1)
        expect(data).toHaveProperty('id',1)
    })
    
    test("get all users data",async () =>{
        let data = app.getUsersData()
       // done()
      expect(data).resolves.toEqual(expect.arrayContaining([expect.objectContaining({id:1})]))
      expect(data).resolves.toEqual(expect.arrayContaining([expect.objectContaining({id:5})]))
       
    })
    test("get a single posts", async() =>{
        let data =  app.getUsersPosts(3);
        expect(data).resolves.toEqual(expect.arrayContaining([expect.objectContaining({userId:3})]))
    })

    test("get a post by it's id", async() =>{
        let data =  app.getUsersPosts(null,3);
        expect(data).resolves.toEqual(expect.objectContaining({id:3}))
    })

    test("merge a user object and it's posts",()=>{
        let data = app.createUserLetter(mockData.userData(),mockData.userPosts())
    //    expect(data).toHaveProperty('address',expect.any(String))
        expect(data).not.toHaveProperty('address.zipcode')
        expect(data).toHaveProperty('posts',expect.arrayContaining([expect.not.objectContaining({userId:expect.any(Number)})]))
    })
    
})