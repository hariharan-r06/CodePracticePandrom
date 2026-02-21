import { v4 as uuidv4 } from 'uuid'
import { supabaseAdmin } from '../config/supabase'
import { env } from '../config/env'

export const storageService = {
    async uploadScreenshot(file: Express.Multer.File, userId: string): Promise<string> {
        const ext = file.originalname.split('.').pop()
        const fileName = `${userId}/${Date.now()}-${uuidv4()}.${ext}`

        const { data, error } = await supabaseAdmin.storage
            .from(env.SUPABASE_STORAGE_BUCKET)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            })

        if (error) throw new Error(`Upload failed: ${error.message}`)

        // Try public URL first, fall back to signed URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(env.SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(data.path)

        return publicUrl
    },

    async deleteScreenshot(url: string): Promise<void> {
        try {
            const path = url.split(`${env.SUPABASE_STORAGE_BUCKET}/`).pop()
            if (!path) return

            const { error } = await supabaseAdmin.storage
                .from(env.SUPABASE_STORAGE_BUCKET)
                .remove([path])

            if (error) throw error
        } catch (err: any) {
            console.error(`Delete failed: ${err.message}`)
        }
    }
}
