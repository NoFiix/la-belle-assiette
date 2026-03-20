import { v2 as cloudinary } from 'cloudinary'

let configured = false

function ensureConfig() {
  if (configured) return

  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET

  console.log('Cloudinary config:', {
    cloud_name: !!cloud_name,
    api_key: !!api_key,
    api_secret: !!api_secret,
  })

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Variables Cloudinary manquantes: ' +
      [
        !cloud_name && 'CLOUDINARY_CLOUD_NAME',
        !api_key && 'CLOUDINARY_API_KEY',
        !api_secret && 'CLOUDINARY_API_SECRET',
      ].filter(Boolean).join(', ')
    )
  }

  cloudinary.config({ cloud_name, api_key, api_secret })
  configured = true
}

export async function uploadImage(
  buffer: Buffer,
  folder: string = 'la-belle-assiette/galerie'
): Promise<{ url: string; publicId: string }> {
  ensureConfig()

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          reject(new Error('Cloudinary: résultat vide'))
          return
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      }
    )

    stream.on('error', (err) => reject(err))
    stream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureConfig()
  await cloudinary.uploader.destroy(publicId)
}
