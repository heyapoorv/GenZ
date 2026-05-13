const Product = require('../models/Product');

// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const pageSize = Math.min(Number(req.query.limit) || 12, 50);
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    let query = {};

    if (req.query.keyword) {
      query.$text = { $search: req.query.keyword };
    }

    if (req.query.category) {
      const categories = req.query.category.split(',').filter(c => c.trim() !== '');
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.sizes) {
      const sizes = req.query.sizes.split(',').filter(s => s.trim() !== '');
      if (sizes.length > 0) {
        query['sizeStock.size'] = { $in: sizes };
        query['sizeStock.stock'] = { $gt: 0 };
      }
    }

    let sortObj = {};
    if (req.query.sort === 'price_asc') {
      sortObj = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortObj = { price: -1 };
    } else {
      sortObj = req.query.keyword ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    }

    const projection = req.query.keyword && !req.query.sort ? { score: { $meta: 'textScore' } } : {};
    
    const [count, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query, projection)
        .sort(sortObj)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean()
    ]);

    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize), 
      total: count 
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/products (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description, images, category, sizes, stock, sizeStock } = req.body;
    
    let finalSizeStock = sizeStock;
    if (!finalSizeStock && sizes) {
      finalSizeStock = sizes.map(s => ({
        size: s,
        stock: Math.floor((stock || 0) / sizes.length)
      }));
    }

    const product = new Product({
      name: name || 'Sample name',
      price: price || 0,
      category: category || 'Sample category',
      sizeStock: finalSizeStock || [{ size: 'M', stock: 0 }],
      images: images || ['/images/sample.jpg'],
      description: description || 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, images, category, sizes, stock, sizeStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      
      if (sizeStock) {
        product.sizeStock = sizeStock;
      } else if (sizes) {
        product.sizeStock = sizes.map(s => {
          const existing = product.sizeStock.find(es => es.size === s);
          return {
            size: s,
            stock: existing ? existing.stock : Math.floor((stock || 0) / sizes.length)
          };
        });
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};
