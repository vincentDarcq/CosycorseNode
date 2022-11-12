const cron = require('node-cron');
const { newError, saveErrorTransfert } = require('../queries/erreur_transfert');
const { getLogementById } = require('../queries/logement.queries');
const { 
    findLogementReservationsAcceptedAndNotPayed, 
    updateLogementReservation
} = require('../queries/logement_reservation.queries');
const { getUserByMail } = require('../queries/user.queries');

const { 
    STRIPE_SECRET_KEY
} = require(`../tokens/${process.env.NODE_ENV}`);

const stripe = require('stripe')(STRIPE_SECRET_KEY);

cron.schedule('0 0 * * *', async () => {
    console.log("cron job for host paiements")
    transfertOnHostAccountForStartedReservations();
});

let transfertOnHostAccountForStartedReservations = async () => {
    const now = new Date();
    const lr = await findLogementReservationsAcceptedAndNotPayed();
    lr.forEach( async logRes => {
        const dd = getDateFromStringDate(logRes.dateDebut);
        const jours = (dd.getTime() - now.getTime())/1000/3600/24;
        if(jours < 0){
            try {
                const annonceur = await getUserByMail(logRes.emailAnnonceur);
                const demandeur = await getUserByMail(logRes.emailDemandeur);
                const logement = await getLogementById(logRes.logementId);
                await stripe.transfers.create({
                    amount: logRes.prix * (10000/110),
                    currency: 'eur',
                    destination: annonceur.stripeUserId,
                    transfer_group: `adresse : ${logement.adresse}, customer : ${demandeur._id}`,
                });
                logRes.paye = true;
                await updateLogementReservation(logRes);
            }catch(e){
                const err = newError(
                    e, 
                    new Date().toLocaleDateString("fr-FR"), 
                    logRes._id, 
                    logRes.prix, 
                    annonceur.stripeUserId
                );
                await saveErrorTransfert(err);
            }
        }
    });
}

let getDateFromStringDate = (date) => {
    const d = new Date();
    d.setDate(parseInt(date.split('/')[0]));
    d.setMonth(parseInt(date.split('/')[1])-1);
    d.setFullYear(parseInt(date.split('/')[2]));
    d.setHours(1);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}