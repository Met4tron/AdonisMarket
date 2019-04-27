'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
const Category = use('App/Models/Category')
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {object} ctx.pagination
   */
  async index({ request, response, pagination }) {
    const title = request.input('title')
    const query = Category.query()

    if (title) {
      query.where('title', 'ILIKE', `%${title}%`)
    }

    const categories = await query.paginate(pagination.page, pagination.limit)
    return response.send(categories)
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { title, description, image_id } = request.only([
        'title',
        'description',
        'image_id'
      ])

      const category = await Category.create({ title, description, image_id })

      return response.status(201).send({ data: category })
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Error to create a new category' })
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params: { id }, request, response }) {
    try {
      const category = await Category.findOrFail(id)
      return response.status(200).send({ data: category })
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Error to show a selected category' })
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    try {
      const category = await Category.findOrFail(id)
      const { title, description, image_id } = request.only([
        'title',
        'description',
        'image_id'
      ])

      category.merge({ title, description, image_id })
      await category.save()
      return response.send(category)
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Error to update a selected category' })
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    try {
      const category = await Category.findOrFail(id)
      await category.delete()

      return response.status(204).send({})
    } catch (error) {
      return response
        .status(400)
        .send({ message: 'Error to delete a selected category' })
    }
  }
}

module.exports = CategoryController
