import { getPalette, parseTemplateValue, getTemplateMeta } from '../../utils/templateMeta';

// Renders a live, miniature preview of the resume. Three genuinely
// different layouts based on the selected template code:
//   01 -> single-column  (stacked header banner, no sidebar)
//   02 -> sidebar         (colored left rail with contact/education)
//   03 -> compact         (dense two-column grid, smaller spacing)

const useResumeData = (data) => {
  // Destructuring defaults (`= {}`) only apply when the value is
  // `undefined`. Spring/MongoDB commonly serializes unset nested objects
  // as explicit `null`, which skips the default. Coalesce explicitly.
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

const SectionLabel = ({ children, accent, underline = true }) => (
  <p
    className="mb-1.5 text-[11px] font-bold uppercase tracking-wide"
    style={
      underline
        ? { color: accent, borderBottom: `1.5px solid ${accent}`, display: 'inline-block', paddingBottom: 2 }
        : { color: accent }
    }
  >
    {children}
  </p>
);

const SidebarIcon = ({ children }) => (
  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] opacity-80">
    {children}
  </span>
);

const EmptyState = () => (
  <div className="flex h-full items-center justify-center text-center text-[10px] text-gray-300">
    Fill in the form to see your resume come to life here.
  </div>
);

// ---------- Shared section blocks (used across layouts) ----------

const WorkExperienceSection = ({ workExperience, palette }) =>
  workExperience.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Work Experience</SectionLabel>
      <div className="mt-1.5 space-y-3">
        {workExperience.map((exp, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[11px] font-bold text-gray-900">{exp.company || 'Company'}</p>
              <p className="whitespace-nowrap text-[9px] text-gray-400">
                {exp.startDate} {exp.startDate || exp.endDate ? '–' : ''} {exp.endDate}
              </p>
            </div>
            <p className="text-[10px] font-medium text-gray-600">{exp.role}</p>
            {exp.description && <p className="mt-0.5 text-[9px] italic text-gray-500">{exp.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );

const ProjectsSection = ({ projects, palette }) =>
  projects.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Projects</SectionLabel>
      <div className="mt-1.5 space-y-2">
        {projects.map((proj, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold text-gray-900">{proj.title || 'Project title'}</p>
            {proj.description && <p className="text-[9px] text-gray-500">{proj.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );

const SkillsSection = ({ skills, palette }) =>
  skills.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Skills</SectionLabel>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-full px-2 py-0.5 text-[9px] font-medium"
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
      <div className="mt-1.5 space-y-1">
        {certifications.map((cert, i) => (
          <p key={i} className="text-[10px] text-gray-700">
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
      <div className="mt-1.5 space-y-2">
        {education.map((edu, i) => (
          <div key={i}>
            <p className="text-[10px] font-semibold text-gray-800">{edu.degree || 'Degree'}</p>
            <p className="text-[9px] text-gray-500">{edu.institution}</p>
          </div>
        ))}
      </div>
    </div>
  );

const LanguagesSection = ({ languages, palette }) =>
  languages.length > 0 && (
    <div>
      <SectionLabel accent={palette.accent}>Languages</SectionLabel>
      <div className="mt-1.5 space-y-1">
        {languages.map((lang, i) => (
          <p key={i} className="text-[10px] text-gray-700">
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
      <div className="mt-1.5 flex flex-wrap gap-1">
        {interests.map((interest, i) => (
          <span
            key={i}
            className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
            style={{ backgroundColor: palette.accent + '22', color: palette.accent }}
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );

const isEmpty = (d) =>
  !d.profileInfo.summary && d.workExperience.length === 0 && d.projects.length === 0 && d.skills.length === 0;

// ---------- Layout: 02 Modern Sidebar ----------

const SidebarLayout = ({ d, palette }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div className="flex h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-[11px] leading-snug shadow-sm">
      <div className="flex w-[34%] shrink-0 flex-col items-center gap-4 px-4 py-6" style={{ backgroundColor: palette.soft }}>
        <div
          className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl"
          style={{ backgroundColor: palette.accent + '33' }}
        >
          {d.profileInfo.profilePreviewUrl ? (
            <img src={d.profileInfo.profilePreviewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: palette.accent }}>👤</span>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="mt-0.5 text-[10px] font-medium text-gray-500">{d.profileInfo.designation || 'Your designation'}</p>
        </div>
        {contactRows.length > 0 && (
          <div className="w-full space-y-2 self-stretch">
            {contactRows.map((row, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-700">
                <SidebarIcon>{row.icon}</SidebarIcon>
                <span className="truncate">{row.value}</span>
              </div>
            ))}
          </div>
        )}
        <div className="w-full self-stretch space-y-4">
          <EducationSection education={d.education} palette={palette} />
          <LanguagesSection languages={d.languages} palette={palette} />
          <InterestsSection interests={d.interests} palette={palette} />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {d.profileInfo.summary && (
          <div>
            <SectionLabel accent={palette.accent}>Professional Summary</SectionLabel>
            <p className="mt-1.5 text-[10px] text-gray-600">{d.profileInfo.summary}</p>
          </div>
        )}
        <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
        <ProjectsSection projects={d.projects} palette={palette} />
        <SkillsSection skills={d.skills} palette={palette} />
        <CertificationsSection certifications={d.certifications} palette={palette} />
        {isEmpty(d) && <EmptyState />}
      </div>
    </div>
  );
};

// ---------- Layout: 01 Classic Professional (single column) ----------

const SingleColumnLayout = ({ d, palette }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-[11px] leading-snug shadow-sm">
      {/* Header banner */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ backgroundColor: palette.soft }}>
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl"
          style={{ backgroundColor: palette.accent + '33' }}
        >
          {d.profileInfo.profilePreviewUrl ? (
            <img src={d.profileInfo.profilePreviewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: palette.accent }}>👤</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="text-[10px] font-medium text-gray-500">{d.profileInfo.designation || 'Your designation'}</p>
          {contactRows.length > 0 && (
            <p className="mt-1 truncate text-[9px] text-gray-500">
              {contactRows.map((r) => r.value).join('   ·   ')}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {d.profileInfo.summary && (
          <div>
            <SectionLabel accent={palette.accent}>Professional Summary</SectionLabel>
            <p className="mt-1.5 text-[10px] text-gray-600">{d.profileInfo.summary}</p>
          </div>
        )}
        <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
        <EducationSection education={d.education} palette={palette} />
        <ProjectsSection projects={d.projects} palette={palette} />
        <SkillsSection skills={d.skills} palette={palette} />
        <CertificationsSection certifications={d.certifications} palette={palette} />
        <LanguagesSection languages={d.languages} palette={palette} />
        <InterestsSection interests={d.interests} palette={palette} />
        {isEmpty(d) && <EmptyState />}
      </div>
    </div>
  );
};

// ---------- Layout: 03 Minimal Compact (dense two-column grid) ----------

const CompactLayout = ({ d, palette }) => {
  const contactRows = getContactRows(d.contactInfo);
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-[10px] leading-snug shadow-sm">
      {/* Slim header, no photo */}
      <div className="border-b-2 px-5 py-3" style={{ borderColor: palette.accent }}>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-bold text-gray-900">{d.profileInfo.fullname || 'Your name'}</p>
          <p className="text-[9px] font-medium" style={{ color: palette.accent }}>
            {d.profileInfo.designation || 'Your designation'}
          </p>
        </div>
        {contactRows.length > 0 && (
          <p className="mt-0.5 truncate text-[8px] text-gray-400">{contactRows.map((r) => r.value).join('  ·  ')}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {d.profileInfo.summary && <p className="mb-3 text-[9px] text-gray-600">{d.profileInfo.summary}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-3">
            <WorkExperienceSection workExperience={d.workExperience} palette={palette} />
            <ProjectsSection projects={d.projects} palette={palette} />
          </div>
          <div className="space-y-3">
            <EducationSection education={d.education} palette={palette} />
            <CertificationsSection certifications={d.certifications} palette={palette} />
          </div>
          <div className="space-y-3">
            <SkillsSection skills={d.skills} palette={palette} />
            <LanguagesSection languages={d.languages} palette={palette} />
            <InterestsSection interests={d.interests} palette={palette} />
          </div>
        </div>

        {isEmpty(d) && <EmptyState />}
      </div>
    </div>
  );
};

const ResumePreview = ({ data, templateValue }) => {
  const { code, colorId } = parseTemplateValue(templateValue);
  const palette = getPalette(colorId);
  const meta = getTemplateMeta(code);
  const d = useResumeData(data);

  if (meta.layout === 'single-column') return <SingleColumnLayout d={d} palette={palette} />;
  if (meta.layout === 'compact') return <CompactLayout d={d} palette={palette} />;
  return <SidebarLayout d={d} palette={palette} />;
};

export default ResumePreview;
