'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request, response }) {
    let users = await User.all()
    return response.json(users)
  }

  async store ({ request, response }) {
    const userInfo = request.only(['username', 'email', 'password', 'first', 'last', 'role'])
    const user = new User()
    user.username = userInfo.username
    user.email = userInfo.email
    user.password = userInfo.password
    user.first = userInfo.first
    user.last = userInfo.last
    user.role = userInfo.role

    await user.save()
    return response.status(201).json(user)
  }

  show ({ auth, params }) {
    // handler executes after request went through all middleware. If user is not logged in, auth wont be defined!
    console.log(auth.user.id);
    if (typeof auth.user === 'undefined' || auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }
    return auth.user
  }
}

module.exports = UserController
