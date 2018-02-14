'use strict'

const suite = use('Test/Suite')('Login')
const { test, trait } = suite
const User = use('App/Models/User')

// HACK. set user as global variable.
var user

suite.before(async () => {
  user = await User.create({
    username: 'jon',
    email: 'jon@doe.com',
    password: 'secret'
  })
})

suite.after(async () => {
  await user.delete()
  // await User.query().where('email', 'jon@doe.com').delete()
})

trait('Test/ApiClient')

test('test login', async ({ client }) => {
  const response = await client.post('/login').send({
    email: 'jon@doe.com',
    password: 'secret'
  }).end()
  response.assertStatus(200)
  response.assertText('Logged in successfully')
})
