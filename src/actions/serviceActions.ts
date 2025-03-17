'use server'

import { supabase } from '@/lib/supabase';
import { ServiceProps } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createService(service: Omit<ServiceProps, 'id'>): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        console.log('Création service - Données envoyées:', service);

        const { data, error } = await supabase
            .from('services')
            .insert([service])
            .select();

        if (error) {
            console.error('Erreur Supabase lors de la création:', error);
            return { success: false, error: error.message };
        }

        console.log('Création service - Succès avec données:', data);
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error: any) {
        console.error('Exception lors de la création du service:', error);
        return { success: false, error: error.message || 'Une erreur inattendue est survenue' };
    }
}

export async function updateService(id: number, updates: Partial<ServiceProps>): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        // S'assurer que l'ID n'est pas inclus dans les mises à jour
        const { id: _id, ...updatesWithoutId } = updates as any;

        console.log(`Mise à jour du service ${id} avec:`, updatesWithoutId);

        // Utiliser directement l'API Supabase pour mettre à jour
        const { data, error } = await supabase
            .from('services')
            .update(updatesWithoutId)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return { success: false, error: error.message };
        }

        if (!data || data.length === 0) {
            console.error('Aucune donnée retournée après mise à jour');
            return { success: false, error: 'Service non trouvé' };
        }

        console.log('Service mis à jour avec succès:', data[0]);
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error: any) {
        console.error('Exception lors de la mise à jour du service:', error);
        return { success: false, error: error.message || 'Une erreur inattendue est survenue' };
    }
}

export async function deleteService(id: number): Promise<{ success: boolean, error?: string }> {
    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erreur Supabase lors de la suppression:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Exception lors de la suppression du service:', error);
        return { success: false, error: error.message || 'Une erreur inattendue est survenue' };
    }
}

export async function getServiceById(id: number): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        console.log('Récupération du service avec ID:', id);

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erreur Supabase lors de la récupération:', error);
            return { success: false, error: error.message };
        }

        console.log('Service récupéré:', data);
        return { success: true, data };
    } catch (error: any) {
        console.error('Exception lors de la récupération du service:', error);
        return { success: false, error: error.message || 'Une erreur inattendue est survenue' };
    }
}