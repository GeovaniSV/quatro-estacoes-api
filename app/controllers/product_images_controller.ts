import { inject } from '@adonisjs/core'
import { ProductImageService } from '#services/product_image_service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import Product from '#models/product'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import ProductImage from '#models/product_image'
import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'

@inject()
export default class ProductImagesController {
  constructor(protected productImageService: ProductImageService) {}

  async uploadImage(
    productId: number,
    mainImage: MultipartFile,
    additionalImages: MultipartFile[]
  ) {
    console.log('Cheguei na controller image')
    const product = await Product.findBy('id', productId)

    if (!product) throw new ProductNotFoundException()

    if (mainImage && mainImage.isValid) {
      console.log('fui pra uma imagem')
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
        console.log('fui pra multiplas imagens')
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

  async deleteProductImage(productId: number, imageId: number) {
    const product = await Product.findBy('id', productId)
    if (!product) throw new ProductNotFoundException()

    const image = await ProductImage.findBy('id', imageId)
    if (!image) throw new HTTPNotFoundException('Image not found')

    let result

    await product.load('images')
    if (product.imagePublicId == image.cloudinaryPublicId) {
      result = await this.productImageService.deleteImage(image.id)
      product.imagePublicId = ''
      await product.save()
    } else if (product.images) {
      product.images.map((image) => {
        if (image.cloudinaryPublicId == image.cloudinaryPublicId) {
          result = this.productImageService.deleteImage(image.id)
        }
      })
    } else {
      throw new HTTPNotFoundException('Product image not found')
    }
    return { message: result }
  }
}
