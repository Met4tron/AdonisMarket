'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')
const User = use('App/Models/User')

class ClientSeeder {
  async run() {
    const clientRole = await Role.findBy('slug', 'client')
    const adminRole = await Role.findBy('slug', 'admin')
    const clients = await Factory.model('App/Models/User').createMany(30)
    for (let client of clients) {
      await client.roles().attach([clientRole.id])
    }

    const adminUser = await User.create({
      name: 'Yuri',
      surname: 'Gomes',
      email: 'yuri@test.com',
      password: 'secret'
    })

    await adminUser.roles().attach([adminRole.id])
  }
}

module.exports = ClientSeeder
