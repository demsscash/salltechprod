import { supabase } from '@/lib/supabase';
import { ServiceProps } from '@/types';

export async function getServices(): Promise<ServiceProps[]> {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id');

        if (error) {
            console.error('Erreur lors de la récupération des services:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception lors de la récupération des services:', error);
        return [];
    }
}