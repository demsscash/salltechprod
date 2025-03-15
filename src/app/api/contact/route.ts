import { NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Route API pour le traitement du formulaire de contact
export async function POST(request: Request) {
  try {
    // Récupérer les données du formulaire
    const data: ContactFormData = await request.json();
    const { name, email, message } = data;
    
    // Validation des données
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Tous les champs sont requis' }, { status: 400 });
    }
    
    // Ici, vous pourriez ajouter l'intégration avec un service d'email (SendGrid, Mailgun, etc.)
    // Exemple avec SendGrid (nécessite l'installation du package):
    /*
    import sgMail from '@sendgrid/mail';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: 'contact@salltech.mr',
      from: 'noreply@salltech.mr',
      subject: `Nouveau message de ${name}`,
      text: message,
      html: `
        <div>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };
    
    await sgMail.send(msg);
    */
    
    // Dans cet exemple, nous simulons juste un succès
    console.log('Formulaire reçu:', { name, email, message });
    
    // Renvoyer une réponse de succès
    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors du traitement du formulaire:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}