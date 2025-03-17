'use server'

import { supabase } from '@/lib/supabase';
import { ServiceProps } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createService(service: Omit<ServiceProps, 'id'>): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('services')
            .insert([service])
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        // Revalidate the services page to update the cache
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Exception lors de la création du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function updateService(id: number, updates: Partial<ServiceProps>): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        if (data.length === 0) {
            return { success: false, error: 'Service non trouvé' };
        }

        // Revalidate the services page to update the cache
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Exception lors de la mise à jour du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function deleteService(id: number): Promise<{ success: boolean, error?: string }> {
    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Revalidate the services page to update the cache
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Exception lors de la suppression du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function getServiceById(id: number): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception lors de la récupération du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}
