import { useState } from "react";

const SECTIONS = [
  {
    id: "clinic",
    title: "Clinic Identity",
    icon: "🏥",
    fields: [
      { key: "clinicName", label: "Clinic Name", type: "text", placeholder: "e.g. Smile Dental Clinic" },
      { key: "clinicType", label: "Type of Clinic", type: "select", options: ["Dental Clinic", "General Practice", "Dermatology", "Physiotherapy", "Veterinary", "Pediatrics", "Ophthalmology", "Orthopedics", "Psychology/Therapy", "Other"] },
      { key: "clinicTypeOther", label: "If Other, specify", type: "text", placeholder: "e.g. Cardiology Clinic", conditional: (data) => data.clinicType === "Other" },
      { key: "location", label: "Location (City, Country)", type: "text", placeholder: "e.g. Munich, Germany" },
      { key: "languages", label: "Languages the agent should speak", type: "text", placeholder: "e.g. German, English" },
      { key: "businessHours", label: "Business Hours", type: "textarea", placeholder: "e.g.\nMon-Fri: 8:00 - 18:00\nSat: 9:00 - 13:00\nSun: Closed" },
    ],
  },
  {
    id: "agent",
    title: "Agent Persona",
    icon: "🤖",
    fields: [
      { key: "agentName", label: "Agent Name", type: "text", placeholder: "e.g. Lisa, Max, Sophie..." },
      { key: "agentGender", label: "Agent Voice / Gender", type: "select", options: ["Female", "Male", "Neutral"] },
      { key: "toneStyle", label: "Tone & Style", type: "multiselect", options: ["Warm & Caring", "Professional & Formal", "Friendly & Casual", "Calm & Reassuring", "Energetic & Upbeat", "Empathetic & Patient"] },
      { key: "personalityNotes", label: "Any specific personality traits?", type: "textarea", placeholder: "e.g. Should be extra patient with elderly callers, use simple language, avoid medical jargon..." },
    ],
  },
  {
    id: "services",
    title: "Services & Offerings",
    icon: "💊",
    fields: [
      { key: "mainServices", label: "Main services / treatments offered", type: "textarea", placeholder: "e.g.\n- Teeth cleaning\n- Fillings & crowns\n- Orthodontics\n- Whitening\n- Emergency dental care" },
      { key: "doctors", label: "Doctors / specialists (names & specialties)", type: "textarea", placeholder: "e.g.\nDr. Müller - General Dentistry\nDr. Schmidt - Orthodontics" },
      { key: "insuranceAccepted", label: "Insurance types accepted", type: "text", placeholder: "e.g. Public & private, AOK, TK, Barmer..." },
      { key: "specialNotes", label: "Anything unique about your clinic?", type: "textarea", placeholder: "e.g. Kid-friendly environment, wheelchair accessible, sedation available..." },
    ],
  },
  {
    id: "calls",
    title: "Call Scenarios",
    icon: "📞",
    fields: [
      { key: "callerReasons", label: "Why do people typically call? (select as many as you feel are relevant)", type: "multiselect", options: ["Book an appointment", "Reschedule/Cancel appointment", "Ask about services & prices", "Emergency / urgent care", "Insurance & billing questions", "Get directions / hours", "Prescription refills", "Test results / follow-up", "General inquiries"] },
      { key: "callerReasonsOther", label: "Other common call reasons?", type: "text", placeholder: "e.g. Post-surgery check-in calls..." },
      { key: "infoToCollect", label: "What info should the agent collect from callers?", type: "multiselect", options: ["Full name", "Date of birth", "Phone number", "Email address", "Insurance details", "Preferred doctor", "Preferred date/time", "Reason for visit", "Existing patient (yes/no)"] },
      { key: "infoToCollectOther", label: "Other info to collect?", type: "text", placeholder: "e.g. Patient ID number, referral source..." },
    ],
  },
  {
    id: "objections",
    title: "Common Questions & Objections",
    icon: "❓",
    fields: [
      { key: "faq1", label: "FAQ #1 - Question", type: "text", placeholder: "e.g. How much does a cleaning cost?" },
      { key: "faq1Answer", label: "FAQ #1 - How should the agent respond?", type: "textarea", placeholder: "e.g. Prices depend on insurance coverage. A standard cleaning starts at..." },
      { key: "faq2", label: "FAQ #2 - Question", type: "text", placeholder: "e.g. Do you accept new patients?" },
      { key: "faq2Answer", label: "FAQ #2 - How should the agent respond?", type: "textarea", placeholder: "" },
      { key: "faq3", label: "FAQ #3 - Question", type: "text", placeholder: "e.g. What should I do in a dental emergency?" },
      { key: "faq3Answer", label: "FAQ #3 - How should the agent respond?", type: "textarea", placeholder: "" },
      { key: "topObjection", label: "Most common objection / hesitation from callers?", type: "textarea", placeholder: "e.g. 'I'm scared of the dentist' → Agent should reassure about gentle treatment options..." },
      { key: "boundaryTopics", label: "Topics the agent should NOT handle (redirect to staff)?", type: "textarea", placeholder: "e.g. Detailed medical advice, pricing negotiations, complaints..." },
    ],
  },
  {
    id: "technical",
    title: "Technical & Workflow",
    icon: "⚙️",
    fields: [
      { key: "bookingSystem", label: "Do you use a booking/calendar system?", type: "select", options: ["Yes - Doctolib", "Yes - Jameda", "Yes - Google Calendar", "Yes - Custom/Other", "No - agent should just collect info"] },
      { key: "bookingSystemOther", label: "If Other, which system?", type: "text", placeholder: "e.g. Calendly, proprietary system...", conditional: (data) => data.bookingSystem === "Yes - Custom/Other" },
      { key: "afterHoursBehavior", label: "What should happen when someone calls outside hours?", type: "select", options: ["Take a message", "Redirect to emergency number", "Inform hours & ask to call back", "Offer callback scheduling"] },
      { key: "emergencyNumber", label: "Emergency / after-hours number (if any)", type: "text", placeholder: "e.g. +49 123 456 789", conditional: (data) => data.afterHoursBehavior === "Redirect to emergency number" },
      { key: "confirmationMethod", label: "How should appointment confirmations be sent?", type: "multiselect", options: ["SMS", "WhatsApp", "Email", "No confirmation needed"] },
      { key: "additionalNotes", label: "Anything else we should know?", type: "textarea", placeholder: "Any special workflows, integrations, or requirements..." },
    ],
  },
];

const MultiSelect = ({ options, selected = [], onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt])}
          style={{
            padding: "8px 16px",
            borderRadius: "100px",
            border: isSelected ? "2px solid #1a5c3a" : "2px solid #d0d5d1",
            background: isSelected ? "#e8f5ee" : "#fafbfa",
            color: isSelected ? "#1a5c3a" : "#4a5550",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isSelected ? 600 : 400,
            transition: "all 0.2s ease",
          }}
        >
          {isSelected && "✓ "}{opt}
        </button>
      );
    })}
  </div>
);

export default function ClinicOnboarding() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(idx);
      setAnimating(false);
    }, 200);
  };

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const filledFields = SECTIONS.flatMap((s) =>
    s.fields.filter((f) => !f.conditional || f.conditional(formData))
  ).filter((f) => {
    const val = formData[f.key];
    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
  }).length;

  const totalFields = SECTIONS.flatMap((s) =>
    s.fields.filter((f) => !f.conditional || f.conditional(formData))
  ).length;

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #f0f7f2 0%, #e3ede6 40%, #d6e5da 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "60px 48px",
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(26,92,58,0.08)",
        }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#1a3a2a", marginBottom: "12px" }}>
            Onboarding Complete
          </h2>
          <p style={{ color: "#5a6b60", fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>
            We've captured all {filledFields} responses. Your voice AI agent prompt will be built based on this information.
          </p>
          <div style={{
            background: "#f5f8f6",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            maxHeight: "400px",
            overflowY: "auto",
          }}>
            {SECTIONS.map((sec) => (
              <div key={sec.id} style={{ marginBottom: "20px" }}>
                <h4 style={{ color: "#1a5c3a", fontSize: "14px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {sec.icon} {sec.title}
                </h4>
                {sec.fields
                  .filter((f) => !f.conditional || f.conditional(formData))
                  .filter((f) => {
                    const val = formData[f.key];
                    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
                  })
                  .map((f) => (
                    <div key={f.key} style={{ marginBottom: "6px", fontSize: "13px" }}>
                      <span style={{ color: "#7a8a80", fontWeight: 500 }}>{f.label}:</span>{" "}
                      <span style={{ color: "#2a3a30" }}>
                        {Array.isArray(formData[f.key]) ? formData[f.key].join(", ") : formData[f.key]}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setCurrentSection(0); }}
            style={{
              marginTop: "24px",
              padding: "14px 32px",
              background: "#1a5c3a",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Edit Responses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #f0f7f2 0%, #e3ede6 40%, #d6e5da 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "28px 32px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "26px",
            color: "#1a3a2a",
            margin: 0,
            fontWeight: 700,
          }}>
            🎙️ Voice AI Agent — Clinic Onboarding
          </h1>
          <p style={{ color: "#6a7b70", fontSize: "14px", margin: "6px 0 0" }}>
            Answer these questions so we can build your custom Voice Agent
          </p>
        </div>
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "10px 18px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          fontSize: "13px",
          color: "#4a5a50",
          fontWeight: 500,
        }}>
          {filledFields} / {totalFields} answered
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 32px", marginBottom: "8px" }}>
        <div style={{
          height: "4px",
          background: "#c8d6cc",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #1a5c3a, #2d8a5e)",
            borderRadius: "4px",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "12px 32px",
        overflowX: "auto",
        flexWrap: "nowrap",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: i === currentSection ? "#1a5c3a" : "#fff",
              color: i === currentSection ? "#fff" : "#4a5a50",
              fontSize: "13px",
              fontWeight: i === currentSection ? 600 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: i === currentSection ? "0 4px 12px rgba(26,92,58,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease",
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div style={{
        flex: 1,
        padding: "16px 32px 32px",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(26,92,58,0.06)",
          maxWidth: "720px",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: "#1a3a2a",
            marginTop: 0,
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "28px" }}>{section.icon}</span>
            {section.title}
          </h2>

          {section.fields
            .filter((f) => !f.conditional || f.conditional(formData))
            .map((field) => (
              <div key={field.key} style={{ marginBottom: "22px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#2a3a30",
                  marginBottom: "8px",
                }}>
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "2px solid #d8ddd9",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfa",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1a5c3a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8ddd9")}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "2px solid #d8ddd9",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfa",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1a5c3a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8ddd9")}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "2px solid #d8ddd9",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfa",
                      outline: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "multiselect" && (
                  <MultiSelect
                    options={field.options}
                    selected={formData[field.key] || []}
                    onChange={(val) => updateField(field.key, val)}
                  />
                )}
              </div>
            ))}

          {/* Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "32px",
            gap: "12px",
          }}>
            <button
              onClick={() => goTo(currentSection - 1)}
              disabled={currentSection === 0}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "2px solid #d0d5d1",
                background: "#fff",
                color: currentSection === 0 ? "#bbb" : "#3a4a40",
                fontSize: "15px",
                fontWeight: 600,
                cursor: currentSection === 0 ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                opacity: currentSection === 0 ? 0.4 : 1,
              }}
            >
              ← Back
            </button>

            {currentSection < SECTIONS.length - 1 ? (
              <button
                onClick={() => goTo(currentSection + 1)}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #1a5c3a, #2d8a5e)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 12px rgba(26,92,58,0.25)",
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  padding: "14px 36px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #1a5c3a, #1a7a4a)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(26,92,58,0.3)",
                }}
              >
                ✓ Submit Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
