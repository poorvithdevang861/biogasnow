import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';

export function PlantOnboarding() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeProfile, updateActiveProfile } = useProfile();

  const activeTab = searchParams.get('tab') || 'onboarding';

  const [plant, setPlant] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replySuccess, setReplySuccess] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Proposal quotation fields
  const [proposalModel, setProposalModel] = useState('Modular FRP Floating Drum Digester');
  const [proposalCost, setProposalCost] = useState('₹1,85,000');
  const [proposalDays, setProposalDays] = useState('10 working days');

  // Form State for Plant Provider / Installer Profile
  const [profileData, setProfileData] = useState({
    organisation: 'UrjaVeda BioEnergy Tech',
    scale: 'medium',
    capacityMin: 5,
    capacityMax: 50,
    serviceArea: 'Bengaluru, Pune, Mumbai, Coimbatore',
    plantModels: 'Prefabricated FRP Floating Dome, Modular Balloon Digesters, Plug-and-Play Units',
    supportedFeedstock: 'Kitchen food waste, Mandi vegetable trimmings, Canteen leftovers',
    omOffering: '24/7 telemetry monitoring and quarterly biological health checkups',
    warranty: '5-year structural tank warranty; 2-year gas compressor warranty',
    contactPhone: '+91 98450 78901',
    contactEmail: 'projects@urjaveda.in',
  });

  const loadData = () => {
    const plantId = activeProfile?.id || 'plant-apex-1';
    api.get(`/plants/${plantId}`)
      .then((res) => {
        if (res?.data) {
          setPlant(res.data);
          setProfileData({
            organisation: res.data.organisation || activeProfile?.name || 'UrjaVeda BioEnergy Tech',
            scale: res.data.scale || 'medium',
            capacityMin: res.data.capacityMin || 5,
            capacityMax: res.data.capacityMax || 50,
            serviceArea: Array.isArray(res.data.serviceArea) ? res.data.serviceArea.join(', ') : (res.data.serviceArea || 'Bengaluru, Pune, Mumbai'),
            plantModels: 'Prefabricated FRP Floating Dome, Modular Balloon Digesters, Plug-and-Play Units',
            supportedFeedstock: Array.isArray(res.data.supportedFeedstock) ? res.data.supportedFeedstock.join(', ') : (res.data.supportedFeedstock || 'Kitchen food scraps, Canteen leftovers'),
            omOffering: res.data.omOffering || '24/7 telemetry monitoring and quarterly biological health checkups',
            warranty: res.data.warranty || '5-year structural tank warranty; 2-year gas compressor warranty',
            contactPhone: '+91 98450 78901',
            contactEmail: 'projects@urjaveda.in',
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
      const fullReply = `[Turnkey Proposal · ${proposalModel} · Price: ${proposalCost} · Installation: ${proposalDays}] — ${replyText}`;
      await api.post(`/enquiries/${selectedEnquiry.id}/reply`, {
        replyText: fullReply,
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
      if (updateActiveProfile) {
        updateActiveProfile({
          name: profileData.organisation,
          location: profileData.serviceArea.split(',')[0]?.trim() || 'India',
        });
      }
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2500);
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
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">
            {profileData.organisation}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Biogas Plant Supply & Turnkey Installation Network · Manage consumer setup requests and installation specifications.
          </p>
        </div>

        <div className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-900" aria-hidden="true" />
          <span>Verified Turnkey Installer</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INBOUND PLANT SETUP REQUESTS FROM CONSUMERS       */}
      {/* ======================================================== */}
      {activeTab === 'onboarding' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Inbound Plant Setup & Site Survey Requests
              </h2>
              <p className="text-xs text-zinc-500">
                Consumers and kitchens looking to install an on-site biogas plant to replace commercial LPG.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-forest-50 text-forest-900 border border-forest-200">
              {enquiries.filter((e) => e.status !== 'answered').length} pending proposal
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs text-zinc-500 space-y-2">
              <Factory size={24} className="mx-auto text-zinc-400 stroke-[1.5]" />
              <p>No pending installation requests right now.</p>
              <p className="text-[11px] text-zinc-400">
                When restaurants or housing societies submit site survey requests in your territory, they appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const isAnswered = enq.status === 'answered';
                return (
                  <div
                    key={enq.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all text-xs space-y-3 ${
                      isSelected
                        ? 'border-forest-900 bg-forest-50/30 shadow-xs'
                        : 'border-zinc-200/90 bg-white hover:border-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 text-sm">{enq.fromName}</span>
                          <span className="text-[10px] uppercase font-bold text-forest-900 bg-forest-50 px-1.5 py-0.2 rounded border border-forest-200/60">
                            {enq.summary?.role === 'waste_provider' ? 'Waste Offtake & Setup' : 'Turnkey Plant Setup'}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 block mt-0.5">
                          Ref: {enq.id} · Location: {enq.summary?.location || 'Bengaluru'}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                          isAnswered
                            ? 'bg-forest-50 text-forest-900 border-forest-200'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {isAnswered ? 'Proposal Sent' : 'Needs Quotation'}
                      </span>
                    </div>

                    {/* Summary metrics of the consumer's request */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/80">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Current Consumption / Application:</span>
                        <span className="font-medium text-zinc-900">{enq.summary?.application || enq.summary?.wasteType || 'Commercial cooking'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">LPG Demand / Volume:</span>
                        <span className="font-medium text-zinc-900">{enq.summary?.monthlyCylinders ? `${enq.summary.monthlyCylinders} cylinders/mo` : (enq.summary?.quantityRange || '150 kg/day')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Estimated Savings:</span>
                        <span className="font-medium text-forest-900">{enq.summary?.estimatedBiogasRange || '~8 m³ gas / day'}</span>
                      </div>
                    </div>

                    <div className="text-zinc-600 leading-relaxed text-xs">
                      <strong>Client Notes:</strong> {enq.questions}
                    </div>

                    {/* Replies thread if any */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                        <span className="text-[10px] font-semibold text-zinc-500 block">Sent Turnkey Proposal:</span>
                        {enq.replies.map((r, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-forest-50/70 border border-forest-200 text-forest-950 text-xs leading-relaxed">
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
                        className="text-xs px-3.5 py-1.5 rounded-lg font-medium bg-forest-900 hover:bg-forest-800 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Wrench size={12} />
                        <span>{isSelected ? 'Close Proposal Form' : isAnswered ? 'Send Revised Quote' : 'Draft Plant Proposal'}</span>
                      </button>
                    </div>

                    {/* Inline Turnkey Proposal Form */}
                    {isSelected && (
                      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 mt-3">
                        <div className="border-b border-zinc-200 pb-2">
                          <h4 className="font-semibold text-zinc-900 text-xs">
                            Turnkey Plant Installation Quotation
                          </h4>
                          <p className="text-[11px] text-zinc-500">
                            Configure the recommended digester model, price, and installation timeline for this client.
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-zinc-700 block">Recommended Plant Model:</label>
                            <select
                              value={proposalModel}
                              onChange={(e) => setProposalModel(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                            >
                              <option value="Modular FRP Floating Drum Digester">Modular FRP Floating Drum (5–15 m³)</option>
                              <option value="Plug-and-Play Pre-fabricated Balloon Unit">Prefabricated Balloon Digester (2–8 m³)</option>
                              <option value="Reinforced Precast Fixed Dome System">Precast Fixed Dome (15–50 m³)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-zinc-700 block">Turnkey Quoted Price:</label>
                            <input
                              type="text"
                              value={proposalCost}
                              onChange={(e) => setProposalCost(e.target.value)}
                              placeholder="e.g. ₹1,85,000 (all inclusive)"
                              className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-zinc-700 block">Installation Timeline:</label>
                            <input
                              type="text"
                              value={proposalDays}
                              onChange={(e) => setProposalDays(e.target.value)}
                              placeholder="e.g. 10–14 working days"
                              className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-zinc-700 block">
                            Proposal Details / Survey Scheduling:
                          </label>
                          <textarea
                            rows="3"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="e.g. We have reviewed your kitchen's daily gas requirement. We recommend our modular 5 m³ FRP digester with scrubber unit. Our technical engineer can visit your premises this Thursday at 11:00 AM for site inspection."
                            className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {replySuccess ? (
                            <span className="text-xs font-medium text-forest-800 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Proposal successfully transmitted!
                            </span>
                          ) : <span />}
                          <button
                            type="button"
                            disabled={loading || !replyText.trim()}
                            onClick={handleSendReply}
                            className="bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Send size={12} />
                            <span>{loading ? 'Sending Proposal...' : 'Send Installation Proposal'}</span>
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
      ) : (
        /* ======================================================== */
        /* TAB 2: INSTALLATION SPECIFICATIONS & LISTING PROFILE     */
        /* ======================================================== */
        <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Plant Supplier & Installation Profile
              </h2>
              <p className="text-xs text-zinc-500">
                Update your turnkey plant models, installation territories, warranty coverage, and contact points.
              </p>
            </div>
            {savedNotification && (
              <span className="self-start sm:self-auto text-xs font-medium text-forest-900 bg-forest-50 border border-forest-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-forest-900" /> Specifications updated
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Installer / Company Name:</label>
              <input
                type="text"
                value={profileData.organisation}
                onChange={(e) => setProfileData({ ...profileData, organisation: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Installation Capacity Range:</label>
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
                <span className="text-zinc-500 text-xs shrink-0">m³ gas / day</span>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Turnkey Plant Models Supplied:</label>
              <input
                type="text"
                value={profileData.plantModels}
                onChange={(e) => setProfileData({ ...profileData, plantModels: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                placeholder="e.g. Modular FRP Floating Drum, Precast Fixed Dome, Containerized Units"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Service & Installation Coverage Areas:</label>
              <input
                type="text"
                value={profileData.serviceArea}
                onChange={(e) => setProfileData({ ...profileData, serviceArea: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                placeholder="e.g. Bengaluru, Pune, Mumbai, Coimbatore, Delhi-NCR"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Supported Waste Feedstock Types:</label>
              <input
                type="text"
                value={profileData.supportedFeedstock}
                onChange={(e) => setProfileData({ ...profileData, supportedFeedstock: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                placeholder="e.g. Kitchen food scraps, Canteen leftovers, Market vegetable trimmings"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Standard Warranty Terms:</label>
              <input
                type="text"
                value={profileData.warranty}
                onChange={(e) => setProfileData({ ...profileData, warranty: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-zinc-700 block">Operations & Maintenance (O&M) Offering:</label>
              <input
                type="text"
                value={profileData.omOffering}
                onChange={(e) => setProfileData({ ...profileData, omOffering: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Contact Phone Number:</label>
              <input
                type="text"
                value={profileData.contactPhone}
                onChange={(e) => setProfileData({ ...profileData, contactPhone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 block">Contact Email Address:</label>
              <input
                type="email"
                value={profileData.contactEmail}
                onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 py-2 px-3 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              ← View Setup Inquiries
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {loading ? 'Saving...' : 'Save Installation Specifications'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PlantOnboarding;
