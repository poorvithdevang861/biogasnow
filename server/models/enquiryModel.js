import { getStore, saveStore } from './store.js';

export function getAllEnquiries(filter = {}) {
  const store = getStore();
  let list = store.enquiries || [];

  if (filter.toPlantId) {
    list = list.filter((e) => e.toPlantIds && e.toPlantIds.includes(filter.toPlantId));
  }

  if (filter.fromProfile) {
    list = list.filter((e) => e.fromProfile === filter.fromProfile);
  }

  return list;
}

export function getEnquiryById(id) {
  const store = getStore();
  return (store.enquiries || []).find((e) => e.id === id) || null;
}

export function createEnquiry(enquiryData) {
  const store = getStore();
  const newEnquiry = {
    id: `enq-${Date.now()}`,
    fromProfile: enquiryData.fromProfile,
    fromName: enquiryData.fromName || 'Anonymous Participant',
    toPlantIds: Array.isArray(enquiryData.toPlantIds) ? enquiryData.toPlantIds : [enquiryData.toPlantIds],
    summary: enquiryData.summary || {},
    questions: enquiryData.questions || '',
    contactPreference: enquiryData.contactPreference || 'Email',
    status: 'pending_review', // pending_review | answered | archived
    replies: [],
    createdAt: new Date().toISOString(),
  };

  if (!store.enquiries) {
    store.enquiries = [];
  }

  store.enquiries.unshift(newEnquiry);
  saveStore();
  return newEnquiry;
}

export function addEnquiryReply(id, replyText, fromPlantId) {
  const store = getStore();
  const enquiry = (store.enquiries || []).find((e) => e.id === id);
  if (!enquiry) return null;

  if (!enquiry.replies) enquiry.replies = [];

  const replyObj = {
    id: `reply-${Date.now()}`,
    fromPlantId,
    text: replyText,
    createdAt: new Date().toISOString(),
  };

  enquiry.replies.push(replyObj);
  enquiry.status = 'answered';
  enquiry.updatedAt = new Date().toISOString();

  saveStore();
  return enquiry;
}

export function updateEnquiryStatus(id, status) {
  const store = getStore();
  const enquiry = (store.enquiries || []).find((e) => e.id === id);
  if (!enquiry) return null;

  enquiry.status = status;
  enquiry.updatedAt = new Date().toISOString();
  saveStore();
  return enquiry;
}

export default {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  addEnquiryReply,
  updateEnquiryStatus,
};
