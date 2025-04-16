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
        console.log('GET budgets request:', { month, year });
        
        if (!month || !year) {
          console.log('Missing month or year in query');
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Month and year are required'
          });
        }

        try {
          const budgets = await Budget.find({ month, year });
          console.log('Found budgets:', budgets.length);
          return res.status(200).json({
            success: true,
            data: budgets
          });
        } catch (dbError) {
          console.error('Database query error:', dbError);
          return res.status(500).json({
            success: false,
            error: 'Database Error',
            message: dbError.message
          });
        }

      case 'POST':
        console.log('POST budget request body:', req.body);
        
        if (!req.body) {
          console.log('Missing request body');
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Request body is required'
          });
        }

        try {
          const budget = await Budget.create(req.body);
          console.log('Created budget:', budget);
          return res.status(201).json({
            success: true,
            data: budget
          });
        } catch (dbError) {
          console.error('Database create error:', dbError);
          return res.status(500).json({
            success: false,
            error: 'Database Error',
            message: dbError.message
          });
        }

      default:
        console.log('Method not allowed:', req.method);
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