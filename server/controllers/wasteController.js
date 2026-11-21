import wasteModel from '../models/wasteModel.js';
import { assessFeedstock } from '../services/assessment.js';
import { findMatchingPlants } from '../services/matching.js';

export function getWasteProfiles(req, res) {
  const list = wasteModel.getAllWasteProfiles();
  res.json({
    data: list,
    illustrative: true,
  });
}

export function getWasteProfile(req, res) {
  const profileId = req.params.profileId || req.profileId;
  const wp = wasteModel.getWasteProfileByProfileId(profileId);
  if (!wp) {
    return res.status(404).json({
      error: 'No saved waste profile found for this participant',
      profileId,
    });
  }
  res.json({
    data: wp,
    illustrative: true,
  });
}

export function saveWasteProfile(req, res) {
  const { wasteType, quantityRange, frequency, intendedUse, siteConstraints } = req.body;
  const profileId = req.body.profileId || req.profileId || 'waste-restaurant-1';

  const saved = wasteModel.upsertWasteProfile({
    profileId,
    wasteType: wasteType || 'not sure',
    quantityRange: quantityRange || 'not sure',
    frequency: frequency || 'not sure',
    intendedUse: intendedUse || 'not sure',
    siteConstraints: siteConstraints || 'not sure',
  });

  res.status(201).json({
    message: 'Waste profile saved',
    data: saved,
    illustrative: true,
  });
}

export function assessWasteStream(req, res) {
  try {
    const result = assessFeedstock(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
}

export function matchPlantsForWaste(req, res) {
  try {
    const result = findMatchingPlants(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'error' });
  }
}

export default {
  getWasteProfiles,
  getWasteProfile,
  saveWasteProfile,
  assessWasteStream,
  matchPlantsForWaste,
};
