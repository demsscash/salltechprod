'use server'

import { supabase } from '@/lib/supabase';
import { ServiceProps } from '@/types';
import { revalidatePath } from 'next/cache';

export async function directUpdateService(id: number, updates: Partial<ServiceProps>) {
    console.log('Action directe - Mise à jour du service:', id, updates);

    try {
        // Supprimer l'ID des mises à jour si présent
        const { id: _id, ...updatesWithoutId } = updates as any;

        // Mettre à jour le service directement sans vérification préalable
        const { data, error: updateError } = await supabase
            .from('services')
            .update(updatesWithoutId)
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

        // Revalidate paths to update UI
        revalidatePath('/');
        revalidatePath('/admin');

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