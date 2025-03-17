import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// N'utilisez pas d'interface ou de type personnalisé
// Utilisez plutôt la structure exacte attendue par Next.js
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', context.params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération du service:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Mettre à jour un service
export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const serviceData = await request.json();

        const { data, error } = await supabase
            .from('services')
            .update(serviceData)
            .eq('id', context.params.id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du service:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Supprimer un service
export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', context.params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}