import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Récupérer tous les services
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Créer un nouveau service
export async function POST(request: Request) {
    try {
        const serviceData = await request.json();

        const { data, error } = await supabase
            .from('services')
            .insert([serviceData])
            .select();

        if (error) throw error;

        return NextResponse.json(data[0], { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création du service:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}