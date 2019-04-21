'use strict'

/*
|--------------------------------------------------------------------------
| CategoryAndProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Category = Factory.model('App/Models/Category')
const Product = Factory.model('App/Models/Product')

class CategoryAndProductSeeder {
  async run() {
    const categories = await Category.createMany(10)

    for (let cat of categories) {
      const products = await Product.createMany(5)
      for (let prod of products) {
        await prod.categories().attach([cat.id])
      }
    }
  }
}

module.exports = CategoryAndProductSeeder
