import { Resend } from "resend";

/**
 * Envoi d'e-mail pour le formulaire de contact, via Resend
 * (https://resend.com). Tourne uniquement côté serveur (route API) : la
 * clé secrète Resend ne doit jamais atteindre le navigateur.
 *
 * Important à savoir sur Resend sans domaine personnalisé (voir README,
 * section "Formulaire de contact") : sans domaine vérifié, l'expéditeur
 * "onboarding@resend.dev" ne peut envoyer QUE vers l'adresse e-mail du
 * compte Resend lui-même (restriction anti-spam de Resend, pas un bug
 * ici). Comme ce formulaire envoie justement vers l'adresse de contact de
 * la marque, ça fonctionne très bien SI le compte Resend est créé avec
 * cette même adresse (contact.diabs090@gmail.com) — aucun nom de domaine
 * à acheter.
 */

const CONTACT_RECIPIENT = "contact.diabs090@gmail.com";
const FROM_ADDRESS = "DIABS — Site web <onboarding@resend.dev>";

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY manquante dans les variables d'environnement.");
  }
  return new Resend(key);
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(input: ContactMessageInput): Promise<void> {
  const resend = getClient();

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: CONTACT_RECIPIENT,
    replyTo: input.email,
    subject: `[Contact site] ${input.subject} — ${input.name}`,
    text: [
      `Nouveau message depuis le formulaire de contact du site DIABS.`,
      ``,
      `Nom : ${input.name}`,
      `E-mail : ${input.email}`,
      `Sujet : ${input.subject}`,
      ``,
      `Message :`,
      input.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message || "Échec de l'envoi via Resend.");
  }
}
