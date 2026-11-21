import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveProfileId, setActiveProfileId, api } from '../api/client';

// Baseline fallback profiles matching seed data
export const FALLBACK_PROFILES = [
  {
    id: 'waste-restaurant-1',
    role: 'waste_provider',
    roleLabel: 'Waste Provider',
    name: 'Green Fork Bistro',
    subtext: 'Urban Restaurant · 120–180 kg/day kitchen organics',
    location: 'Bristol Central',
  },
  {
    id: 'waste-kitchen-2',
    role: 'waste_provider',
    roleLabel: 'Waste Provider',
    name: 'St. Jude Community Kitchen',
    subtext: 'Community Kitchen · ~50 kg/day food prep',
    location: 'Bath & North East Somerset',
  },
  {
    id: 'consumer-household-1',
    role: 'consumer',
    roleLabel: 'Biogas Consumer',
    name: 'Oakfield Eco-Terrace',
    subtext: '4-Bed Residence · Cooking & heating offtake',
    location: 'Bristol East',
  },
  {
    id: 'consumer-hotel-2',
    role: 'consumer',
    roleLabel: 'Biogas Consumer',
    name: 'Somerset Meadow Inn',
    subtext: 'Boutique Hotel · Continuous thermal hot water',
    location: 'Mendip District, Somerset',
  },
  {
    id: 'plant-apex-1',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Apex BioGen Engineering',
    subtext: 'Turnkey AD Systems · Full commissioning verified',
    location: 'South West & Midlands',
  },
  {
    id: 'plant-circular-2',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Circular Gas Systems',
    subtext: 'Modular Digesters · Commissioning pending',
    location: 'Wales & West',
  },
  {
    id: 'plant-terra-3',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'TerraFirma BioPower',
    subtext: 'Micro-Digesters · Missing commissioning proof',
    location: 'South West England',
  },
  {
    id: 'plant-valebio-4',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Vale Biomass & Energy',
    subtext: 'Farm-Scale AD · Warranty unverified',
    location: 'Somerset & Gloucestershire',
  },
];

const ProfileContext = createContext({
  activeProfile: FALLBACK_PROFILES[0],
  profiles: FALLBACK_PROFILES,
  setProfileById: () => {},
  loading: false,
});

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(FALLBACK_PROFILES);
  const [activeProfileId, setActiveIdState] = useState(() => getActiveProfileId());
  const [loading, setLoading] = useState(true);

  // Fetch profiles from backend
  useEffect(() => {
    let isMounted = true;
    api.get('/profiles')
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          // Format with subtext if needed
          const enriched = res.data.map((p) => {
            const fallback = FALLBACK_PROFILES.find((f) => f.id === p.id);
            return {
              ...p,
              subtext: fallback?.subtext || `${p.location} · ${p.roleLabel}`,
            };
          });
          setProfiles(enriched);
        }
      })
      .catch((err) => {
        console.warn('Using baseline fallback profiles:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const setProfileById = (id) => {
    setActiveProfileId(id);
    setActiveIdState(id);
  };

  useEffect(() => {
    setActiveProfileId(activeProfile.id);
  }, [activeProfile.id]);

  return (
    <ProfileContext.Provider value={{ activeProfile, profiles, setProfileById, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
