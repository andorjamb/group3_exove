import React from "react";
import emailjs from "@emailjs/browser";

/* interface IEmailParameters {
  name: string;
  date: string;
  link: string;
} */
const EmailTest = () => {
  const username = "Lera";
  const link = "https://exove-colleaguefeedback-client.vercel.app/dashboard";

  const serviceId = "service_s3jvp7d";
  //process.env.REACT_APP_EMAIL_SERVICE_ID;
  const templateId = "requestPicks";
  const publicKey = "7V3KMhSGrGlz-4pNX";
  //process.env.REACT_APP_EMAIL_PUBLIC_KEY;

  let date = new Date();
  date.setDate(date.getDate() + 14);
  let futureDate = date.toLocaleDateString();
  console.log(futureDate); //debugging

  const emailParameters = {
    name: `${username}`,
    date: futureDate,
    link: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQScA7p2q5GDil58X2C_xhJ9BrsRAR2YFt1O9MqAbJxPEr8hYi7",
    emailTo: "lera.vagapova@gmail.com",
    from_name: "Essi",
    reply_to: "y.nomore@gmail.com",
  };
  const sendEmail = (e: any) => {
    e.preventDefault();

    emailjs.send(serviceId, templateId, emailParameters, publicKey).then(
      (result: any) => {
        console.log(result.text);
      },
      (error: any) => {
        console.log(error.text);
      }
    );
  };

  return (
    <div>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default EmailTest;
