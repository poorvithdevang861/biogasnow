import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Factory,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Building2,
  MapPin,
  Utensils,
  Flame,
  Check,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';

export function PlantOnboarding() {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();

  const [activeView, setActiveView] = useState('inbox'); // 'inbox' | 'profile'
  const [plant, setPlant] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replySuccess, setReplySuccess] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Form State for Plant Profile
  const [profileData, setProfileData] = useState({
    organisation: 'Apex BioEnergy Systems',
    scale: 'medium',
    capacityMin: 100,
    capacityMax: 500,
    serviceArea: 'Bengaluru Urban, Bengaluru Rural, Hosur',
    supportedFeedstock: 'Kitchen food waste, Mandi vegetable trimmings, Canteen leftovers',
    omOffering: '24/7 telemetry monitoring and quarterly biological health checkups',
    warranty: '5-year structural tank warranty; 2-year gas compressor warranty',
  });

  const loadData = () => {
    const plantId = activeProfile?.id || 'plant-apex-1';
    api.get(`/plants/${plantId}`)
      .then((res) => {
        if (res?.data) {
          setPlant(res.data);
          setProfileData({
            organisation: res.data.organisation || 'Apex BioEnergy Systems',
            scale: res.data.scale || 'medium',
            capacityMin: res.data.capacityMin || 100,
            capacityMax: res.data.capacityMax || 500,
            serviceArea: Array.isArray(res.data.serviceArea) ? res.data.serviceArea.join(', ') : res.data.serviceArea,
            supportedFeedstock: Array.isArray(res.data.supportedFeedstock) ? res.data.supportedFeedstock.join(', ') : res.data.supportedFeedstock,
            omOffering: res.data.omOffering || '',
            warranty: res.data.warranty || '',
          });
        }
      })
      .catch(() => {});

    api.get(`/enquiries?toPlantId=${plantId}`)
      .then((res) => setEnquiries(res?.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [activeProfile?.id]);

  const handleSendReply = async () => {
    if (!selectedEnquiry || !replyText.trim()) return;
    setLoading(true);
    try {
      await api.post(`/enquiries/${selectedEnquiry.id}/reply`, {
        replyText,
        fromPlantId: activeProfile?.id || 'plant-apex-1',
      });
      setReplySuccess(true);
      setReplyText('');
      setTimeout(() => {
        setSelectedEnquiry(null);
        setReplySuccess(false);
        loadData();
      }, 1500);
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plantId = activeProfile?.id || 'plant-apex-1';
      await api.put(`/plants/${plantId}`, {
        ...profileData,
        serviceArea: profileData.serviceArea.split(',').map((s) => s.trim()),
        supportedFeedstock: profileData.supportedFeedstock.split(',').map((s) => s.trim()),
      });
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
      loadData();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-zinc-900 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
            Plant Operator Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
            {profileData.organisation}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage inbound feedstock requests, customer quotes, and operating capacity.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('inbox')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'inbox'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Mail size={13} />
            <span>Customer Requests ({enquiries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('profile')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeView === 'profile'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Factory size={13} />
            <span>Facility Specs</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INBOUND REQUESTS INBOX */}
      {activeView === 'inbox' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              Inbound Customer & Waste Requests
            </h2>
            <span className="text-xs text-zinc-500">
              {enquiries.filter((e) => e.status !== 'answered').length} pending reply
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
              No new customer requests at the moment.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const isAnswered = enq.status === 'answered';
                return (
                  <div
                    key={enq.id}
                    className={`p-4 rounded-xl border transition-all text-xs space-y-3 ${
                      isSelected
                        ? 'border-forest-900 bg-forest-50/40 shadow-xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 text-sm">{enq.fromName}</span>
                          <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                            {enq.summary?.role === 'waste_provider' ? 'Waste Generator' : 'Gas Consumer'}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 block">
                          Ref: {enq.id} · Location: {enq.summary?.location || 'Bengaluru'}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                          isAnswered
                            ? 'bg-forest-50 text-forest-900 border-forest-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {isAnswered ? 'Proposal Sent' : 'Needs Response'}
                      </span>
                    </div>

                    {/* Summary metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/80">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Stream / Application:</span>
                        <span className="font-medium text-zinc-900">{enq.summary?.wasteType || enq.summary?.application || 'Food waste'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Volume / Demand:</span>
                        <span className="font-medium text-zinc-900">{enq.summary?.quantityRange || enq.summary?.monthlyCylinders || '150 kg/day'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Estimated Savings:</span>
                        <span className="font-medium text-forest-900">{enq.summary?.fuelCostSavings || '~6 cylinders/mo'}</span>
                      </div>
                    </div>

                    <p className="text-zinc-600 leading-relaxed">
                      {enq.questions}
                    </p>

                    {/* Replies thread if any */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-zinc-100">
                        <span className="text-[10px] font-semibold text-zinc-500 block">Your Sent Response:</span>
                        {enq.replies.map((r, i) => (
                          <div key={i} className="p-2 rounded bg-forest-50/70 border border-forest-200 text-forest-950 text-xs">
                            {r.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(isSelected ? null : enq)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer"
                      >
                        {isSelected ? 'Close Response Box' : isAnswered ? 'Send Follow-up' : 'Respond to Client'}
                      </button>
                    </div>

                    {/* Inline Reply Form */}
                    {isSelected && (
                      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 mt-2">
                        <label className="text-xs font-semibold text-zinc-800 block">
                          Draft proposal or schedule a site visit:
                        </label>
                        <textarea
                          rows="3"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="e.g. We have reviewed your daily scrap volume. Our collection vehicle can service your kitchen at 6:00 AM daily. Quoted fee: ₹0 (free pickup for sorted scraps)."
                          className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        />
                        <div className="flex items-center justify-between">
                          {replySuccess ? (
                            <span className="text-xs font-medium text-forest-800 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Proposal sent!
                            </span>
                          ) : <span />}
                          <button
                            type="button"
                            disabled={loading || !replyText.trim()}
                            onClick={handleSendReply}
                            className="bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Send size={12} />
                            <span>{loading ? 'Sending...' : 'Send Proposal'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: FACILITY SPECS FORM */}
      {activeView === 'profile' && (
        <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Facility Specifications & Listing
              </h2>
              <p className="text-xs text-zinc-500">
                Update the waste streams accepted, daily capacity, and service area.
              </p>
            </div>
            {savedNotification && (
              <span className="text-xs font-medium text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200 flex items-center gap-1">
                <Check size={12} /> Specs updated!
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Facility Name:</label>
              <input
                type="text"
                value={profileData.organisation}
                onChange={(e) => setProfileData({ ...profileData, organisation: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Daily Intake Capacity:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={profileData.capacityMin}
                  onChange={(e) => setProfileData({ ...profileData, capacityMin: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                />
                <span className="text-zinc-400">to</span>
                <input
                  type="number"
                  value={profileData.capacityMax}
                  onChange={(e) => setProfileData({ ...profileData, capacityMax: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                />
                <span className="text-zinc-500 text-xs">kg/day</span>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Service Territory / Neighborhoods:</label>
              <input
                type="text"
                value={profileData.serviceArea}
                onChange={(e) => setProfileData({ ...profileData, serviceArea: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                placeholder="e.g. Indiranagar, Whitefield, Koramangala"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Accepted Waste Types:</label>
              <input
                type="text"
                value={profileData.supportedFeedstock}
                onChange={(e) => setProfileData({ ...profileData, supportedFeedstock: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                placeholder="e.g. Kitchen food scraps, Canteen leftovers, Vegetable peels"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">O&M / Servicing SLA Terms:</label>
              <input
                type="text"
                value={profileData.omOffering}
                onChange={(e) => setProfileData({ ...profileData, omOffering: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Specifications'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PlantOnboarding;
