import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'
import { ProductNotFoundException } from '#exceptions/products_exceptions/product_not_found_exception'
import Product from '#models/product'
import ProductImage from '#models/product_image'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
/**
 * Para recuperar essas fotos no front-end utilize a URL abaixo:
 * https://res.cloudinary.com/dv2z56dp9/image/upload/products/<nome_do_produto>/<public_id_da_foto>
 */

export class ProductImageService {
  async uploadProductImage(mainImage: MultipartFile, product: Partial<Product>) {
    if (!product) throw new ProductNotFoundException()
    let productNameReplaced = product
      .productName!.replace(/\s+/g, '_')
      .replace(/n°\s*(\d+)/gi, 'n_$1')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    console.log('Cheguei na controller image')
    if (mainImage && mainImage.isValid) {
      console.log('fui pra uma imagem')

      const image = await cloudinary.uploader.upload(mainImage.tmpPath!, {
        folder: `products/${productNameReplaced}`,
        public_id: `product_${product.id}_${Date.now()}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
      })
      product.imagePublicId = image.public_id
      await ProductImage.create({
        productId: product.id,
        cloudinaryPublicId: image.public_id,
        altText: mainImage.clientName,
      })
    }

    console.log(productNameReplaced)

    await product.save!()
    return product
  }

  async uploadMultipleImages(additionalImages: MultipartFile[], product: Partial<Product>) {
    let productNameReplaced = product
      .productName!.replace(/\s+/g, '_')
      .replace(/n°\s*(\d+)/gi, 'n_$1')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    console.log('Cheguei nas multiplas imagens')
    if (additionalImages && additionalImages.length > 0) {
      const validImages = additionalImages.filter((img) => img.isValid)

      const publicIds: string[] = []
      if (validImages.length > 0) {
        for (let i = 0; i < additionalImages.length; i++) {
          const file = additionalImages[i]

          const result = await cloudinary.uploader.upload(file.tmpPath!, {
            folder: `products/${productNameReplaced}`,
            public_id: `produto_${product.id}_img_${i + 1}_${Date.now()}`,
            resource_type: 'image',
          })

          console.log(`Publiquei a ${i + 1}°`)

          publicIds.push(result.public_id)
        }

        console.log('publiquei todas elas')

        const names = validImages.map((images) => {
          return images.clientName
        })

        const imageRecords = publicIds.map((publicId, index) => ({
          productId: product.id,
          cloudinaryPublicId: publicId,
          altText: names[index],
          sortOrder: index,
        }))

        await ProductImage.createMany(imageRecords)
      }
    }
    console.log(productNameReplaced)

    await product.save!()
    return product
  }

  async deleteImage(productId: number, imageId: number) {
    const product = await Product.findBy('id', productId)
    if (!product) throw new ProductNotFoundException()

    const image = await ProductImage.findBy('id', imageId)
    if (!image) throw new HTTPNotFoundException('Product image not found')

    if (image.cloudinaryPublicId === product.imagePublicId) {
      product.imagePublicId = ''
    }

    await cloudinary.uploader.destroy(image.cloudinaryPublicId)
    await image.delete()
    await product.save()
    await product.load('images')
    return { message: product }
  }
}
