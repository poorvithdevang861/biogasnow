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

  const handleDeleteEvidence = async (id) => {
    try {
      await api.delete(`/evidence/${id}`);
      loadPlantData();
    } catch (err) {
      console.error('Failed to delete evidence:', err);
    }
  };

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
      setSaveSuccessMsg('Plant specifications and verification status updated.');
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
    else missing.push('Organisation name');

    if (plantData.capacityMin && plantData.capacityMax) points += 1;
    else missing.push('Capacity range');

    if (plantData.serviceArea && plantData.serviceArea.length > 0) points += 1;
    else missing.push('Service area');

    if (plantData.supportedFeedstock && plantData.supportedFeedstock.length > 0) points += 1;
    else missing.push('Supported feedstocks');

    if (plantData.omOffering && !plantData.omOffering.toLowerCase().includes('not provided')) points += 1;
    else missing.push('Operation & maintenance terms');

    if (plantData.warranty && !plantData.warranty.toLowerCase().includes('not provided')) points += 1;
    else missing.push('Warranty terms');

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
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-forest-900">
                Plant provider portal
              </span>
              <StatusBadge status="verified" size="sm" label="Operating provider" />
            </div>
            <h1 className="text-xl sm:text-2xl font-medium text-zinc-900">
              Plant provider operations hub
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Capability showcase, compliance evidence registry, and inbound request management.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowPublicPreview(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
            >
              <Eye size={14} className="stroke-[1.5]" />
              <span>Preview public profile</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <div className="flex justify-between items-center text-[11px] text-zinc-500">
              <span>Profile completeness</span>
              <span className="font-medium text-zinc-900 tabular-nums">{completeness.score}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-900 rounded-full transition-all duration-300"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-500 block pt-0.5">
              {completeness.missing.length === 0 ? 'All criteria verified' : `${completeness.missing.length} item(s) pending`}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Inbound requests
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {enquiries.length} requests
            </span>
            <span className="text-[11px] text-zinc-500">From generators & consumers</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Pending action
            </span>
            <span className="text-lg font-medium text-forest-900 block tabular-nums">
              {enquiries.filter((e) => e.status !== 'answered' && e.status !== 'closed').length} pending
            </span>
            <span className="text-[11px] text-zinc-500">Awaiting technical review</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Verified documents
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {evidenceList.filter((e) => e.status === 'verified').length} / {evidenceList.length}
            </span>
            <span className="text-[11px] text-zinc-500">Audited credentials on file</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Requests Inbox */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                    <Mail size={16} className="text-forest-900 stroke-[1.5]" />
                    Incoming project & waste requests
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Review specifications from kitchens, businesses, and consumers requesting proposals or collection.
                  </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['all', 'pending', 'answered', 'closed'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setInboxStatusFilter(filter)}
                      className={`capitalize text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        inboxStatusFilter === filter
                          ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1 text-xs text-zinc-500">
                  <p>No enquiries found matching filter "{inboxStatusFilter}".</p>
                  <p className="text-zinc-400">
                    Switch to another role to submit a simulated enquiry, and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                        <div>
                          <span className="font-medium text-zinc-900 text-sm block">
                            Request from: {enq.fromName || enq.fromProfile}
                          </span>
                          <span className="text-[11px] text-zinc-400">Reference: {enq.id}</span>
                        </div>
                        <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                      </div>

                      {/* Summary Details */}
                      <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 grid sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Waste / intended use:</span>
                          <span className="text-zinc-800 font-medium">{enq.summary?.wasteType || enq.summary?.intendedUse || 'Biogas project'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Output / scale:</span>
                          <span className="text-zinc-800 font-medium">{enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'Assessment required'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Contact preference:</span>
                          <span className="capitalize text-zinc-800 font-medium">{enq.contactPreference || 'Email'}</span>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-0.5">
                        <span className="text-zinc-500 block text-[11px]">Client questions / site constraints:</span>
                        <p className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-zinc-800 leading-relaxed text-xs">
                          "{enq.questions}"
                        </p>
                      </div>

                      {/* Existing Replies */}
                      {enq.replies && enq.replies.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                          <span className="font-medium text-forest-900 block text-[11px]">
                            Sent proposals & responses:
                          </span>
                          {enq.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 space-y-0.5"
                            >
                              <div className="flex items-center justify-between text-[10px] text-zinc-500">
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
                        <div className="space-y-2.5 p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                          <span className="font-medium text-zinc-800 block text-xs">
                            Compose proposal response:
                          </span>

                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response to this enquiry..."
                            className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-forest-900 bg-white text-zinc-900 placeholder:text-zinc-400"
                          />

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendReply(enq.id)}
                              disabled={replyLoading || !replyText.trim()}
                              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <Send size={12} className="stroke-[1.5]" />
                              <span>{replyLoading ? 'Sending...' : 'Send proposal'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyEnquiryId(null);
                                setReplyText('');
                              }}
                              className="text-xs px-2.5 py-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-zinc-400 mr-1">Status:</span>
                            {enq.status !== 'contacted' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'contacted')}
                                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                              >
                                Mark contacted
                              </button>
                            )}
                            {enq.status !== 'closed' ? (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'closed')}
                                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                              >
                                Mark closed
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(enq.id, 'pending')}
                                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors cursor-pointer"
                              >
                                Re-open
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyEnquiryId(enq.id);
                              setReplyText(
                                `Thank you for sharing your project specifications. Based on your indicative demand of ${
                                  enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'the site'
                                }, our turnkey system can accommodate this setup. We would like to schedule a preliminary site survey.`
                              );
                            }}
                            className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Send size={12} className="stroke-[1.5]" />
                            <span>Respond to enquiry</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Evidence Manager */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-forest-900 stroke-[1.5]" />
                    Engineering credentials & evidence
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Manage third-party commissioning sign-offs, customer references, and safety permits.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddEvidence(true)}
                  className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} className="stroke-[1.5]" />
                  <span>Add evidence document</span>
                </button>
              </div>

              {/* Evidence Counts */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                  <span className="text-[11px] text-zinc-500 block">Verified documents</span>
                  <span className="text-lg font-medium text-forest-900 block tabular-nums mt-0.5">
                    {evidenceList.filter((e) => e.status === 'verified').length}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                  <span className="text-[11px] text-zinc-500 block">Pending review</span>
                  <span className="text-lg font-medium text-zinc-900 block tabular-nums mt-0.5">
                    {evidenceList.filter((e) => e.status === 'pending').length}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                  <span className="text-[11px] text-zinc-500 block">Total documents</span>
                  <span className="text-lg font-medium text-zinc-900 block tabular-nums mt-0.5">
                    {evidenceList.length}
                  </span>
                </div>
              </div>

              {/* Evidence Items List */}
              <div className="space-y-2.5">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-lg border border-zinc-200/90 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900 capitalize text-sm">{ev.title || ev.type}</span>
                        <StatusBadge status={ev.status} size="sm" />
                      </div>
                      <p className="text-zinc-600 text-xs leading-relaxed">{ev.details}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                        <span>Source: {ev.source}</span>
                        <span>&bull;</span>
                        <span>Category: {ev.type}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvidence(ev.id)}
                      className="self-end sm:self-center p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove evidence"
                      aria-label={`Remove evidence ${ev.title}`}
                    >
                      <Trash2 size={14} className="stroke-[1.5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Plant Specs */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                    <Factory size={16} className="text-forest-900 stroke-[1.5]" />
                    Engineering specifications
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    How your technical capabilities appear in side-by-side comparisons.
                  </p>
                </div>

                <span className="text-xs font-medium px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 self-start sm:self-auto">
                  Completeness: {completeness.score}%
                </span>
              </div>

              {profileForm && (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-4 text-xs"
                >
                  {saveSuccessMsg && (
                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs flex items-center gap-1.5">
                      <Check size={14} className="text-forest-900 stroke-[1.5]" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-zinc-600 font-medium block">Organisation name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.organisation}
                        onChange={(e) => setProfileForm({ ...profileForm, organisation: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-600 font-medium block">Scale classification</label>
                      <select
                        value={profileForm.scale}
                        onChange={(e) => setProfileForm({ ...profileForm, scale: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      >
                        <option value="small">Small (micro-digester: 10–250 kg/day)</option>
                        <option value="medium">Medium (turnkey: 50–1,000 kg/day)</option>
                        <option value="large">Large (centralized / SATAT: 500–10,000+ kg/day)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-600 font-medium block">Daily capacity min (kg/day)</label>
                      <input
                        type="number"
                        min="1"
                        value={profileForm.capacityMin}
                        onChange={(e) => setProfileForm({ ...profileForm, capacityMin: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-600 font-medium block">Daily capacity max (kg/day)</label>
                      <input
                        type="number"
                        min="1"
                        value={profileForm.capacityMax}
                        onChange={(e) => setProfileForm({ ...profileForm, capacityMax: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-zinc-600 font-medium block">Service area (comma-separated)</label>
                      <input
                        type="text"
                        value={profileForm.serviceArea}
                        onChange={(e) => setProfileForm({ ...profileForm, serviceArea: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-zinc-600 font-medium block">Supported feedstocks</label>
                      <input
                        type="text"
                        value={profileForm.supportedFeedstock}
                        onChange={(e) => setProfileForm({ ...profileForm, supportedFeedstock: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-zinc-600 font-medium block">Operation & maintenance agreement</label>
                      <textarea
                        rows={2}
                        value={profileForm.omOffering}
                        onChange={(e) => setProfileForm({ ...profileForm, omOffering: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Save size={13} className="stroke-[1.5]" />
                      <span>{profileSaving ? 'Saving...' : 'Save specifications'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Evidence */}
      <Modal
        isOpen={showAddEvidence}
        onClose={() => setShowAddEvidence(false)}
        title="Register engineering credential"
        subtitle="Third-party verified documentation"
      >
        <form onSubmit={handleAddEvidence} className="space-y-3 text-xs font-sans">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-600 font-medium block">Evidence type</label>
              <select
                value={newEvidence.type}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900"
              >
                <option value="commissioning">Commissioning certificate</option>
                <option value="reference">Customer reference</option>
                <option value="projectExample">Demonstrated case study</option>
                <option value="safety_audit">Safety inspection (PESO)</option>
                <option value="environmental_permit">Pollution consent (CTO/CTE)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-medium block">Credential title</label>
              <input
                type="text"
                required
                placeholder="e.g. PESO Gas Safety Sign-off"
                value={newEvidence.title}
                onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-medium block">Source authority</label>
              <input
                type="text"
                required
                placeholder="e.g. Petroleum and Explosives Safety Organisation"
                value={newEvidence.source}
                onChange={(e) => setNewEvidence({ ...newEvidence, source: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-600 font-medium block">Verification status</label>
              <select
                value={newEvidence.status}
                onChange={(e) => setNewEvidence({ ...newEvidence, status: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900"
              >
                <option value="verified">Verified (Audited)</option>
                <option value="pending">Pending (Under review)</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-zinc-600 font-medium block">Summary details</label>
              <textarea
                rows={2}
                placeholder="Summary of certificate scope or audit outcome."
                value={newEvidence.details}
                onChange={(e) => setNewEvidence({ ...newEvidence, details: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white text-zinc-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setShowAddEvidence(false)}
              className="text-xs px-3 py-1.5 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={evidenceSubmitting}
              className="inline-flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Check size={13} className="stroke-[1.5]" />
              <span>{evidenceSubmitting ? 'Registering...' : 'Register credential'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Public Preview Modal */}
      <ProviderDetailModal
        isOpen={showPublicPreview}
        onClose={() => setShowPublicPreview(false)}
        plant={plantData}
        enquiryButtonLabel="Simulated public offtake action"
      />
    </div>
  );
}

export default PlantDashboard;
