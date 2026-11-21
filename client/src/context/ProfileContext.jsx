import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveProfileId, setActiveProfileId, api } from '../api/client';

// Baseline fallback profiles matching Indian seed data
export const FALLBACK_PROFILES = [
  {
    id: 'waste-restaurant-1',
    role: 'waste_provider',
    roleLabel: 'Waste Provider',
    name: 'Annapurna Kitchens',
    subtext: 'Commercial Kitchen · 120–180 kg/day organic food scraps',
    location: 'Indiranagar, Bengaluru',
  },
  {
    id: 'waste-kitchen-2',
    role: 'waste_provider',
    roleLabel: 'Waste Provider',
    name: 'Akshaya Community Bhojanalaya',
    subtext: 'Community Kitchen · ~50 kg/day vegetable prep',
    location: 'Shivajinagar, Pune',
  },
  {
    id: 'consumer-household-1',
    role: 'consumer',
    roleLabel: 'Biogas Consumer',
    name: 'Gulmohar Greens Society',
    subtext: '36-Unit Residence · Cooking & hot water offtake',
    location: 'Kothrud, Pune',
  },
  {
    id: 'consumer-hotel-2',
    role: 'consumer',
    roleLabel: 'Biogas Consumer',
    name: 'Heritage Haveli Retreat',
    subtext: 'Heritage Resort · Continuous thermal kitchen & boiler fuel',
    location: 'Udaipur, Rajasthan',
  },
  {
    id: 'plant-apex-1',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'UrjaVeda BioEnergy Tech',
    subtext: 'Turnkey Biogas Systems · MNRE & PESO Verified',
    location: 'Vadodara & Bengaluru',
  },
  {
    id: 'plant-circular-2',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Prakriti CleanGas Systems',
    subtext: 'Modular Digesters · Commissioning pending',
    location: 'Bengaluru & Coimbatore',
  },
  {
    id: 'plant-terra-3',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Bhoomi Shakti BioPower',
    subtext: 'Micro-Digesters · Decentralized campus units',
    location: 'Indore, Madhya Pradesh',
  },
  {
    id: 'plant-valebio-4',
    role: 'plant_provider',
    roleLabel: 'Plant Provider',
    name: 'Kisan Urja BioRefineries',
    subtext: 'Bio-CNG SATAT Facility · Agro-slurry & pressmud',
    location: 'Nashik, Maharashtra',
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
