import { supabase } from '@/lib/supabase';
import { SocialLink } from '@/types';

export async function getSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('id');

    if (error) {
        console.error('Erreur lors de la récupération des liens sociaux:', error);
        return [];
    }

    return data || [];
}