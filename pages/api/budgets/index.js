import dbConnect from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

export default async function handler(req, res) {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error.message
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        const { month, year } = req.query;
        if (!month || !year) {
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Month and year are required'
          });
        }
        const budgets = await Budget.find({ month, year });
        return res.status(200).json({
          success: true,
          data: budgets
        });

      case 'POST':
        if (!req.body) {
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Request body is required'
          });
        }
        const budget = await Budget.create(req.body);
        return res.status(201).json({
          success: true,
          data: budget
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: 'Method Not Allowed',
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
}