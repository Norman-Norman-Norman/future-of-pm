/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - supplierId
 *         - name
 *         - description
 *         - contactPerson
 *         - email
 *         - phone
 *       properties:
 *         supplierId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the supplier
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the supplier
 *         contactPerson:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Name of the primary contact person
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 200
 *           description: Contact email for the supplier
 *         phone:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Contact phone number for the supplier
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional details about the supplier
 */
export interface Supplier {
    supplierId: number;
    name: string;
    description: string;
    contactPerson: string;
    email: string;
    phone: string;
}