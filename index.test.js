import 'whatwg-fetch'
import { describe, expect, test } from '@jest/globals'
import app from './index.js'
import * as mockData from './__mocks__/data.js'

//  jest.mock('./__mocks__/data.js')
//  const app = require('./index.js')

describe('api unit tests', () => {
  test('get a single user data', async () => {
    const data = await app.getUsersData(1)
    expect(data).toHaveProperty('id', 1)
  })
  test('get all users data', async () => {
    const data = app.getUsersData()
    expect(data).resolves.toEqual(expect.arrayContaining([{ id: 1 }]))
    expect(data).resolves.toEqual(expect.arrayContaining([{ id: 5 }]))
  })
  test('should throw an error if invalid userId', async () => {
    await expect(app.getUsersData('s')).rejects.toThrow()
  })
  test('get a single posts', async () => {
    const data = app.getUsersPosts(3)
    expect(data).resolves.toEqual(expect.arrayContaining([{ userId: 3 }]))
  })

  test('should throw an error if both post id and user id are invalid', async () => {
    await expect(app.getUsersPosts('s', 'tr')).rejects.toThrow()
  })
  test('get a post by it"s id', async () => {
    const data = app.getUsersPosts(null, 3)
    expect(data).resolves.toEqual(expect.objectContaining({ id: 3 }))
  })

  test('merge a user object and it"s posts', () => {
    const data = app.createUserLetter(mockData.userData(), mockData.userPosts())
    expect(data).not.toHaveProperty('address.zipcode')
    expect(data).toHaveProperty('posts', expect.arrayContaining([expect.not.objectContaining({ userId: expect.any(Number) })]))
  })
})

describe('these tests should fail', () => {
  test('get user with invalid parameter', async () => {
    await expect(app.getUsersData([])).resolves.toBeTruthy()
  })
  test('would not create user letter', () => {
    expect(() => {
      app.createUserLetter(1, [{ id: 1 }])
    }).not.toThrow()
  })
})
