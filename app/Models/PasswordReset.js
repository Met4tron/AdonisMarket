'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PasswordReset extends Model {
  static boot() {
    super.boot()

    this.addHook('beforeCreate', async passwordResetInstance => {
      passwordResetInstance.token = await str_random(25)
    })
  }
}

module.exports = PasswordReset
