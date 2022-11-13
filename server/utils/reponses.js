const responses = {
    ok: `ok`,
    check_authent_failed: `Vous n'êtes pas authentifié`,
    link_expired: `Ce lien a expiré`,
    token_expired: `Token expiré`,
    wrong_token: `Le token n'est pas bon`,
    signin_failed: `La connexion a échoué, les identifiants sont incorrectes`,
    unknow_mail: `Adresse email inconnue`,
    no_token: `pas de token`,
    email_already_exist: `Cet email est déjà enregistré`,
    invalid_old_pwd: `Ancien mot de passe invalide`,
    error_pwd_changed: `Une erreur s'est produite lors du changement de mot de passe`,
    not_cancel_because_empty_message: `Votre message était vide, l'annulation n'a pas abouti`,
    cancelation_not_possible_after_48h: `Une annulation n'est possible que 48h à l'avance, vous avez passé ce délais`,
    adresse_not_in_corse: `Cette adresse n'est pas en Corse`,
    logement_reservation_not_started_while_user_deletion_asked:
    `Vous avez au moins un voyageur qui n'a pas encore commencé son voyage, 
    vous ne pouvez supprimer votre compte que lorsque vous n'avez plus de réservations à venir.`
}

module.exports = responses