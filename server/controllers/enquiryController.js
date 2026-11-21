import enquiryModel from '../models/enquiryModel.js';
import profileModel from '../models/profileModel.js';

export function getEnquiries(req, res) {
  const { toPlantId, fromProfile } = req.query;
  const list = enquiryModel.getAllEnquiries({ toPlantId, fromProfile });
  res.json({
    data: list,
    total: list.length,
    illustrative: true,
  });
}

export function getEnquiryById(req, res) {
  const enquiry = enquiryModel.getEnquiryById(req.params.id);
  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }
  res.json({
    data: enquiry,
    illustrative: true,
  });
}

export function createEnquiry(req, res) {
  const { toPlantIds, summary, questions, contactPreference } = req.body;
  const fromProfile = req.body.fromProfile || req.profileId || 'waste-restaurant-1';

  if (!toPlantIds || (Array.isArray(toPlantIds) && toPlantIds.length === 0)) {
    return res.status(400).json({ error: 'At least one recipient plant provider ID is required' });
  }

  const senderProfile = profileModel.getProfileById(fromProfile);
  const fromName = senderProfile ? senderProfile.name : req.body.fromName || 'Participant';

  const enquiry = enquiryModel.createEnquiry({
    fromProfile,
    fromName,
    toPlantIds,
    summary,
    questions,
    contactPreference,
  });

  res.status(201).json({
    message: 'Simulated enquiry created and forwarded to plant inbox',
    data: enquiry,
    illustrative: true,
  });
}

export function replyToEnquiry(req, res) {
  const { id } = req.params;
  const { replyText, fromPlantId } = req.body;

  if (!replyText) {
    return res.status(400).json({ error: 'Reply text is required' });
  }

  const updated = enquiryModel.addEnquiryReply(id, replyText, fromPlantId || req.profileId);
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  res.json({
    message: 'Simulated reply posted',
    data: updated,
    illustrative: true,
  });
}

export default {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  replyToEnquiry,
};
