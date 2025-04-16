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

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Budget ID is required'
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
                const updatedBudget = await Budget.findByIdAndUpdate(
                    id,
                    req.body,
                    { new: true }
                );
                if (!updatedBudget) {
                    return res.status(404).json({
                        success: false,
                        error: 'Not Found',
                        message: 'Budget not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: updatedBudget
                });

            case 'DELETE':
                const deletedBudget = await Budget.findByIdAndDelete(id);
                if (!deletedBudget) {
                    return res.status(404).json({
                        success: false,
                        error: 'Not Found',
                        message: 'Budget not found'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Budget deleted successfully'
                });

            default:
                res.setHeader('Allow', ['PUT', 'DELETE']);
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