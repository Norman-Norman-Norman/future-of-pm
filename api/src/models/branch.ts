/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       required:
 *         - branchId
 *         - headquartersId
 *         - name
 *         - description
 *         - address
 *         - contactPerson
 *         - email
 *         - phone
 *       properties:
 *         branchId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the branch
 *         headquartersId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the headquarters this branch belongs to
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the branch
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional details about the branch
 *         address:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Physical address of the branch
 *         contactPerson:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Name of the primary contact person
 *         phone:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Contact phone number for the branch
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 200
 *           description: Contact email for the branch
 */
export interface Branch {
    branchId: number;
    headquartersId: number;
    name: string;
    description: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
}
