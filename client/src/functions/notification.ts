import axios from "axios";
import { emailParams, functionData,  notificationEmail } from "../types/notification";
import emailjs from "@emailjs/browser";

const serviceId = "service_s3jvp7d";
//process.env.REACT_APP_EMAIL_SERVICE_ID;
const templateId = "requestPicks";
const publicKey = "7V3KMhSGrGlz-4pNX";
//process.env.REACT_APP_EMAIL_PUBLIC_KEY;

let date = new Date();
date.setDate(date.getDate() + 14);
let futureDate = date.toLocaleDateString();

export const sendNotification = async ({...details}:functionData) => {
console.log()
try {
	const emailParameters:emailParams = {
	  name: details.emailTo,
	  date: futureDate,
	  link:details.link,
	  emailTo: details.emailTo,
	    from_name: details.from_name,
	    messageBody:details.messageBody,
	  subject: details.subject,
	  reply_to: details.reply_to,
	};
	
	  const notifyData: notificationEmail = {
	    messageBody:details.messageBody,
	    link: details.link,
	    to: details.emailTo,
	    from:details.from_name,
	    applicationid: details.applicationid,
	    entityname: details.entityname || "RequestPicks",
	    notifierstatus: true,
	    sendOn: new Date(),
	  };
    
    emailjs.send(serviceId, templateId, emailParameters, publicKey)
        .then(
	    async (res) => {
	      console.log(`Email status ... ;  ${res.status}`);
                console.log(`Email Sent Successfully ${res.text}`);
                const postUrl = `https://exove.vercel.app/api/notify`
	      const { data } = await axios.post(postUrl,{...notifyData},{withCredentials:true} );
	         
	          console.log(data)
	   return data.toString()
	    },
	    (err) => {
	        console.log(`An error occured ${err.message}`);
	        return `An error occured ${err.message}`
	    }
	  );
} catch (error) {
	return error
}
};
