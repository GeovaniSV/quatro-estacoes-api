import { inject } from '@adonisjs/core'
import { ProductImageService } from '#services/product_image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import Product from '#models/product'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import ProductImage from '#models/product_image'

@inject()
export default class ProductImagesController {
  constructor(protected productImageService: ProductImageService) {}

  async uploadImage(
    productId: number,
    mainImage: MultipartFile,
    additionalImages: MultipartFile[]
  ) {
    const product = await Product.findBy('id', productId)

    if (!product) throw new ProductNotFoundException()

    if (mainImage && mainImage.isValid) {
      const publicId = await this.productImageService.uploadProductImage(
        mainImage,
        product.id,
        product.product_name
      )
      product.imagePublicId = publicId
      await product.save()
    }

    if (additionalImages && additionalImages.length > 0) {
      const validImages = additionalImages.filter((img) => img.isValid)

      if (validImages.length > 0) {
        const publicIds = await this.productImageService.uploadMultipleImages(
          validImages,
          product.id,
          product.product_name
        )

        const imageRecords = publicIds.map((publicId, index) => ({
          productId: product.id,
          cloudinaryPublicId: publicId,
          sortOrder: index,
        }))

        await ProductImage.createMany(imageRecords)
      }
    }
  }
}
