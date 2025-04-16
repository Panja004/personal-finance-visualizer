import dbConnect from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';

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

    const { id } = req.query;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid transaction ID'
        });
    }

    try {
        switch (req.method) {
            case 'PUT':
                if (!req.body) {
                    return res.status(400).json({
                        success: false,
                        error: 'Bad Request',
                        message: 'Request body is required'
                    });
                }
                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    id,
                    req.body,
                    { new: true, runValidators: true }
                );
                if (!updatedTransaction) {
                    return res.status(404).json({
                        success: false,
                        error: 'Not Found',
                        message: 'Transaction not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: updatedTransaction
                });

            case 'DELETE':
                const deletedTransaction = await Transaction.findByIdAndDelete(id);
                if (!deletedTransaction) {
                    return res.status(404).json({
                        success: false,
                        error: 'Not Found',
                        message: 'Transaction not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Transaction deleted successfully'
                });

            case 'GET':
                const transaction = await Transaction.findById(id);
                if (!transaction) {
                    return res.status(404).json({
                        success: false,
                        error: 'Not Found',
                        message: 'Transaction not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: transaction
                });

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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