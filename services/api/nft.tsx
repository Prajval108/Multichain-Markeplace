import axios from "axios";
import { useRouter } from "next/router";
import {
  handleResponse,
  handleError,
} from "../reponseHandler/responseErrorHandler";

const headers = () => {
  return {
    "Content-Language": localStorage.getItem("lang"),
  };
};

const getDiseasesList = async () => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-all-diseases", {})
    .then(handleResponse)
    .catch(handleError);
};

const getPatientList = async () => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-all-patients", {})
    .then(handleResponse)
    .catch(handleError);
};

const getDoctorList = async (authorized: boolean) => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-all-doctors", {
      params: {
        authorized: authorized,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const getAccessPatient = async () => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-access-patient", {
      params: {
        doctor: localStorage.getItem("metamask"),
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const getSharedDataByPatient = async () => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-index-count-by-patient", {
      params: {
        patient: localStorage.getItem("metamask"),
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const getSharedAccessDoctors = async (index: number) => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-shared-access-doctors", {
      params: {
        patient: localStorage.getItem("metamask"),
        index: index,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const isDoctorAuthorized = async () => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/is-doctor-authorized", {
      params: {
        doctor: localStorage.getItem("metamask"),
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const getDoctorsWithoutAccess = async (index:number) => {
  return axios
    .get(process.env.NEXT_PUBLIC_API_URL + "/get-doctors-without-access", {
      params: {
        patient: localStorage.getItem("metamask"),
        index: index
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

export const apiNft = {
  getDiseasesList,
  getPatientList,
  getDoctorList,
  getAccessPatient,
  getSharedDataByPatient,
  getSharedAccessDoctors,
  isDoctorAuthorized,
  getDoctorsWithoutAccess,
};
