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
        // Revalidate the services page to update the cache
        revalidatePath('/');
        return { success: true, data: data[0] };
    } catch (error: any) {
        console.error('Exception lors de la création du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}

export async function updateService(id: number, updates: Partial<ServiceProps>): Promise<{ success: boolean, data?: ServiceProps, error?: string }> {
    try {
        console.log('(1) Mise à jour du service ID:', id, 'avec données:', updates);

        // S'assurer que l'ID n'est pas inclus dans les mises à jour
        const { id: _id, ...updatesWithoutId } = updates as any;
        console.log('(2) Données à mettre à jour (sans ID):', updatesWithoutId);

        // Vérifier d'abord si le service existe
        console.log('(3) Vérification de l\'existence du service');
        const { data: existingService, error: existingError } = await supabase
            .from('services')
            .select('*')  // Sélectionner toutes les colonnes pour voir les données actuelles
            .eq('id', id)
            .single();

        if (existingError) {
            console.error('(4) Erreur lors de la vérification du service:', existingError);
            return { success: false, error: `Service non trouvé: ${existingError.message}` };
        }

        if (!existingService) {
            console.error('(5) Service non trouvé pendant la vérification préalable');
            return { success: false, error: 'Service non trouvé (aucun résultat)' };
        }

        console.log('(6) Service existant trouvé:', existingService);

        // Procéder à la mise à jour
        console.log('(7) Exécution de la mise à jour');
        const { data: updateResult, error: updateError } = await supabase
            .from('services')
            .update(updatesWithoutId)
            .eq('id', id)
            .select();

        if (updateError) {
            console.error('(8) Erreur Supabase lors de la mise à jour:', updateError);
            return { success: false, error: `Erreur lors de la mise à jour: ${updateError.message}` };
        }

        console.log('(9) Résultat de la mise à jour:', updateResult);

        // Si l'API renvoie des données après la mise à jour, utilisons-les
        if (updateResult && updateResult.length > 0) {
            console.log('(10) Mise à jour réussie avec données retournées');
            // Revalidate the services page to update the cache
            revalidatePath('/');
            return { success: true, data: updateResult[0] };
        }

        // Si l'API ne renvoie pas de données, effectuons une requête séparée
        console.log('(11) Récupération des données mises à jour');
        const { data: updatedService, error: fetchError } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('(12) Erreur lors de la récupération du service mis à jour:', fetchError);
            return { success: false, error: 'Service mis à jour mais impossible de récupérer les données' };
        }

        console.log('(13) Service mis à jour récupéré:', updatedService);
        console.log('(14) Comparaison avant/après:');
        console.log('     - Avant:', existingService);
        console.log('     - Après:', updatedService);

        // Vérifier si les données ont réellement changé
        let hasChanged = false;
        for (const key in updatesWithoutId) {
            if (updatesWithoutId[key] !== existingService[key]) {
                console.log(`(15) Changement détecté dans ${key}: ${existingService[key]} -> ${updatesWithoutId[key]}`);
                hasChanged = true;
            }
        }

        if (!hasChanged) {
            console.warn('(16) ATTENTION: Aucun changement détecté dans les données!');
        }

        // Revalidate the services page to update the cache
        revalidatePath('/');
        console.log('(17) Revalidation du chemin et retour success=true');
        return { success: true, data: updatedService };
    } catch (error: any) {
        console.error('(18) Exception lors de la mise à jour du service:', error);
        return { success: false, error: `Une erreur inattendue est survenue: ${error?.message || 'Sans détails'}` };
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

        // Revalidate the services page to update the cache
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Exception lors de la suppression du service:', error);
        return { success: false, error: 'Une erreur inattendue est survenue' };
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
        return { success: false, error: 'Une erreur inattendue est survenue' };
    }
}