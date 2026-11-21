import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Factory,
  Mail,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
  Check,
  Send,
  Eye,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { Modal } from '../../components/ui/Modal';
import { ProviderDetailModal } from '../../components/ProviderDetailModal';

export function PlantDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'inbox';
  const shouldReduceMotion = useReducedMotion();

  const [plantData, setPlantData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Public Preview Modal State
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  // Inbox Status Filter
  const [inboxStatusFilter, setInboxStatusFilter] = useState('all');

  // Quick Reply State
  const [activeReplyEnquiryId, setActiveReplyEnquiryId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Add Evidence Modal State
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newEvidence, setNewEvidence] = useState({
    type: 'commissioning',
    title: '',
    source: '',
    status: 'verified',
    details: '',
  });
  const [evidenceSubmitting, setEvidenceSubmitting] = useState(false);

  // Editable Profile Form State
  const [profileForm, setProfileForm] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const loadPlantData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/plants/${activeProfile.id}`).catch(() => ({ data: null })),
      api.get(`/enquiries?toPlantId=${activeProfile.id}`).catch(() => ({ data: [] })),
      api.get(`/evidence?plantId=${activeProfile.id}`).catch(() => ({ data: [] })),
    ])
      .then(([plantRes, enqRes, evRes]) => {
        const p = plantRes?.data || null;
        setPlantData(p);
        setEnquiries(enqRes?.data || []);
        setEvidenceList(evRes?.data || []);
        if (p) {
          setProfileForm({
            organisation: p.organisation || '',
            scale: p.scale || 'medium',
            capacityMin: p.capacityMin || 0,
            capacityMax: p.capacityMax || 0,
            capacityUnit: p.capacityUnit || 'kg/day',
            serviceArea: p.serviceArea ? p.serviceArea.join(', ') : '',
            supportedFeedstock: p.supportedFeedstock ? p.supportedFeedstock.join(', ') : '',
            omOffering: p.omOffering || '',
            warranty: p.warranty || '',
            continuityRisk: p.continuityRisk || '',
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlantData();
  }, [activeProfile.id]);

  const handleSendReply = (enquiryId) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);

    api.post(`/enquiries/${enquiryId}/reply`, {
      message: replyText,
      authorName: activeProfile.name,
    })
      .then(() => {
        setReplyText('');
        setActiveReplyEnquiryId(null);
        loadPlantData();
      })
      .finally(() => setReplyLoading(false));
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/status`, { status: newStatus });
      loadPlantData();
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  // Add new simulated evidence
  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!newEvidence.title.trim()) return;
    setEvidenceSubmitting(true);

    try {
      await api.post('/evidence', {
        plantId: activeProfile.id,
        ...newEvidence,
      });
      setNewEvidence({
        type: 'commissioning',
        title: '',
        source: '',
        status: 'verified',
        details: '',
      });
      setShowAddEvidence(false);
      loadPlantData();
    } catch (err) {
      console.error('Failed to add evidence:', err);
    } finally {
      setEvidenceSubmitting(false);
    }
  };

  // Delete evidence credential
  const handleDeleteEvidence = async (id) => {
    try {
      await api.delete(`/evidence/${id}`);
      loadPlantData();
    } catch (err) {
      console.error('Failed to delete evidence:', err);
    }
  };

  // Save editable profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setSaveSuccessMsg('');

    try {
      const payload = {
        ...profileForm,
        capacityMin: Number(profileForm.capacityMin),
        capacityMax: Number(profileForm.capacityMax),
        serviceArea: profileForm.serviceArea.split(',').map((s) => s.trim()).filter(Boolean),
        supportedFeedstock: profileForm.supportedFeedstock.split(',').map((s) => s.trim()).filter(Boolean),
      };

      await api.put(`/plants/${activeProfile.id}`, payload);
      setSaveSuccessMsg('Plant specifications and verification status updated successfully.');
      loadPlantData();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update plant profile:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Dynamic Completeness Score Calculation
  const calculateCompleteness = () => {
    if (!plantData) return { score: 0, missing: [] };
    const missing = [];
    let points = 0;
    const maxPoints = 7;

    if (plantData.organisation) points += 1;
    else missing.push('Organisation Name');

    if (plantData.capacityMin && plantData.capacityMax) points += 1;
    else missing.push('Capacity Range');

    if (plantData.serviceArea && plantData.serviceArea.length > 0) points += 1;
    else missing.push('Service Area');

    if (plantData.supportedFeedstock && plantData.supportedFeedstock.length > 0) points += 1;
    else missing.push('Supported Feedstocks');

    if (plantData.omOffering && !plantData.omOffering.toLowerCase().includes('not provided')) points += 1;
    else missing.push('Operation & Maintenance SLA');

    if (plantData.warranty && !plantData.warranty.toLowerCase().includes('not provided')) points += 1;
    else missing.push('Warranty Terms');

    const verifiedEv = evidenceList.filter((e) => e.status === 'verified');
    if (verifiedEv.length >= 2) points += 1;
    else missing.push('At least 2 verified evidence documents');

    return {
      score: Math.round((points / maxPoints) * 100),
      missing,
    };
  };

  const completeness = calculateCompleteness();

  const filteredEnquiries = enquiries.filter((enq) => {
    if (inboxStatusFilter === 'all') return true;
    if (inboxStatusFilter === 'pending') return enq.status === 'pending' || enq.status === 'pending_review';
    if (inboxStatusFilter === 'answered') return enq.status === 'answered' || enq.status === 'contacted';
    if (inboxStatusFilter === 'closed') return enq.status === 'closed';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* ======================================================== */}
      {/* SCREEN 1: Provider Dashboard Overview Card               */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-800 font-mono uppercase tracking-wider">
                Plant Provider Portal
              </span>
              <StatusBadge status="verified" size="sm" label="Operating Provider" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Welcome back, {activeProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {plantData?.serviceArea?.join(', ') || 'Western India'} · Capability showcase, verified document registry, and inbound request management.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowPublicPreview(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 shadow-subtle transition-colors cursor-pointer"
            >
              <Eye size={14} className="stroke-[2]" />
              <span>Preview Public Profile</span>
            </motion.button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators with Completeness Meter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <span>Profile Completeness</span>
              <span className="text-teal-800 font-mono">{completeness.score}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-300"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-500 block pt-0.5">
              {completeness.missing.length === 0 ? 'All criteria met' : `${completeness.missing.length} item(s) to verify`}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Total Inbound Requests
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              {enquiries.length} Requests
            </span>
            <span className="text-[11px] text-zinc-500">From generators & consumers</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Pending Action
            </span>
            <span className="text-lg font-bold text-amber-800 font-mono block">
              {enquiries.filter((e) => e.status !== 'answered' && e.status !== 'closed').length} Pending
            </span>
            <span className="text-[11px] text-zinc-500">Awaiting technical review</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Verified Documents
            </span>
            <span className="text-lg font-bold text-forest-900 font-mono block">
              {evidenceList.filter((e) => e.status === 'verified').length} / {evidenceList.length}
            </span>
            <span className="text-[11px] text-zinc-500">Audited credentials on file</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ======================================================== */}
        {/* Tab 1: Requests Inbox (Client Proposals & Feedstock)     */}
        {/* ======================================================== */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Mail size={18} className="text-teal-700 stroke-[2]" />
                    Incoming Project & Waste Requests
                  </h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Review specifications from local kitchens, businesses, and consumers requesting digester proposals or feedstock drop-off.
                  </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['all', 'pending', 'answered', 'closed'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setInboxStatusFilter(filter)}
                      className={`capitalize text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                        inboxStatusFilter === filter
                          ? 'bg-teal-700 text-white border-teal-600 shadow-subtle'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs text-zinc-500">
                  <p>No enquiries found matching filter "{inboxStatusFilter}".</p>
                  <p className="text-zinc-400">
                    Switch to another role to submit a simulated enquiry, and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 rounded-2xl bg-zinc-50/60 border border-zinc-200 shadow-subtle space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                        <div>
                          <span className="font-bold text-zinc-900 text-sm block">
                            Request from: {enq.fromName || enq.fromProfile}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">Reference: {enq.id}</span>
                        </div>
                        <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                      </div>

                      {/* Summary Details */}
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 grid sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Waste / Use:</span>
                          <strong className="text-zinc-800">{enq.summary?.wasteType || enq.summary?.intendedUse || 'Biogas project'}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Estimated Output / Scale:</span>
                          <strong className="text-zinc-800">{enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'Assessment required'}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Contact Preference:</span>
                          <span className="capitalize font-medium text-zinc-800">{enq.contactPreference || 'Email'}</span>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-1">
                        <span className="text-zinc-500 block text-[11px]">Client Questions / Site Constraints:</span>
                        <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium leading-relaxed">
                          "{enq.questions}"
                        </p>
                      </div>

                      {/* Existing Replies */}
                      {enq.replies && enq.replies.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-zinc-200">
                          <span className="font-bold text-teal-800 block text-[11px]">
                            Your Sent Proposals & Responses:
                          </span>
                          {enq.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1"
                            >
                              <div className="flex items-center justify-between text-[10px] text-teal-800 font-semibold">
                                <span>Sent by {reply.authorName || activeProfile.name}</span>
                                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs leading-relaxed text-zinc-800">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply / Proposal Composer */}
                      {activeReplyEnquiryId === enq.id ? (
                        <div className="space-y-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-subtle">
                          <span className="font-bold text-zinc-800 block text-xs">
                            Compose Fast Proposal / Site Visit Response:
                          </span>

                          {/* Suggested Follow-up Question Chips */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Suggested question chips:</span>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyText(
                                    `Thank you for sharing your project specifications. Based on your indicative demand of ${
                                      enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'the site'
                                    }, our turnkey system can accommodate this setup. We would like to schedule a preliminary site visit to assess gas piping routing and outdoor foundation access.`
                                  )
                                }
                                className="px-2 py-1 rounded bg-zinc-100 border border-zinc-300 hover:border-teal-500 text-zinc-700 transition-colors cursor-pointer"
                              >
                                Standard Site Visit Proposal
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyText((prev) =>
                                    prev
                                      ? `${prev} Could you also clarify if your kitchen oil/grease traps are separated prior to bin staging?`
                                      : 'Could you please clarify if your commercial kitchen separates fats, oils, and grease (FOG) prior to the organic waste collection bins?'
                                  )
                                }
                                className="px-2 py-1 rounded bg-zinc-100 border border-zinc-300 hover:border-teal-500 text-zinc-700 transition-colors cursor-pointer"
                              >
                                + Ask about FOG / Oil Separation
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyText((prev) =>
                                    prev
                                      ? `${prev} Also note that our system includes thermal jacket insulation to prevent winter output drops.`
                                      : 'To address winter supply continuity: our system includes an automated heating coil maintaining 37°C mesophilic conditions even during sub-zero cold snaps.'
                                  )
                                }
                                className="px-2 py-1 rounded bg-zinc-100 border border-zinc-300 hover:border-teal-500 text-zinc-700 transition-colors cursor-pointer"
                              >
                                + Confirm Winter Thermal Insulation
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyText((prev) =>
                                    prev
                                      ? `${prev} Please confirm if a 3.5-tonne delivery vehicle can access the staging area directly.`
                                      : 'What is the minimum gate width and turning radius for our maintenance and delivery vehicle at the site boundary?'
                                  )
                                }
                                className="px-2 py-1 rounded bg-zinc-100 border border-zinc-300 hover:border-teal-500 text-zinc-700 transition-colors cursor-pointer"
                              >
                                + Verify Vehicle Access Radius
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response to this enquiry..."
                            className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400"
                          />

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => handleSendReply(enq.id)}
                              disabled={replyLoading || !replyText.trim()}
                              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              <Send size={12} className="stroke-[2]" />
                              <span>{replyLoading ? 'Sending...' : 'Send Simulated Proposal'}</span>
                            </motion.button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyEnquiryId(null);
                                setReplyText('');
                              }}
                              className="text-xs px-3 py-2 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100">
                          {/* Quick Status Toggle Actions */}
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-zinc-400 font-semibold mr-1">Status:</span>
                            {enq.status !== 'contacted' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'contacted')}
                                className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {enq.status !== 'closed' ? (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'closed')}
                                className="px-2 py-1 rounded bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-700 border border-zinc-200 hover:border-rose-300 transition-colors cursor-pointer"
                              >
                                Mark Closed
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'pending')}
                                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors cursor-pointer"
                              >
                                Re-open Request
                              </button>
                            )}
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                              setActiveReplyEnquiryId(enq.id);
                              setReplyText(
                                `Thank you for sharing your project specifications. Based on your indicative demand of ${
                                  enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'the site'
                                }, our turnkey system can accommodate this setup. We would like to schedule a preliminary site visit to assess gas piping routing and outdoor foundation access.`
                              );
                            }}
                            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-subtle"
                          >
                            <Send size={12} className="stroke-[2]" />
                            <span>Respond / Send Proposal</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Tab 2: Evidence Manager (Upload/Manage Verified Evidence) */}
        {/* ======================================================== */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-teal-700 stroke-[2]" />
                    Independent Engineering Credentials & Evidence
                  </h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Manage third-party commissioning certificates, customer references, and operating installation case studies.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowAddEvidence(true)}
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-subtle cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.2]" />
                  <span>Add New Evidence Credential</span>
                </motion.button>
              </div>

              {/* Live Evidence Counts */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 block">
                    Verified Documents
                  </span>
                  <span className="text-xl font-extrabold text-forest-900 font-mono mt-0.5 block">
                    {evidenceList.filter((e) => e.status === 'verified').length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    Pending Verification
                  </span>
                  <span className="text-xl font-extrabold text-amber-800 font-mono mt-0.5 block">
                    {evidenceList.filter((e) => e.status === 'pending').length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Total Managed Items
                  </span>
                  <span className="text-xl font-extrabold text-zinc-800 font-mono mt-0.5 block">
                    {evidenceList.length}
                  </span>
                </div>
              </div>

              {/* Evidence Items List */}
              <div className="space-y-3">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 capitalize text-sm">{ev.title || ev.type}</span>
                        <StatusBadge status={ev.status} size="sm" />
                      </div>
                      <p className="text-zinc-600 text-xs leading-relaxed">{ev.details}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono">
                        <span>Source: {ev.source}</span>
                        <span>Category: {ev.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvidence(ev.id)}
                      className="self-end sm:self-center p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove evidence"
                      aria-label={`Remove evidence ${ev.title}`}
                    >
                      <Trash2 size={15} className="stroke-[2]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Tab 3: Plant Specs & Live Completeness                   */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Completeness Banner */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <Factory size={18} className="text-teal-700 stroke-[2]" />
                    Engineering Specifications & Profile Completeness
                  </h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    How your technical capabilities and commercial terms appear to waste generators and consumers in side-by-side comparisons.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
                    Profile Completeness: {completeness.score}%
                  </span>
                </div>
              </div>

              {/* Completeness Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${completeness.score}%` }}
                  />
                </div>

                {completeness.missing.length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <span className="font-bold block flex items-center gap-1.5 text-amber-900">
                      <AlertCircle size={14} className="text-amber-700 stroke-[2]" />
                      Missing or unverified items ({completeness.missing.length}):
                    </span>
                    <p className="leading-relaxed">
                      Consumers will see the <strong>"Not provided / Not verified"</strong> badge for: {completeness.missing.join(', ')}. Complete the form below to upgrade your verification rating.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-950 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-forest-800 shrink-0 stroke-[2.2]" />
                    <span>All engineering specifications and evidence thresholds met. Full transparency achieved.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Plant Profile Form */}
            {profileForm && (
              <form
                onSubmit={handleSaveProfile}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6 text-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Edit Provider Specifications
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Save updates to immediately reflect across all matching and comparison views.
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <span className="text-xs font-semibold px-3 py-1 rounded bg-forest-50 text-forest-900 border border-forest-200 flex items-center gap-1.5">
                      <Check size={13} className="stroke-[2.2]" />
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Organisation Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.organisation}
                      onChange={(e) => setProfileForm({ ...profileForm, organisation: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Scale Classification</label>
                    <select
                      value={profileForm.scale}
                      onChange={(e) => setProfileForm({ ...profileForm, scale: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="small">Small (Micro-Digester: 10–250 kg/day)</option>
                      <option value="medium">Medium (Turnkey: 50–1,000 kg/day)</option>
                      <option value="large">Large (Centralized / SATAT: 500–10,000+ kg/day)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Daily Capacity Min</label>
                    <input
                      type="number"
                      min="1"
                      value={profileForm.capacityMin}
                      onChange={(e) => setProfileForm({ ...profileForm, capacityMin: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Daily Capacity Max</label>
                    <input
                      type="number"
                      min="1"
                      value={profileForm.capacityMax}
                      onChange={(e) => setProfileForm({ ...profileForm, capacityMax: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 font-semibold block">Service Area (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileForm.serviceArea}
                      onChange={(e) => setProfileForm({ ...profileForm, serviceArea: e.target.value })}
                      placeholder="e.g. Bengaluru, Vadodara, Pune, Ahmedabad"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 font-semibold block">Supported Feedstocks (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileForm.supportedFeedstock}
                      onChange={(e) => setProfileForm({ ...profileForm, supportedFeedstock: e.target.value })}
                      placeholder="e.g. Commercial food waste, Kitchen scraps, Mandi discards"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 font-semibold block">Stated O&M Agreement (Commercial Claim)</label>
                    <textarea
                      rows={2}
                      value={profileForm.omOffering}
                      onChange={(e) => setProfileForm({ ...profileForm, omOffering: e.target.value })}
                      placeholder="Describe your maintenance coverage, response SLAs, and routine biological testing terms."
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Warranty Coverage</label>
                    <input
                      type="text"
                      value={profileForm.warranty}
                      onChange={(e) => setProfileForm({ ...profileForm, warranty: e.target.value })}
                      placeholder="e.g. 5-year reactor vessel, 2-year electro-mechanical warranty"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 font-semibold block">Winter Continuity / Risk Assessment</label>
                    <input
                      type="text"
                      value={profileForm.continuityRisk}
                      onChange={(e) => setProfileForm({ ...profileForm, continuityRisk: e.target.value })}
                      placeholder="e.g. Insulated heated jacket included; auxiliary heating coil"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-subtle transition-colors cursor-pointer"
                  >
                    <Save size={14} className="stroke-[2]" />
                    <span>{profileSaving ? 'Saving Changes...' : 'Save Specifications'}</span>
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add New Evidence Credential */}
      <Modal
        isOpen={showAddEvidence}
        onClose={() => setShowAddEvidence(false)}
        title="Upload / Register Engineering Credential"
        subtitle="Simulated Demo Vault · Third-party verified documentation"
      >
        <form onSubmit={handleAddEvidence} className="space-y-4 text-xs font-sans">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600 font-semibold block">Evidence Type</label>
              <select
                value={newEvidence.type}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-teal-500"
              >
                <option value="commissioning">Commissioning Certificate (Sign-off)</option>
                <option value="reference">Customer Reference (Operating site)</option>
                <option value="projectExample">Demonstrated Project Example (Case Study)</option>
                <option value="safety_audit">Gas & Electrical Safety Inspection (PESO)</option>
                <option value="environmental_permit">Pollution Control Board Consent (CTO/CTE)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-semibold block">Credential Title</label>
              <input
                type="text"
                required
                placeholder="e.g. PESO Gas Safety & Pressure Test Sign-off"
                value={newEvidence.title}
                onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-semibold block">Source Authority / Auditor</label>
              <input
                type="text"
                required
                placeholder="e.g. Petroleum and Explosives Safety Organisation (PESO)"
                value={newEvidence.source}
                onChange={(e) => setNewEvidence({ ...newEvidence, source: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-semibold block">Verification Status</label>
              <select
                value={newEvidence.status}
                onChange={(e) => setNewEvidence({ ...newEvidence, status: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-teal-500"
              >
                <option value="verified">Verified (Audited & Active)</option>
                <option value="pending">Pending (Submitted for Review)</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-zinc-600 font-semibold block">Scope & Audit Summary</label>
              <textarea
                rows={2}
                placeholder="e.g. 52-week continuous gas quality telemetry verified with 99.1% uptime."
                value={newEvidence.details}
                onChange={(e) => setNewEvidence({ ...newEvidence, details: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setShowAddEvidence(false)}
              className="text-xs px-3.5 py-2 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={evidenceSubmitting}
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-subtle"
            >
              <Check size={13} className="stroke-[2.2]" />
              <span>{evidenceSubmitting ? 'Registering...' : 'Register Credential'}</span>
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Screen 5: Public Provider Profile Preview */}
      <ProviderDetailModal
        isOpen={showPublicPreview}
        onClose={() => setShowPublicPreview(false)}
        plant={plantData}
        enquiryButtonLabel="Simulated Public Offtake Action"
      />
    </div>
  );
}

export default PlantDashboard;
