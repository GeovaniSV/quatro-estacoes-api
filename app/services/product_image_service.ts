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
    const result = await cloudinary.uploader.upload(file.tmpPath!, {
      folder: `products/${productName}`,
      public_id: `product_${productId}_${Date.now()}`,
      resource_type: 'image',
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    })

    return result.public_id
  }

  async uploadMultipleImages(files: MultipartFile[], productId: number, productName: string) {
    const publicIds: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await cloudinary.uploader.upload(file.tmpPath!, {
        folder: `products/${productName}`,
        public_id: `produto_${productId}_img_${i + 1}_${Date.now()}`,
        resource_type: 'image',
      })
      publicIds.push(result.public_id)
    }

    return publicIds
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
    return { message: 'Deleted' }
  }
}
