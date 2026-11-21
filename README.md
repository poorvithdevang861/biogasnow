# Biogas Trust & Adoption Platform (Demo Prototype)

An evidence-based decision framework connecting organic waste producers, prospective biogas consumers, and qualified anaerobic digestion plant providers.

Designed to overcome the trust deficit, marketing exaggeration, and biological unpredictability in the anaerobic digestion sector by enforcing transparent yield ranges, documented benchmark assumptions, explicit missing data badges, and rigorous separation of commercial claims from verified credentials.

---

## Architecture & Technology Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons | Responsive single-page application with dual-theme (`unslop`), fixed-width clean layout, and understandable workflow navigation. |
| **Backend** | Node.js, Express, REST API | Lightweight decoupled API providing calculation engines, plant matching, comparison matrices, evidence management, and enquiry dispatch. |
| **Data Store** | In-Memory Model with Preseeded Datasets | Realistic UK West Country demo data across feedstock streams, regional plants, research assumptions, and simulated enquiries. |

---

## Quickstart & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Execution
```bash
# Clone the repository
git clone https://github.com/poorvithdevang861/biogasnow.git
cd biogasnow

# Install dependencies (root, server, and client)
npm run install:all

# Start both Express backend (port 5001) and Vite frontend (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Canonical Wired Personas

To eliminate persona confusion during demonstration and evaluation, the landing page directly links each role to one primary canonical persona:

1. **Waste Provider:** `Green Fork Bistro` (`waste-restaurant-1`)
   - *Location:* Bristol Central
   - *Feedstock:* 150 kg/day commercial kitchen food waste
   - *Context:* Urban bistro with rear alleyway access seeking local diversion and cooking gas offset.

2. **Biogas Consumer:** `Oakfield Eco-Terrace` (`consumer-household-1`)
   - *Location:* Bristol East
   - *Demand:* 4–8 m³/day for cooking gas and domestic hot water
   - *Context:* Residential eco-terrace with a 25 m² rear garden requiring winter continuity.

3. **Plant Provider:** `Apex BioGen Engineering` (`plant-apex-1`)
   - *Location:* South West Regional Service Area
   - *Capacity:* 50–1,000 kg/day medium turnkey containerized digesters
   - *Context:* Engineering firm providing automated CSTR plants with verified commissioning certificates and telemetry SLAs.

---

## Design System & Unslop Specification

The platform complies with the **`unslop`** design principles:

### 1. Dual-Theme Support (Light & Dark Together)
- **Sun/Moon Toggle:** Accessible in the header bar across all profile views and on the landing page.
- **Theme Persistence:** Stores user preference in `localStorage` under `biogas_theme`.
- **Light Theme Palette:**
  - Page Background: `#fafafa`
  - Card Surfaces: `#ffffff`
  - Secondary/Raised: `#f4f4f5`
  - Borders/Hairlines: `#e4e4e7`
  - Text Primary: `#171717` (Zinc-900)
  - Text Secondary: `#525252` (Zinc-600)
- **Dark Theme Palette:**
  - Page Background: `#121214`
  - Card Surfaces: `#18181b`
  - Secondary/Raised: `#232325`
  - Borders/Hairlines: `#27272a`
  - Text Primary: `#ededed` (Zinc-100)
  - Text Secondary: `#a1a1a6` (Zinc-400)
- **Semantic Accents:**
  - Emerald (`#059669` / `#10b981`): Waste Provider & Environmental Circularity
  - Amber (`#d97706` / `#f59e0b`): Biogas Consumer & Thermal Energy
  - Teal (`#0d9488` / `#14b8a6`): Plant Provider & Engineering Infrastructure

### 2. Fixed, Non-Slidable Header & Unified Width
- **No Slidable Navbar:** All tabs are compact, fixed, and fit without horizontal scrollbars (`overflow-visible`, no `overflow-x-auto`).
- **Unified Layout Max-Width:** Consistent `max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8` on every single page.
- **Understandable Metaphors:**
  - Waste Provider: *Calculate Yield*, *Nearby Plants*, *My Bookings*, *Green Impact*
  - Biogas Consumer: *Calculate Need*, *Compare Plants*, *My Proposals*, *Plant Sizes*
  - Plant Provider: *Client Requests*, *Evidence Manager*, *Plant Specs*

---

## Requirement Traceability Matrix

### Functional Requirements (FR-01 to FR-09)

| ID | Requirement Name | Implementation Location | Verified Feature Capabilities |
|---|---|---|---|
| **FR-01** | Explicit Role Selection & Persona Context | `client/src/pages/Home.jsx`, `Layout.jsx` | Clear 3-card entry on `/` directly wired to canonical personas. Role indicator and switcher in top bar. |
| **FR-02** | Structured Feedstock Assessment | `client/src/pages/wasteProvider/WasteAssessmentWizard.jsx` | 7-step guided journey covering feedstock category, quantity, generation rhythm, and site access. |
| **FR-03** | Indicative Yield Calculation & Evidence Panel | `client/src/components/RangeBar.jsx`, `EvidencePanel.jsx` | Always displays min–max ranges (m³/day and kWh/day) paired with WRAP/ADBA benchmarks, dates, and caveats. |
| **FR-04** | Nearby Plant Discovery & Compatibility Filter | `WasteDashboard.jsx` (tab `plants`), `WasteAssessmentWizard.jsx` | Filters regional plants by feedstock acceptance, capacity limits, and geographic service radius. |
| **FR-05** | Plant Scale Options Guidance | `ConsumerDashboard.jsx` (tab `scales`), `ConsumerWizard.jsx` | Objective breakdown of Small (10–250 kg), Medium (50–1,000 kg), and Large (500–10,000+ kg) with winter constraints. |
| **FR-06** | Side-by-Side Plant Provider Comparison | `client/src/components/CompareTable.jsx` | Uniform row comparison across capacity, service radius, O&M claims, warranties, and documented proof with flagged gaps. |
| **FR-07** | Plant Provider Profile & Evidence Manager | `client/src/pages/plantProvider/PlantDashboard.jsx` | Editable specifications form, live % completeness indicator, and interactive add/remove evidence manager. |
| **FR-08** | Enquiry Inbox, Proposal Replies & Question Chips | `PlantDashboard.jsx` (tab `inbox`), `server/controllers/enquiryController.js` | Inbound requests triage, suggested question chips (FOG separation, winter jacket, vehicle radius), and fast proposal reply. |
| **FR-09** | Assisted Entry Checklist | `client/src/pages/Help.jsx` (`/help`) | Reference checklist for third parties assisting non-technical users without immediate waste or heating metrics. |

---

### Usability & Trust Requirements (UR-01 to UR-08)

| ID | Trust Requirement | Design & Architectural Enforcement |
|---|---|---|
| **UR-01** | Zero False Precision / Mandatory Biological Ranges | Single-point outputs are prohibited. The calculation engine (`wasteService.js`) enforces min–max intervals derived from volatile solids variance. |
| **UR-02** | Transparent Documented Calculation Assumptions | Every yield card renders an adjacent `EvidencePanel` detailing baseline conversion ratios (e.g. 80–120 m³/t), CH₄ %, source, and publication date. |
| **UR-03** | Mandatory Biological Realities & Engineering Caveats | Highlighting operational risks: winter temperature sensitivity (-30% to -50% gas yield in cold snaps), desulfurization needs, and odor abatement. |
| **UR-04** | Transparent Missing Evidence Badging | Missing or unverified claims explicitly display a prominent `Not provided / Not verified` status badge in comparison tables. |
| **UR-05** | Strict Separation of Claims from Documented Evidence | Distinction between provider marketing claims ("Stated O&M Agreement") and third-party verified proof (commissioning certs, client references). |
| **UR-06** | No Default Scale Lock-In | Consumer Scale step starts with zero preselected scales (`selectedScale = null`), requiring active user evaluation. |
| **UR-07** | Universal "Not Sure" Support & Audit Pathways | Every form field provides an "I'm not sure" option. The system transitions into an "Assessment Required" state and prescribes on-site survey steps. |
| **UR-08** | Accessible, Non-Slidable Clean UI | Fully responsive desktop and mobile layout with high contrast, keyboard navigation support, and zero horizontal scroll overflow. |

---

## API Endpoints Reference

### Feedstock & Calculations
- `POST /api/waste/assess`: Computes biological yield range and thermal equivalence or triggers "assessment_required".
- `POST /api/waste/match`: Matches compatible regional plants based on feedstock and location.
- `GET /api/assumptions`: Returns published research benchmarks (WRAP, ADBA, DEFRA).

### Plants & Evidence
- `GET /api/plants`: Returns all active plant providers with summary statistics.
- `GET /api/plants/:id`: Returns detailed plant specs, claims, and verified documents.
- `PUT /api/plants/:id`: Updates plant specifications, capacities, and service areas.
- `POST /api/plants/compare`: Returns side-by-side comparison data for 2 to 3 plants.
- `GET /api/evidence?plantId=:id`: Lists managed evidence credentials.
- `POST /api/evidence`: Registers new simulated evidence credential.
- `DELETE /api/evidence/:id`: Removes evidence credential.

### Enquiries & Proposals
- `GET /api/enquiries`: Lists enquiries filtered by sender or recipient plant ID.
- `POST /api/enquiries`: Creates a structured simulated project enquiry.
- `POST /api/enquiries/:id/reply`: Submits simulated proposal response from plant provider.

---

## License & Intellectual Property
Educational demonstration prototype for biogas trust and adoption benchmarking. All data and provider profiles are simulated for illustrative evaluation.