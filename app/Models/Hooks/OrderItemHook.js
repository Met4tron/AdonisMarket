'use strict'
const Product = use('App/Models/Product')
const OrderItemHook = (exports = module.exports = {})

OrderItemHook.updateSubtotal = async model => {
  let productToUpdate = await Product.find(model.product_id)
  model.subtotal = model.quantity * productToUpdate.price
}
