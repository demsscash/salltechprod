import { supabase } from '@/lib/supabase';
import { PortfolioItemProps } from '@/types';

export async function getPortfolioItems(): Promise<PortfolioItemProps[]> {
    const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('id');

    if (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return [];
    }

    return data || [];
}