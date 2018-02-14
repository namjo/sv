'use strict'

const User = use('App/Models/User')

class UserController {

  async login ({ request, auth }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }

  async store ({ request, response }) {
    const userInfo = request.only(['username', 'email', 'password'])

    const user = new User()
    user.username = userInfo.username
    user.email = userInfo.email
    user.password = userInfo.password

    await user.save()

    return response.status(201).json(user)
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }
}

module.exports = UserController
