import { api } from "./client";

export const blockchainApi = {
  // Status
  getStatus: async () => {
    const response = await api.get("/api/blockchain/status");
    return response.data.data || response.data;
  },

  // Course Registration (IPRegistry)
  registerCourse: async (metadataHash: string, tags: string[], royaltyBps = 500) => {
    const response = await api.post("/api/blockchain/courses/register", {
      metadataHash,
      tags,
      royaltyBps,
    });
    return response.data;
  },

  getCourse: async (courseId: number) => {
    const response = await api.get(`/api/blockchain/courses/${courseId}`);
    return response.data.data || response.data;
  },

  getCreatorCourses: async (wallet: string) => {
    const response = await api.get(`/api/blockchain/courses/creator/${wallet}`);
    return response.data.data || response.data;
  },

  getTotalCourses: async () => {
    const response = await api.get("/api/blockchain/courses/total");
    return response.data.data || response.data;
  },

  // Course Directory (Enrollments)
  enrollCourse: async (courseId: number) => {
    const response = await api.post(`/api/blockchain/courses/${courseId}/enroll`);
    return response.data;
  },

  completeCourse: async (courseId: number) => {
    const response = await api.post(`/api/blockchain/courses/${courseId}/complete`);
    return response.data;
  },

  rateCourse: async (courseId: number, rating: number) => {
    const response = await api.post(`/api/blockchain/courses/${courseId}/rate`, { rating });
    return response.data;
  },

  getEnrollmentStatus: async (courseId: number, wallet: string) => {
    const response = await api.get(`/api/blockchain/courses/${courseId}/enrollment/${wallet}`);
    return response.data.data || response.data;
  },

  // Certificates (CertificateNFT)
  mintCertificate: async (courseId: number, studentWallet: string, courseName: string) => {
    const response = await api.post("/api/blockchain/certificates/mint", {
      courseId,
      studentWallet,
      courseName,
    });
    return response.data;
  },

  getCertificate: async (tokenId: string) => {
    const response = await api.get(`/api/blockchain/certificates/${tokenId}`);
    return response.data.data || response.data;
  },

  getUserCertificates: async (wallet: string) => {
    const response = await api.get(`/api/blockchain/certificates/user/${wallet}`);
    return response.data.data || response.data;
  },

  getTotalCertificates: async () => {
    const response = await api.get("/api/blockchain/certificates/total");
    return response.data.data || response.data;
  },

  // Reputation
  getReputation: async (wallet: string) => {
    const response = await api.get(`/api/blockchain/reputation/${wallet}`);
    return response.data.data || response.data;
  },

  addXP: async (wallet: string, courseId: number) => {
    const response = await api.post(`/api/blockchain/reputation/${wallet}/xp`, { courseId });
    return response.data;
  },

  // Royalties
  registerCourseForRoyalties: async (courseId: number, priceInEth?: string) => {
    const response = await api.post(`/api/blockchain/royalties/courses/${courseId}/register`, {
      priceInEth,
    });
    return response.data;
  },

  setCoursePrice: async (courseId: number, priceInEth: string) => {
    const response = await api.post(`/api/blockchain/royalties/courses/${courseId}/price`, {
      priceInEth,
    });
    return response.data;
  },

  getCourseRoyaltyInfo: async (courseId: number) => {
    const response = await api.get(`/api/blockchain/royalties/courses/${courseId}`);
    return response.data.data || response.data;
  },

  getCreatorEarnings: async (wallet: string) => {
    const response = await api.get(`/api/blockchain/earnings/${wallet}`);
    return response.data.data || response.data;
  },

  withdrawEarnings: async () => {
    const response = await api.post("/api/blockchain/earnings/withdraw");
    return response.data;
  },

  hasPurchasedCourse: async (courseId: number, wallet: string) => {
    const response = await api.get(`/api/blockchain/royalties/courses/${courseId}/purchased/${wallet}`);
    return response.data.data || response.data;
  },
};
