export interface notificationEmail { // for posting to the database
    messageBody: string,
    link: string,
    to: string,
    from: string,
    applicationid: string,
    entityname: string,
    notifierstatus: boolean,
    sendOn:Date | null,
}

export interface emailParams { // for sending email
    name: string;
    date: string;
    link: string;
    emailTo: string;
    from_name: string;
    subject: string;
    reply_to: string;
    [key: string]: unknown; // Add an index signature
}

export interface functionData {
    link: string,
    emailTo: string,
    from_name: string
    messageBody: string
    applicationid: string
    entityname: string
    subject: string
    reply_to:string
}