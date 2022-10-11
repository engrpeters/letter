import 'whatwg-fetch'
import { describe, expect, test, jest } from '@jest/globals'

import app from './index.js'

jest.mock('./index.js', () => jest.requireActual('./__mocks__/index.js'))

describe('api unit tests', () => {
  test('get a single user data', async () => {
    const data = await app.getUsersData(1)
    expect(data).toHaveProperty('id', 1)
  })

  test('get all users data', async () => {
    const data = await app.getUsersData()
    setTimeout(() => {
      expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ id: 1 })]))
      expect(data).toEqual(expect.arrayContaining([{ id: 5 }]))
    }, 1000)
    // expect(data).resolves.toEqual(expect.arrayContaining([{ id: 5 }]))
  })

  test('should throw an error if invalid userId', async () => {
    await expect(app.getUsersData('s')).rejects.toThrow()
  })

  test('should throw an error if both post id and user id are invalid', async () => {
    await expect(app.getUsersPosts('s', 'tr')).rejects.toThrow()
  })
  test('get a single user"s posts', async () => {
    const data = await app.getUsersPosts(1)
    expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ userId: 1 })]))

    expect(data).toEqual(expect.arrayContaining([expect.objectContaining({ title: expect.any(String) })]))
  })
  test('get a post by it"s id', async () => {
    const data = await app.getUsersPosts(null, 2)
    expect(data).toEqual(expect.objectContaining({ id: 2 }))
  })

  test('merge a user object and it"s posts', () => {
    const user = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }
    const posts = [
      {
        userId: 1,
        id: 1,
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
      },
      {
        userId: 1,
        id: 2,
        title: 'qui est esse',
        body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
      }
    ]

    const data = app.createUserLetter(user, posts)
    expect(data).not.toHaveProperty('address.zipcode')
    expect(data).toHaveProperty('posts', expect.arrayContaining([expect.not.objectContaining({ userId: expect.any(Number) })]))
  })
  test('get user with invalid parameter', async () => {
    await expect(app.getUsersData([])).rejects.toThrowError()
  })

  test('should not create user letter with invalid user object', () => {
    expect(() => app.createUserLetter(1, [{ id: 1 }])()).toThrow(TypeError)
  })
})
