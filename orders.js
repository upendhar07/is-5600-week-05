const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product',
    required: true
  }],
  status: {
    type: String,
    enum: ['CREATED', 'PENDING', 'COMPLETED'],
    default: 'CREATED',
    required: true
  }
})

/**
 * List orders
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options
  const productQuery = productId ? { products: productId } : {}
  const statusQuery = status ? { status: status } : {}
  const query = { ...productQuery, ...statusQuery }
  const orders = await Order.find(query).skip(offset).limit(limit).populate('products')
  return orders
}

/**
 * Create an order
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}

/**
 * Edit an order
 * @param {String} id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit(id, change) {
  const order = await Order.findById(id)
  Object.keys(change).forEach(key => {
    order[key] = change[key]
  })
  await order.save()
  return order
}

/**
 * Delete an order
 * @param {String} id
 * @returns {Promise<Object>}
 */
async function destroy(id) {
  return await Order.deleteOne({ _id: id })
}

module.exports = {
  create,
  list,
  edit,
  destroy
}
