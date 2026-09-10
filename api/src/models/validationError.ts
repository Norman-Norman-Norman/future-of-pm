/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       required:
 *         - error
 *         - details
 *       properties:
 *         error:
 *           type: string
 *           example: Validation failed
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - path
 *               - message
 *             properties:
 *               path:
 *                 type: string
 *                 description: Dot-separated request body path for the invalid field
 *               message:
 *                 type: string
 *                 description: Validation failure message
 */
export interface ValidationErrorDetail {
    path: string;
    message: string;
}

export interface ValidationError {
    error: 'Validation failed';
    details: ValidationErrorDetail[];
}
