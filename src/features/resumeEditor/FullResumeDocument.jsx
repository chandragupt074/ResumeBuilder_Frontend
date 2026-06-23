import { getPalette, parseTemplateValue, getTemplateMeta } from '../../utils/templateMeta';

// Full-size, A4-proportioned resume document used for PDF export.
// Mirrors the three layouts in ResumePreview.jsx at real font sizes
// with no fixed height / overflow clipping, so html2canvas can capture
// the complete content.

const useResumeData = (data) => {
  const safeData = data || {};
  return {
    profileInfo: safeData.profileInfo || {},
    contactInfo: safeData.contactInfo || {},
    workExperience: safeData.workExperience || [],
    education: safeData.education || [],
    skills: safeData.skills || [],
    projects: safeData.projects || [],
    certifications: safeData.certifications || [],
    languages: safeData.languages || [],
    interests: safeData.interests || [],
  };
};

const getContactRows = (contactInfo) =>
  [
    { icon: '📍', value: contactInfo.location },
    { icon: '✉', value: contactInfo.email },
    { icon: '📞', value: contactInfo.phone },
    { icon: '🔗', value: contactInfo.linkedIn },
    { icon: '🐙', value: contactInfo.github },
    { icon: '🌐', value: contactInfo.website },
  ].filter((row) => row.value);

const SectionLabel = ({ children, accent }) => (
  <p
    className="mb-2 text-xs font-bold uppercase tracking-wide"
    style={{ color: accent, borderBottom: `2px solid ${accent}`, display: 'inline-block', paddingBottom: 3 }}
  >
    {children}
  </p>
);

const SidebarIcon = ({ children }) => (
  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm opacity-80">{children}</span>
);

const isEmpty = (d) =>
  !d.profileInfo.summary && d.workExperience.length === 0 && d.projects.length === 0 && d.skills.length === 0;

// ---------- Shared sections ----------

const WorkExperienceSection = ({ workExperience, palette }) =>
  workExperience.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Work Experience</SectionLabel>
      <div className="mt-2 space-y-4">
        {workExperience.map((exp, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[13px] font-bold text-gray-900">{exp.company || 'Company'}</p>
              <p className="whitespace-nowrap text-[11px] text-gray-400">
                {exp.startDate} {exp.startDate || exp.endDate ? '–' : ''} {exp.endDate}
              </p>
            </div>
            <p className="text-[12px] font-medium text-gray-600">{exp.role}</p>
            {exp.description && <p className="mt-1 text-[11px] text-gray-500">{exp.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );

const ProjectsSection = ({ projects, palette }) =>
  projects.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Projects</SectionLabel>
      <div className="mt-2 space-y-3">
        {projects.map((proj, i) => (
          <div key={i}>
            <p className="text-[12px] font-bold text-gray-900">{proj.title || 'Project title'}</p>
            {proj.description && <p className="text-[11px] text-gray-500">{proj.description}</p>}
            <div className="mt-0.5 flex gap-3 text-[10px] font-medium" style={{ color: palette.accent }}>
              {proj.github && <span>{proj.github}</span>}
              {proj.liveDemo && <span>{proj.liveDemo}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

const SkillsSection = ({ skills, palette }) =>
  skills.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Skills</SectionLabel>
      <div className="mt-2 flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-full px-3 py-1 text-[11px] font-medium"
            style={{ backgroundColor: palette.accent + '1a', color: palette.accent }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );

const CertificationsSection = ({ certifications, palette }) =>
  certifications.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Certifications</SectionLabel>
      <div className="mt-2 space-y-1.5">
        {certifications.map((cert, i) => (
          <p key={i} className="text-[12px] text-gray-700">
            <span className="font-semibold">{cert.title}</span>
            {cert.issuer ? ` — ${cert.issuer}` : ''} {cert.year ? `(${cert.year})` : ''}
          </p>
        ))}
      </div>
    </div>
  );

const EducationSection = ({ education, palette }) =>
  education.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Education</SectionLabel>
      <div className="mt-2 space-y-3">
        {education.map((edu, i) => (
          <div key={i}>
            <p className="text-[12px] font-semibold text-gray-800">{edu.degree || 'Degree'}</p>
            <p className="text-[11px] text-gray-500">{edu.institution}</p>
            {(edu.startDate || edu.endDate) && (
              <p className="text-[10px] text-gray-400">
                {edu.startDate} {edu.startDate || edu.endDate ? '–' : ''} {edu.endDate}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

const LanguagesSection = ({ languages, palette }) =>
  languages.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Languages</SectionLabel>
      <div className="mt-2 space-y-1.5">
        {languages.map((lang, i) => (
          <p key={i} className="text-[12px] text-gray-700">
            {lang.name} {lang.progress ? `· ${lang.progress}` : ''}
          </p>
        ))}
      </div>
    </div>
  );

const InterestsSection = ({ interests, palette }) =>
  interests.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Interests</SectionLabel>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {interests.map((interest, i) => (
          <span
            key={i}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: palette.accent + '22', color: palette.accent }}
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );

// ---------- Layout: 02 Modern Sidebar ----------

const SidebarDocument = ({ d, palette, id }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div id={id} className="mx-auto flex bg-white text-[13px] leading-relaxed text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex w-[34%] shrink-0 flex-col items-center gap-6 px-6 py-10" style={{ backgroundColor: palette.soft }}>
        <div
          className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full text-4xl"
          style={{ backgroundColor: palette.accent + '33' }}
        >
          {d.profileInfo.profilePreviewUrl ? (
            <img src={d.profileInfo.profilePreviewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: palette.accent }}>👤</span>
          )}
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="mt-1 text-sm font-medium text-gray-500">{d.profileInfo.designation || 'Your designation'}</p>
        </div>
        {contactRows.length > 0 && (
          <div className="w-full space-y-2.5 self-stretch">
            {contactRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 break-all text-[12px] text-gray-700">
                <SidebarIcon>{row.icon}</SidebarIcon>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        )}
        <div className="w-full self-stretch space-y-6">
          <EducationSection education={d.education} palette={palette} />
          <LanguagesSection languages={d.languages} palette={palette} />
          <InterestsSection interests={d.interests} palette={palette} />
        </div>
      </div>

      <div className="flex-1 space-y-6 px-8 py-10">
        {d.profileInfo.summary && (
          <div>
            <SectionLabel accent={palette.accent}>Professional Summary</SectionLabel>
            <p className="mt-2 text-[12px] text-gray-600">{d.profileInfo.summary}</p>
          </div>
        )}
        <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
        <ProjectsSection projects={d.projects} palette={palette} />
        <SkillsSection skills={d.skills} palette={palette} />
        <CertificationsSection certifications={d.certifications} palette={palette} />
      </div>
    </div>
  );
};

// ---------- Layout: 01 Classic Professional (single column) ----------

const SingleColumnDocument = ({ d, palette, id }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div id={id} className="mx-auto bg-white text-[13px] leading-relaxed text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex items-center gap-5 px-10 py-8" style={{ backgroundColor: palette.soft }}>
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-3xl"
          style={{ backgroundColor: palette.accent + '33' }}
        >
          {d.profileInfo.profilePreviewUrl ? (
            <img src={d.profileInfo.profilePreviewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: palette.accent }}>👤</span>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="mt-1 text-sm font-medium text-gray-500">{d.profileInfo.designation || 'Your designation'}</p>
          {contactRows.length > 0 && (
            <p className="mt-2 text-[12px] text-gray-500">{contactRows.map((r) => r.value).join('   ·   ')}</p>
          )}
        </div>
      </div>

      <div className="space-y-6 px-10 py-8">
        {d.profileInfo.summary && (
          <div>
            <SectionLabel accent={palette.accent}>Professional Summary</SectionLabel>
            <p className="mt-2 text-[12px] text-gray-600">{d.profileInfo.summary}</p>
          </div>
        )}
        <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
        <EducationSection education={d.education} palette={palette} />
        <ProjectsSection projects={d.projects} palette={palette} />
        <SkillsSection skills={d.skills} palette={palette} />
        <CertificationsSection certifications={d.certifications} palette={palette} />
        <LanguagesSection languages={d.languages} palette={palette} />
        <InterestsSection interests={d.interests} palette={palette} />
      </div>
    </div>
  );
};

// ---------- Layout: 03 Minimal Compact (dense two-column grid) ----------

const CompactDocument = ({ d, palette, id }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div id={id} className="mx-auto bg-white text-[12px] leading-relaxed text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="border-b-[3px] px-10 py-6" style={{ borderColor: palette.accent }}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xl font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="text-sm font-semibold" style={{ color: palette.accent }}>
            {d.profileInfo.designation || 'Your designation'}
          </p>
        </div>
        {contactRows.length > 0 && (
          <p className="mt-1 text-[11px] text-gray-400">{contactRows.map((r) => r.value).join('   ·   ')}</p>
        )}
      </div>

      <div className="px-10 py-7">
        {d.profileInfo.summary && <p className="mb-5 text-[12px] text-gray-600">{d.profileInfo.summary}</p>}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-5">
            <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
            <ProjectsSection projects={d.projects} palette={palette} />
          </div>
          <div className="space-y-5">
            <EducationSection education={d.education} palette={palette} />
            <SkillsSection skills={d.skills} palette={palette} />
            <CertificationsSection certifications={d.certifications} palette={palette} />
            <LanguagesSection languages={d.languages} palette={palette} />
            <InterestsSection interests={d.interests} palette={palette} />
          </div>
        </div>
      </div>
    </div>
  );
};

const FullResumeDocument = ({ data, templateValue, id }) => {
  const { code, colorId } = parseTemplateValue(templateValue);
  const palette = getPalette(colorId);
  const meta = getTemplateMeta(code);
  const d = useResumeData(data);

  if (meta.layout === 'single-column') return <SingleColumnDocument d={d} palette={palette} id={id} />;
  if (meta.layout === 'compact') return <CompactDocument d={d} palette={palette} id={id} />;
  return <SidebarDocument d={d} palette={palette} id={id} />;
};

export default FullResumeDocument;
