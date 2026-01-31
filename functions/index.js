const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");
const {defineString} = require("firebase-functions/params");

admin.initializeApp();

// FORÇANDO A ATUALIZAÇÃO DO DEPLOY - v1.2
const stripeSecretKey = defineString("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET");

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeClient = new stripe(stripeSecretKey.value());
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripeClient.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret.value());
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Lidar com o evento
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error("Erro: client_reference_id não encontrado na sessão do Stripe.");
        return res.status(400).send("Erro: ID do usuário não encontrado.");
      }

      try {
        const userDocRef = admin.firestore().collection("users").doc(userId);
        await userDocRef.update({ plan: "pro" });
        console.log(`Plano do usuário (UID: ${userId}) atualizado para PRO com sucesso.`);
      } catch (error) {
        console.error(`Erro ao atualizar usuário (UID: ${userId}):`, error);
        return res.status(500).send("Erro ao processar o webhook.");
      }
      break;
      
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.sendStatus(200);
});
