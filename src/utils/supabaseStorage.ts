import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File, bucket: string = 'images') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function deleteImage(path: string, bucket: string = 'images') {
    try {
        // Extraire le nom du fichier de l'URL complète
        const fileName = path.split('/').pop();

        if (!fileName) throw new Error('Invalid file path');

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}