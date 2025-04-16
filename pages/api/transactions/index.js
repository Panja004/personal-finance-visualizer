import dbConnect from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';

export default async function handler(req, res) {
    // Set response headers
    res.setHeader('Content-Type', 'application/json');

    console.log('Transactions API called:', req.method);

    try {
        await dbConnect();
        console.log('Database connected successfully');
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
                console.log('Fetching transactions...');
                const transactions = await Transaction.find({})
                    .sort({ date: -1 })
                    .limit(50);
                console.log('Found transactions:', transactions.length);
                
                const response = {
                    success: true,
                    data: transactions
                };
                console.log('Sending response:', JSON.stringify(response));
                return res.status(200).json(response);

            case 'POST':
                console.log('Creating transaction with data:', req.body);
                if (!req.body) {
                    console.log('No request body provided');
                    return res.status(400).json({
                        success: false,
                        error: 'Bad Request',
                        message: 'Request body is required'
                    });
                }
                const transaction = await Transaction.create(req.body);
                console.log('Created transaction:', transaction);
                return res.status(201).json({
                    success: true,
                    data: transaction
                });

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
        // Ensure we always return JSON, even for errors
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
}