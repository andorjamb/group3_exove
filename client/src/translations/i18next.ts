import i18next from "i18next";
import { initReactI18next } from "react-i18next";

//namespaces for translations are organised by component

import login_en from "./en/login.json";
import login_fi from "./fi/login.json";
import header_en from "./en/header.json";
import header_fi from "./fi/header.json";
import dashboardUser_en from "./en/dashboardUser.json";
import dashboardUser_fi from "./fi/dashboardUser.json";
import userProfile_en from "./en/userProfile.json";
import userProfile_fi from "./fi/userProfile.json";
import report_en from "./en/report.json";
import report_fi from "./fi/report.json";
import template_en from "./en/template.json";
import template_fi from "./fi/template.json";

//export const defaultNS = "ns1";
export const resources = {
  en: {
    login: login_en,
    header: header_en,
    dashboardUser: dashboardUser_en,
    userProfile: userProfile_en,
    report: report_en,
    template: template_en,
  },
  fi: {
    login: login_fi,
    header: header_fi,
    dashboardUser: dashboardUser_fi,
    userProfile: userProfile_fi,
    report: report_fi,
    template: template_fi,
  },
};

i18next.use(initReactI18next).init({
  fallbackLng: "en",
  ns: [
    "login_en",
    "login_fi",
    "header_en",
    "header_fi",
    "dashboardUser_en",
    "dashboardUser_fi",
    "userProfile_en",
    "userProfile_fi",
    "report_en",
    "report_fi",
    "template_en",
    "template_fi",
  ],
  //defaultNS,
  resources,
  react: {
    bindI18n: "languageChanged loaded",
  },
});
