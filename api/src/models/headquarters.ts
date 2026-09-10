/**
 * @swagger
 * components:
 *   schemas:
 *     Headquarters:
 *       type: object
 *       required:
 *         - headquartersId
 *         - name
 *         - description
 *         - address
 *         - contactPerson
 *         - email
 *         - phone
 *       properties:
 *         headquartersId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the headquarters
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the headquarters
 *         address:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Main office address of the headquarters
 *         phone:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Contact phone number for the headquarters
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 200
 *           description: Contact email for the headquarters
 *         contactPerson:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Name of the primary contact person
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional details about the headquarters
 */
export interface Headquarters {
    headquartersId: number;
    name: string;
    description: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
}
