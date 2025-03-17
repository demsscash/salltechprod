'use server'

import { supabase } from '@/lib/supabase';
import { ServiceProps } from '@/types';
import { revalidatePath } from 'next/cache';

export async function directUpdateService(id: number, updates: Partial<ServiceProps>) {
    console.log('Action directe - Mise à jour du service:', id, updates);

    try {
        // Supprimer l'ID des mises à jour si présent
        const { id: _id, ...updatesWithoutId } = updates as any;

        // Sanitiser les données avant l'envoi pour s'assurer qu'elles sont au bon format
        const sanitizedUpdates = {
            icon: updatesWithoutId.icon || null,
            title: updatesWithoutId.title || null,
            description: updatesWithoutId.description || null,
            link: updatesWithoutId.link || null
        };

        console.log('Action directe - Données sanitisées:', sanitizedUpdates);

        // Mettre à jour le service directement
        const { data, error: updateError } = await supabase
            .from('services')
            .update(sanitizedUpdates)
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('Action directe - Erreur lors de la mise à jour:', updateError);
            return {
                success: false,
                error: updateError.message
            };
        }

        console.log('Action directe - Résultat de la mise à jour:', data);

        // Forcer une revalidation plus aggressive
        revalidatePath('/', 'layout');
        revalidatePath('/admin', 'layout');
        revalidatePath('/admin/services', 'layout');

        return {
            success: true,
            data: data && data.length > 0 ? data[0] : null
        };
    } catch (error: any) {
        console.error('Action directe - Exception lors de la mise à jour:', error);
        return {
            success: false,
            error: error?.message || 'Erreur inconnue'
        };
    }
}