'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async register({ request, response }) {
    const trx = await Database.beginTransaction()

    try {
      const { name, surname, email, password } = request.all()
      const user = await User.create({ name, surname, email, password }, trx)
      const userRole = await Role.findBy('slug', 'client')
      await user.roles().attach([userRole.id], null, trx)
      await trx.commit()
      return response.status(201).send({ data: user })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({ message: 'Error on create user' })
    }
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async login({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])

    try {
      let data = await auth.withRefreshToken().attempt(email, password)
      return response.status(200).send({ data })
    } catch (error) {
      return response.status(400).send({ message: 'Error on login ' })
    }
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async logout({ request, response, auth }) {
    let refreshToken = this.getRefreshToken(request)

    let loggedOut = await auth
      .authenticator('jwt')
      .revokeTokens([refreshToken], true)

    return response.status(204).send({})
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async refresh({ request, response, auth }) {
    try {
      let refreshToken = this.getRefreshToken(request)

      const user = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken)

      return response.status(200).send({ data: user })
    } catch (error) {
      return response.status(500).send({ message: 'Error on Refresh Token' })
    }
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async forgot({ request, response }) {}

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async remeber({ request, response }) {}

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async reset({ request, response }) {}

  getRefreshToken(request) {
    let refreshToken = request.input('refresh_token')

    if (!refreshToken) {
      refreshToken = request.header('refresh_token')
    }

    return refreshToken
  }
}

module.exports = AuthController
