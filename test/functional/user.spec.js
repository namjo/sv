'use strict'

const suite = use('Test/Suite')('User')
const { test, trait } = suite
const User = use('App/Models/User')
const cookieparser = require('cookieparser')

// HACK. set user as global variable.
var user

suite.before(async () => {
  user = await User.create({
    username: 'jon',
    email: 'jon@doe.com',
    password: 'secret',
    first: 'Jon',
    last: 'Doe',
    role: 'admin'
  })
})

suite.after(async () => {
  await user.delete()
})

trait('Test/ApiClient')

test('get all users', async ({ client }) => {
  const response = await client.get('/users').end()
  response.assertJSONSubset([{
    username: 'jon',
    email: 'jon@doe.com',
    first: 'Jon',
    last: 'Doe',
    role: 'admin'
  }])
})

test('store user into db', async ({ client }) => {
  const response = await client.post('/users').send({
    username: 'anotherjondoe',
    email: 'anotherjon@doe.com',
    password: 'secret',
    first: 'AnotherJon',
    last: 'Doe',
    role: 'admin'
  }).end()
  response.assertStatus(201)
  // don't allow to store same user twice
  const response2 = await client.post('/users').send({
    username: 'anotherjondoe',
    email: 'anotherjon@doe.com',
    password: 'secret',
    first: 'AnotherJon',
    last: 'Doe',
    role: 'admin'
  }).end()
  await User.query().where('email', 'anotherjon@doe.com').delete()
  response2.assertStatus(500)
})

test('get specific user', async ({ client }) => {
  // login
  const login = await client.post('/login').send({
    email: 'jon@doe.com',
    password: 'secret'
  }).end()
  const cookie = cookieparser.parse(login._cookieString)

  console.log(user.id);
  // Must request with cookies to skip auth middleware
  const response = await client.get('/users/' + user.id)
    .cookie( 'adonis-session', cookie['adonis-session'] )
    .cookie( 'adonis-session-values', cookie['adonis-session-values'] )
    // .cookie( 'XSRF-TOKEN', cookie['XSRF-TOKEN'] )
    .end()
  response.assertStatus(200)
  response.assertJSONSubset([{
    username: 'jon',
    email: 'jon@doe.com',
    first: 'Jon',
    last: 'Doe',
    role: 'admin'
  }])

})
