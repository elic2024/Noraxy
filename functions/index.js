const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");

admin.initializeApp();

// ATENÇÃO: Substitua pelos seus próprios valores!
const stripeClient = new stripe(
  "sk_test_SUA_CHAVE_SECRETA_DO_STRIPE_AQUI"
);
const webhookSecret = "whsec_SEU_SEGREDO_DE_WEBHOOK_AQUI";

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripeClient.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Lidar com o evento
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const customerEmail = session.customer_email;

      try {
        // Encontra o usuário no Firebase Authentication pelo email
        const user = await admin.auth().getUserByEmail(customerEmail);
        
        // Atualiza o plano do usuário no Firestore para "pro"
        const userDocRef = admin.firestore().collection("users").doc(user.uid);
        await userDocRef.update({
          plan: "pro",
        });

        console.log(`Plano do usuário ${customerEmail} (UID: ${user.uid}) atualizado para PRO.`);

      } catch (error) {
        console.error(
          `Erro ao encontrar ou atualizar usuário para o email ${customerEmail}:`,
          error
        );
        return res.status(500).send("Erro ao processar o webhook.");
      }
      break;
      
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.sendStatus(200);
});
