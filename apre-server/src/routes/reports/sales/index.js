/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});

// Start of sales by product report additions

/**
 * @description
 *
 * GET /product
 *
 * Fetches a list of distinct sales by product.
 *
 * Example:
 * fetch('/product')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/product', (req, res, next) => {
  try {
    mongo (async db => {
      const product = await db.collection('sales').distinct('product');
      res.send(product);
    }, next);
  } catch (err) {
    console.error('Error getting product: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /product/:product
 *
 * Fetches sales data for each product.
 *
 * Example:
 * fetch('/product/Smart Door Lock')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/product/:product', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByProduct = await db.collection('sales').aggregate([
        { $match: { product: req.params.product } },
        {
          $group: {
            _id: '$product',
            totalSales: { $sum: '$amount'},
          }
        },
        {
          $project: {
            _id: 0,
            product: '$_id',
            totalSales: 1
          }
        }
      ]).toArray();
      res.send(salesReportByProduct);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for product: ', err);
    next(err);
  }
});

module.exports = router;