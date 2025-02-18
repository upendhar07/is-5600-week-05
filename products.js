const cuid = require('cuid')
const db = require('./db')

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }]
})

/**
 * Create a new product
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const product = await new Product(fields).save()
  return product
}

/**
 * List products
 * @param {Object} options
 * @returns {Promise<Object[]>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const query = tag ? { tags: { $elemMatch: { title: tag } } } : {}
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
  return products
}

/**
 * Get a single product
 * @param {String} id
 * @returns {Promise<Object>}
 */
async function get(id) {
  const product = await Product.findById(id)
  return product
}

/**
 * Edit a product
 * @param {String} id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit(id, change) {
  const product = await get(id)
  Object.keys(change).forEach(key => {
    product[key] = change[key]
  })
  await product.save()
  return product
}

/**
 * Delete a product
 * @param {String} id
 * @returns {Promise<Object>}
 */
async function destroy(id) {
  return await Product.deleteOne({ _id: id })
}

module.exports = {
  create,
  list,
  get,
  edit,
  destroy
}
