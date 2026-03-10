/**
 * @swagger
 * components:
 *   schemas:
 *     BundleProduct:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The ID of the product included in this bundle
 *         quantity:
 *           type: integer
 *           description: The quantity of this product included in the bundle
 *     ProductBundle:
 *       type: object
 *       required:
 *         - bundleId
 *         - name
 *         - description
 *         - products
 *         - discountPercentage
 *       properties:
 *         bundleId:
 *           type: integer
 *           description: The unique identifier for the bundle
 *         name:
 *           type: string
 *           description: The name of the bundle
 *         description:
 *           type: string
 *           description: Detailed description of the bundle
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BundleProduct'
 *           description: The products included in this bundle with their quantities
 *         discountPercentage:
 *           type: number
 *           format: float
 *           description: Discount percentage off the total product prices (e.g., 15 = 15% off)
 *         imageUrl:
 *           type: string
 *           description: Optional URL for the bundle image
 */
export interface BundleProduct {
    productId: number;
    quantity: number;
}

export interface ProductBundle {
    bundleId: number;
    name: string;
    description: string;
    products: BundleProduct[];
    discountPercentage: number;
    imageUrl?: string;
}
