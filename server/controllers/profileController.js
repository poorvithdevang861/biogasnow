import profileModel from '../models/profileModel.js';

export function getProfiles(req, res) {
  const profiles = profileModel.getAllProfiles();
  res.json({
    data: profiles,
    total: profiles.length,
    illustrative: true,
  });
}

export function getProfileById(req, res) {
  const profile = profileModel.getProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json({
    data: profile,
    illustrative: true,
  });
}

export function getCurrentProfile(req, res) {
  const profileId = req.profileId || 'waste-restaurant-1';
  const profile = profileModel.getProfileById(profileId) || profileModel.getAllProfiles()[0];
  res.json({
    data: profile,
    illustrative: true,
  });
}

export default {
  getProfiles,
  getProfileById,
  getCurrentProfile,
};
