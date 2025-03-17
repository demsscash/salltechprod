'use server'

import { supabase } from '@/lib/supabase';
import { ContactInfo, ContactFormData } from '@/types';
import { revalidatePath } from 'next/cache';

export async function updateContactInfo(updates: Partial<ContactInfo>): Promise<{ success: boolean, data?: ContactInfo, error?: string }> {
    try {
        // Récupérer l'ID de l'entrée de contact existante
        const { data: existingData } = await supabase
            .from('contact_info')
            .select('id')
            .single();

        if (!existingData) {
            // Si aucune entrée n'existe, créer une nouvelle
            const { data, error } = await supabase
                .from('contact_info')
                .insert([updates])
                .select();

            if (error) {
                return { success: false, error: error.message };
            }

            revalidatePath('/');
            return { success: true, data: data[0] };
        }

        // Sinon, mettre à jour l'entrée existante
        const { data, error } = await supabase
            .from('contact_info')
            .update(updates)
            .eq('id', existingData.id)
            .select();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Exception lors de la mise à jour des infos de contact:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function submitContactForm(formData: ContactFormData): Promise<{ success: boolean, error?: string }> {
    try {
        const { error } = await supabase
            .from('contact_messages')
            .insert([formData]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Exception lors de l\'envoi du formulaire de contact:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}
