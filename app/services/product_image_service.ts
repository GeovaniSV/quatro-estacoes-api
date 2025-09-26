import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'
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
 * https://res.cloudinary.com/<seu_cloud_name>/image/upload/products/<nome_do_produto>/<public_id_da_foto>
 */

export class ProductImageService {
  async uploadProductImage(file: MultipartFile, productId: number, productName: string) {
    let productNameReplaced = productName
      .replace(/\s+/g, '_')
      .replace(/n°\s*(\d+)/gi, 'n_$1')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    console.log(productNameReplaced)
    const result = await cloudinary.uploader.upload(file.tmpPath!, {
      folder: `products/${productNameReplaced}`,
      public_id: `product_${productId}_${Date.now()}`,
      resource_type: 'image',
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    })

    return result.public_id
  }

  async uploadMultipleImages(files: MultipartFile[], productId: number, productName: string) {
    let productNameReplaced = productName
      .replace(/\s+/g, '_')
      .replace(/n°\s*(\d+)/gi, 'n_$1')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    console.log(productNameReplaced)
    const publicIds: string[] = []
    console.log('Cheguei nas multiplas imagens')
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await cloudinary.uploader.upload(file.tmpPath!, {
        folder: `products/${productNameReplaced}`,
        public_id: `produto_${productId}_img_${i + 1}_${Date.now()}`,
        resource_type: 'image',
      })
      console.log(`Publiquei a ${i + 1}°`)
      publicIds.push(result.public_id)
    }
    console.log('publiquei todas elas')

    return publicIds
  }

  async deleteImage(imageId: number) {
    const image = await ProductImage.findBy('id', imageId)
    if (!image) throw new HTTPNotFoundException('Product image not found')

    await cloudinary.uploader.destroy(image.cloudinaryPublicId)
    await image.delete()
    return { message: 'Deleted' }
  }
}
