import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';

export function PlantDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'inbox';

  const [plantData, setPlantData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Reply State
  const [activeReplyEnquiryId, setActiveReplyEnquiryId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const loadPlantData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/plants/${activeProfile.id}`).catch(() => ({ data: null })),
      api.get(`/enquiries?toPlantId=${activeProfile.id}`).catch(() => ({ data: [] })),
      api.get(`/evidence?plantId=${activeProfile.id}`).catch(() => ({ data: [] })),
    ])
      .then(([plantRes, enqRes, evRes]) => {
        setPlantData(plantRes?.data || null);
        setEnquiries(enqRes?.data || []);
        setEvidenceList(evRes?.data || []);
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

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6">
      {/* Tab 1: Requests Inbox (Simple & direct) */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Mail size={18} className="text-teal-400" />
                  Incoming Project & Waste Requests
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Review specifications from local kitchens, businesses, and consumers requesting digester proposals or feedstock drop-off.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-950/50 text-teal-300 border border-teal-800 self-start sm:self-auto">
                {enquiries.length} requests in inbox
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-950/50 rounded-xl border border-zinc-800 space-y-2 text-xs text-zinc-400">
                <p>No new requests currently pending for {activeProfile.name}.</p>
                <p className="text-zinc-500">
                  Switch to a Waste Provider or Consumer profile to submit an enquiry, and it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800 shadow-xs space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div>
                        <span className="font-bold text-zinc-100 text-sm block">
                          Request from: {enq.fromProfile}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    {/* Summary Details */}
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 grid sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Waste / Use:</span>
                        <strong className="text-zinc-200">{enq.summary?.wasteType || enq.summary?.intendedUse || 'Biogas project'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Estimated Output / Scale:</span>
                        <strong className="text-zinc-200">{enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'Assessment required'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Contact Preference:</span>
                        <span className="capitalize font-medium text-zinc-200">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-1">
                      <span className="text-zinc-500 block text-[11px]">Client Questions / Site Constraints:</span>
                      <p className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/60 text-amber-200 font-medium leading-relaxed">
                        "{enq.questions}"
                      </p>
                    </div>

                    {/* Existing Replies */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800">
                        <span className="font-bold text-teal-400 block text-[11px]">
                          Your Sent Proposals & Responses:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-teal-950/30 border border-teal-900/60 text-teal-100 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-teal-400 font-semibold">
                              <span>Sent by {reply.authorName || activeProfile.name}</span>
                              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-200">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply / Proposal Composer */}
                    {activeReplyEnquiryId === enq.id ? (
                      <div className="space-y-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="font-bold text-zinc-200 block text-xs">
                          Compose Fast Proposal / Site Visit Response:
                        </span>
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
                            className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 hover:border-teal-500 text-zinc-300 transition-colors"
                          >
                            Pre-fill Site Visit Proposal
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response to this enquiry..."
                          className="w-full text-xs p-3 rounded-xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSendReply(enq.id)}
                            disabled={replyLoading || !replyText.trim()}
                            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
                          >
                            <Send size={12} />
                            <span>{replyLoading ? 'Sending...' : 'Send Simulated Proposal'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyEnquiryId(null);
                              setReplyText('');
                            }}
                            className="text-xs px-3 py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyEnquiryId(enq.id);
                            setReplyText(
                              `Thank you for sharing your project specifications. Based on your indicative demand of ${
                                enq.summary?.estimatedBiogasRange || enq.summary?.chosenScale || 'the site'
                              }, our turnkey system can accommodate this setup. We would like to schedule a preliminary site visit to assess gas piping routing and outdoor foundation access.`
                            );
                          }}
                          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Send size={12} />
                          <span>Respond / Send Proposal</span>
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

      {/* Tab 2: Plant Profile & Evidence (Lightweight summary) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-teal-400" />
                  Engineering Specifications & Verification Status
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  How your plant capabilities and verified credentials appear to waste providers and consumers.
                </p>
              </div>

              {plantData?.completeness && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-950/50 text-teal-300 border border-teal-800 self-start sm:self-auto">
                  Profile Completeness: {plantData.completeness.score}%
                </span>
              )}
            </div>

            {plantData ? (
              <div className="space-y-6 text-xs">
                {/* Specs Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">Organisation</span>
                    <strong className="text-zinc-100 text-sm block">{plantData.organisation}</strong>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">Digester Scale & Capacity</span>
                    <strong className="text-zinc-100 text-sm block capitalize">
                      {plantData.scale} · {plantData.capacityMin}–{plantData.capacityMax} {plantData.capacityUnit}
                    </strong>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">Regional Service Area</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {plantData.serviceArea.map((area) => (
                        <span key={area} className="bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">Warranty Terms</span>
                    <strong className="text-zinc-100 text-sm block">
                      {plantData.warranty.includes('Not provided') ? 'Not provided / Not verified' : plantData.warranty}
                    </strong>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1 sm:col-span-2">
                    <span className="text-zinc-500 block">Supported Feedstocks</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {plantData.supportedFeedstock.map((feed) => (
                        <span key={feed} className="bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-200 font-medium">
                          {feed}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1 sm:col-span-2">
                    <span className="text-zinc-500 block">Operation & Maintenance SLA</span>
                    <p className="text-zinc-300 leading-relaxed">{plantData.omOffering}</p>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-zinc-100 text-sm">Checked Engineering Credentials</h3>
                  <div className="space-y-2">
                    {evidenceList.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/50 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-200 block capitalize">{ev.title || ev.type}</span>
                          <span className="text-zinc-400 text-[11px] block">{ev.details}</span>
                          <span className="text-zinc-500 text-[10px]">Source: {ev.source}</span>
                        </div>
                        <StatusBadge status={ev.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs">Loading plant profile...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantDashboard;
