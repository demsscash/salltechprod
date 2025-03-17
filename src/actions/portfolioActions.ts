'use server'

import { supabase } from '@/lib/supabase';
import { PortfolioItemProps } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createPortfolioItem(item: Omit<PortfolioItemProps, 'id'>): Promise<{ success: boolean, data?: PortfolioItemProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .insert([item])
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        // Revalidate the portfolio page to update the cache
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Exception lors de la création du projet:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function updatePortfolioItem(id: number, updates: Partial<PortfolioItemProps>): Promise<{ success: boolean, data?: PortfolioItemProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        if (data.length === 0) {
            return { success: false, error: 'Projet non trouvé' };
        }

        // Revalidate the portfolio page to update the cache
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Exception lors de la mise à jour du projet:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function deletePortfolioItem(id: number): Promise<{ success: boolean, error?: string }> {
    try {
        const { error } = await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Revalidate the portfolio page to update the cache
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Exception lors de la suppression du projet:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function getPortfolioItemById(id: number): Promise<{ success: boolean, data?: PortfolioItemProps, error?: string }> {
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception lors de la récupération du projet:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}
