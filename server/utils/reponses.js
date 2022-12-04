const responses = {
    ok: `ok`,
    check_authent_failed: `AUTH.NO_AUTHENTICATED`,
    link_expired: `AUTH.LIEN_EXPIRED`,
    token_expired: `AUTH.TOKEN_EXPIRED`,
    wrong_token: `AUTH.WRONG_TOKEN`,
    signin_failed: `AUTH.SIGNIN_FAILED`,
    unknow_mail: `AUTH.UNKNOW_MAIL`,
    no_token: `AUTH.NO_RESERVATION_TOKEN`,
    email_already_exist: `AUTH.EMAIL_EXIST`,
    invalid_old_pwd: `AUTH.WRONG_OLD_PWD`,
    error_pwd_changed: `AUTH.ERR_CHGT_PWD`,
    not_cancel_because_empty_message: `MON_COMPTE.MESSAGE_ANNULATION_RESA_VIDE`,
    cancelation_not_possible_after_48h: `REPONSE_LOGEMENT_RESERVATION.NOT_ANNULABLE`,
    adresse_not_in_corse: `LOGEMENTS.FORM.MAUVAISE_ADRESSE`,
    logement_not_available: `LOGEMENTS.FILTRES.UNAVAILABLE`,
    invalides_dates_for_reservation: `LOGEMENTS.DETAILS.INDISPONIBLE`,
    logement_reservation_not_started_while_user_deletion_asked: `USER.SUPPRIMER_COMPTE_IMPOSSIBLE`,
    reservation_accepted: `REPONSE_LOGEMENT_RESERVATION.REPONSE_RESA_ACCEPTEE`,
    mail_sent_successfully: `MAIL.SUCCESS`,
    mail_reservation_rejected: "MAIL.RESERVATION_REJETEE",
    demande_envoyee_success: "MAIL.DEMANDE_ENVOYEE_SUCCESS",
    email_to_your_address: "MAIL.EMAIL_TO_YOUR_ADDRESS",
    email_annulation_to_host: "MAIL.ANNULATION_TO_HOST",
    email_annulation_to_traveler: "MAIL.ANNULATION_TO_TRAVELER"
}

module.exports = responses