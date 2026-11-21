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
import { tabContentVariants, motionTokens, buttonTapMotion } from '../../utils/motion';

export function PlantDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'inbox';
  const shouldReduceMotion = useReducedMotion();

  const [plantData, setPlantData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* ======================================================== */}
        {/* Tab 1: Requests Inbox (Client Proposals & Feedstock)     */}
        {/* ======================================================== */}
        {activeTab === 'inbox' && (
          <motion.div
            key="inbox"
            variants={shouldReduceMotion ? undefined : tabContentVariants}
            initial={shouldReduceMotion ? false : 'initial'}
            animate={shouldReduceMotion ? false : 'animate'}
            exit={shouldReduceMotion ? false : 'exit'}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Mail size={18} className="text-teal-600 dark:text-teal-400 stroke-[2]" />
                    Incoming Project & Waste Requests
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Review specifications from local kitchens, businesses, and consumers requesting digester proposals or feedstock drop-off.
                  </p>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 self-start sm:self-auto">
                  {enquiries.length} requests in inbox
                </span>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <p>No new requests currently pending for {activeProfile.name}.</p>
                  <p className="text-zinc-400 dark:text-zinc-500">
                    Switch to a Waste Provider or Consumer profile to submit an enquiry, and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 rounded-2xl bg-zinc-50/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
                            Request from: {enq.fromName || enq.fromProfile}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">Reference: {enq.id}</span>
                        </div>
                        <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                      </div>

                      {/* Summary Details */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Waste / Use:</span>
                          <strong className="text-zinc-800 dark:text-zinc-200">{enq.summary?.wasteType || enq.summary?.intendedUse || 'Biogas project'}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Estimated Output / Scale:</span>
                          <strong className="text-zinc-800 dark:text-zinc-200">{enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'Assessment required'}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Contact Preference:</span>
                          <span className="capitalize font-medium text-zinc-800 dark:text-zinc-200">{enq.contactPreference || 'Email'}</span>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-1">
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Client Questions / Site Constraints:</span>
                        <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                          "{enq.questions}"
                        </p>
                      </div>

                      {/* Existing Replies */}
                      {enq.replies && enq.replies.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          <span className="font-bold text-teal-700 dark:text-teal-400 block text-[11px]">
                            Your Sent Proposals & Responses:
                          </span>
                          {enq.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-teal-950 dark:text-teal-100 space-y-1"
                            >
                              <div className="flex items-center justify-between text-[10px] text-teal-700 dark:text-teal-400 font-semibold">
                                <span>Sent by {reply.authorName || activeProfile.name}</span>
                                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply / Proposal Composer */}
                      {activeReplyEnquiryId === enq.id ? (
                        <div className="space-y-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-xs">
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
                                className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-teal-500 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
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
                                className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-teal-500 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
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
                                className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-teal-500 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                              >
                                + Confirm Winter Thermal Insulation
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyText((prev) =>
                                    prev
                                      ? `${prev} Please confirm if a 3.5-tonne delivery van can access the staging area directly.`
                                      : 'What is the minimum gate width and turning radius for our maintenance and delivery vehicle at the site boundary?'
                                  )
                                }
                                className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-teal-500 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
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
                            className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                          />

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => handleSendReply(enq.id)}
                              disabled={replyLoading || !replyText.trim()}
                              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
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
                              className="text-xs px-3 py-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 flex justify-end">
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
                            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
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
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* Tab 2: Evidence Manager (Upload/Manage Verified Evidence) */}
        {/* ======================================================== */}
        {activeTab === 'evidence' && (
          <motion.div
            key="evidence"
            variants={shouldReduceMotion ? undefined : tabContentVariants}
            initial={shouldReduceMotion ? false : 'initial'}
            animate={shouldReduceMotion ? false : 'animate'}
            exit={shouldReduceMotion ? false : 'exit'}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-teal-600 dark:text-teal-400 stroke-[2]" />
                    Independent Engineering Credentials & Evidence
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Manage simulated third-party commissioning certificates, customer references, and operating installation examples.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowAddEvidence(true)}
                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.2]" />
                  <span>Add New Evidence Credential</span>
                </motion.button>
              </div>

              {/* Live Evidence Counts */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    Verified Documents
                  </span>
                  <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                    {evidenceList.filter((e) => e.status === 'verified').length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                    Pending Verification
                  </span>
                  <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 font-mono mt-0.5 block">
                    {evidenceList.filter((e) => e.status === 'pending').length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                    Total Managed Items
                  </span>
                  <span className="text-xl font-extrabold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">
                    {evidenceList.length}
                  </span>
                </div>
              </div>

              {/* Evidence Items List */}
              <div className="space-y-3">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize text-sm">{ev.title || ev.type}</span>
                        <StatusBadge status={ev.status} size="sm" />
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{ev.details}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                        <span>Source: {ev.source}</span>
                        <span>Category: {ev.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvidence(ev.id)}
                      className="self-end sm:self-center p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove evidence"
                      aria-label={`Remove evidence ${ev.title}`}
                    >
                      <Trash2 size={15} className="stroke-[2]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* Tab 3: Plant Specs & Live Completeness                   */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            variants={shouldReduceMotion ? undefined : tabContentVariants}
            initial={shouldReduceMotion ? false : 'initial'}
            animate={shouldReduceMotion ? false : 'animate'}
            exit={shouldReduceMotion ? false : 'exit'}
            className="space-y-6"
          >
            {/* Completeness & Consumer Transparency Banner */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Factory size={18} className="text-teal-600 dark:text-teal-400 stroke-[2]" />
                    Engineering Specifications & Profile Completeness
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    How your technical capabilities and commercial terms appear to waste providers and consumers in side-by-side comparisons.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Profile Completeness: {completeness.score}%
                  </span>
                </div>
              </div>

              {/* Completeness Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? false : { width: 0 }}
                    animate={{ width: `${completeness.score}%` }}
                    transition={{ duration: 0.5, ease: motionTokens.ease.out }}
                    className="h-full bg-teal-500 rounded-full"
                  />
                </div>

                {completeness.missing.length > 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold block flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-amber-600 dark:text-amber-400 stroke-[2]" />
                      Missing or unverified items ({completeness.missing.length}):
                    </span>
                    <p className="leading-relaxed">
                      Consumers will see the <strong>"Not provided / Not verified"</strong> badge for: {completeness.missing.join(', ')}. Complete the form below to upgrade your verification rating.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.2]" />
                    <span>All engineering specifications and evidence thresholds met. Full transparency achieved.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Plant Profile Form */}
            {profileForm && (
              <form
                onSubmit={handleSaveProfile}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 text-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Edit Provider Specifications
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Save updates to immediately reflect across all matching and comparison views.
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <span className="text-xs font-semibold px-3 py-1 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <Check size={13} className="stroke-[2.2]" />
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Organisation Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.organisation}
                      onChange={(e) => setProfileForm({ ...profileForm, organisation: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Scale Classification</label>
                    <select
                      value={profileForm.scale}
                      onChange={(e) => setProfileForm({ ...profileForm, scale: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="small">Small (Micro-Digester: 10–250 kg/day)</option>
                      <option value="medium">Medium (Turnkey: 50–1,000 kg/day)</option>
                      <option value="large">Large (Centralized: 500–10,000+ kg/day)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Daily Capacity Min</label>
                    <input
                      type="number"
                      min="1"
                      value={profileForm.capacityMin}
                      onChange={(e) => setProfileForm({ ...profileForm, capacityMin: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Daily Capacity Max</label>
                    <input
                      type="number"
                      min="1"
                      value={profileForm.capacityMax}
                      onChange={(e) => setProfileForm({ ...profileForm, capacityMax: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Service Area (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileForm.serviceArea}
                      onChange={(e) => setProfileForm({ ...profileForm, serviceArea: e.target.value })}
                      placeholder="e.g. Bristol, Bath & North East Somerset, South Gloucestershire"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Supported Feedstocks (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileForm.supportedFeedstock}
                      onChange={(e) => setProfileForm({ ...profileForm, supportedFeedstock: e.target.value })}
                      placeholder="e.g. Commercial food waste, Kitchen scraps, Brewery grain"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Stated O&M Agreement (Commercial Claim)</label>
                    <textarea
                      rows={2}
                      value={profileForm.omOffering}
                      onChange={(e) => setProfileForm({ ...profileForm, omOffering: e.target.value })}
                      placeholder="Describe your maintenance coverage, response SLAs, and routine desludging terms."
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Warranty Coverage</label>
                    <input
                      type="text"
                      value={profileForm.warranty}
                      onChange={(e) => setProfileForm({ ...profileForm, warranty: e.target.value })}
                      placeholder="e.g. 5-year reactor vessel, 2-year pumps and electronics"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Winter Continuity / Risk Assessment</label>
                    <input
                      type="text"
                      value={profileForm.continuityRisk}
                      onChange={(e) => setProfileForm({ ...profileForm, continuityRisk: e.target.value })}
                      placeholder="e.g. Insulated heated jacket included; optional LPG auxiliary burner"
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={profileSaving}
                    className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Save size={14} className="stroke-[2]" />
                    <span>{profileSaving ? 'Saving Changes...' : 'Save Specifications'}</span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Add New Evidence Credential */}
      <Modal
        isOpen={showAddEvidence}
        onClose={() => setShowAddEvidence(false)}
        title="Upload / Register Engineering Credential"
        subtitle="Simulated Demo Vault · Third-party verified documentation"
      >
        <form onSubmit={handleAddEvidence} className="space-y-4 text-xs">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Evidence Type</label>
              <select
                value={newEvidence.type}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="commissioning">Commissioning Certificate (Sign-off)</option>
                <option value="reference">Customer Reference (Operating site)</option>
                <option value="projectExample">Demonstrated Project Example (Case Study)</option>
                <option value="safety_audit">Gas & Electrical Safety Inspection</option>
                <option value="environmental_permit">Environmental Agency Exemption / Permit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Credential Title</label>
              <input
                type="text"
                required
                placeholder="e.g. OFGEM RHI Emissions Compliance Audit"
                value={newEvidence.title}
                onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Source Authority / Auditor</label>
              <input
                type="text"
                required
                placeholder="e.g. Bureau Veritas UK / ADBA Scheme"
                value={newEvidence.source}
                onChange={(e) => setNewEvidence({ ...newEvidence, source: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Verification Status</label>
              <select
                value={newEvidence.status}
                onChange={(e) => setNewEvidence({ ...newEvidence, status: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="verified">Verified (Audited & Active)</option>
                <option value="pending">Pending (Submitted for Review)</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-zinc-600 dark:text-zinc-400 font-semibold block">Scope & Audit Summary</label>
              <textarea
                rows={2}
                placeholder="e.g. 52-week continuous gas quality telemetry verified with 99.1% uptime."
                value={newEvidence.details}
                onChange={(e) => setNewEvidence({ ...newEvidence, details: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddEvidence(false)}
              className="text-xs px-3.5 py-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={evidenceSubmitting}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Check size={13} className="stroke-[2.2]" />
              <span>{evidenceSubmitting ? 'Registering...' : 'Register Credential'}</span>
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PlantDashboard;