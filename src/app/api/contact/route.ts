import { sendContactEmail } from "@/lib/resend";

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Reçoit une soumission du formulaire de contact et l'envoie par e-mail à
 * la marque via Resend (src/lib/resend.ts). Toute la validation se fait
 * ici, côté serveur — on ne fait jamais confiance uniquement aux
 * contraintes HTML (`required`) du formulaire.
 */
export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error(
      "[api/contact] RESEND_API_KEY manquante — ajoute-la dans .env.local (voir README)."
    );
    return Response.json(
      {
        error:
          "L'envoi de message est temporairement indisponible. Contacte-nous directement par e-mail ou WhatsApp (voir la page Contact).",
      },
      { status: 503 }
    );
  }

  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const subject = body.subject?.trim() || "Autre";
  const message = body.message?.trim();

  if (!name) {
    return Response.json({ error: "Le nom est requis." }, { status: 400 });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 }
    );
  }
  if (!message) {
    return Response.json({ error: "Le message est requis." }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, subject, message });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/contact] Échec de l'envoi via Resend :", error);
    return Response.json(
      {
        error:
          "Le message n'a pas pu être envoyé. Réessaie, ou contacte-nous directement par e-mail ou WhatsApp.",
      },
      { status: 502 }
    );
  }
}
