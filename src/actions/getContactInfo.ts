import { supabase } from '@/lib/supabase';
import { ContactInfo } from '@/types';

export async function getContactInfo(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

    if (error) {
        console.error('Erreur lors de la récupération des infos de contact:', error);
        return null;
    }

    return data;
}