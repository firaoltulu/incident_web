import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, Fragment, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { Button, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios from 'src/utils/axios';
import { fDate, formatTimeForPicker, getCurrentTimeForPicker } from 'src/utils/format-time';
import { canEditDocument, getAvailableWorkflowActions } from 'src/utils/workflow/workflowEngine';

import { CONFIG } from 'src/config-global';
import { useButtonContext } from 'src/button/hooks/use-button-context';
import { useWorkflowContext } from 'src/workflow/hooks/use-workflow-context';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { AccidentDetailsToolbar } from './accident-details-toolbar';

// ----------------------------------------------------------------------

const NONE = 'የለም';

const region = [
  'አዲስ አበባ',
  'አማራ',
  'ኦሮሚያ',
  'ትግራይ',
  'አፋር',
  'ሶማሌ',
  'ቤንሻንጉል-ጉሙዝ',
  'ደቡብ ብሔሮች',
  'ጋምቤላ',
  'ሐረሪ',
  'ሲዳማ',
  'ደቡብ ምዕራብ',
  'ማዕከላዊ ኢትዮጵያ',
];

const human_injury_on_person = [
  'የህይወት ማጣት',
  'አካል መጉደል',
  'እገታ',
  'ቀላል ጉዳት',
  'ዛቻና ማስፈራራት',
  'ሌላ',
  NONE,
];

const property_damage_type = ['ስርቆት', 'ማጭበርበርና ማታለል', 'ዝርፊያ', 'ሌላ'];

const cash_damage_type = ['ስርቆት', 'ማጭበርበር', 'ማታለል', 'ሌላ', NONE];

const ip_crime_options = ['አለ', NONE];

const accident_cause_options = [
  'ቃጠሎ',
  'ጎርፍ /ደራሽ ውሀ/',
  'ከፍተኛ ዝናብ',
  'የመሬት ናዳ',
  'የማሽነሪ ጉዳት',
  'የተሸከርካሪ አደጋ',
  'ሌላ',
];

const accident_victim_injury_options = ['የህይወት ማጣት', 'ከባድ አካል ጉዳት', 'ቀላል የአካል ጉዳት', NONE];

const perpetrator_type_options = ['የውስጥ ሰራተኛ', 'የውጭ ሰው', 'ሁለቱም በጋራ'];

const optionalNumber = zod.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
}, zod.number().optional());

export const AccidentSchema = zod.object({
  // 1
  incident_date: zod.coerce.date({
    required_error: 'የድርጊቱ ቀን ያስፈልጋል!',
  }),
  incident_time: zod.string().min(1, 'የድርጊቱ ሰዓት ያስፈልጋል!'),

  // 2
  // organization_name: zod.string().optional(),

  // 3
  // region: zod.string().min(1, 'ክልል ያስፈልጋል!'),
  // zone: zod.string().min(1, 'ዞን/ክፍለ ከተማ ያስፈልጋል!'),
  // city: zod.string().min(1, 'ከተማ ያስፈልጋል!'),
  // woreda: zod.string().min(1, 'ወረዳ ያስፈልጋል!'),
  specific_location: zod.string().min(1, 'ድርጊቱ የተከሰተበት ቦታ / አድራሻ !'),

  // 4 – Crime
  human_injury_on_person: zod.string().optional(),
  incident_victim_count: optionalNumber,
  property_damage_type: zod.string().optional(),
  cash_damage_type: zod.string().optional(),
  damaged_property_type: zod.string().optional(),
  damaged_property_quantity: zod.string().optional(),
  damaged_property_estimated_value: optionalNumber,
  ip_damageToOrganizationBrand: zod.string().optional(),
  ip_damageToOrganizationDocumentsAndTechnologies: zod.string().optional(),
  ip_handingOverOrganizationalPatents: zod.string().optional(),
  ip_unauthorizedUsage: zod.string().optional(),
  ip_AmountofDamage: zod.string().optional(),
  ip_damage_estimated_value: optionalNumber,

  // 5 – Accident
  accident_cause: zod.string().optional(),
  accident_victim_injury: zod.string().optional(),
  accident_injured_person_count: optionalNumber,
  accident_property_damage_quantity: zod.string().optional(),
  accident_property_damage_estimated_value: optionalNumber,
  accident_ip_damage_type: zod.string().optional(),
  accident_ip_damage_estimated_value: optionalNumber,

  // 6
  incident_summary: zod.string().min(1, 'የአፈፃፀም ሁኔታ ዝርዝር ያስፈልጋል!'),

  // 7
  perpetrator_type: zod.string().optional(),
  // perpetrator_type: zod.string().min(1, 'የፈፃሚው ሁኔታ ያስፈልጋል!'),

  // 8
  legal_action_taken: zod.string().optional(),
  administrative_action_taken: zod.string().optional(),
  no_action_reason: zod.string().optional(),

  // 9
  suspects_in_custody_count: optionalNumber,
  suspects_escaped_count: optionalNumber,
  suspect_unidentified: zod.string().optional(),

  // 10
  follow_up_monitoring_case: zod.string().optional(),

  // 11
  additional_comments: zod.string().optional(),

  // 12
  reporter_name: zod.string().min(1, 'የሪፖርት አድራጊ ስም ያስፈልጋል!'),
  reporter_signature: zod.string().optional(),
  report_date: zod.coerce.date({
    required_error: 'የሪፖርት ቀን ያስፈልጋል!',
  }),
  incident_type: zod.string().optional(),
});

const toOptions = (items) => items.map((item) => ({ label: item, value: item }));

// const AMHARIC_FONT = '"Bebas Neue", "Nyala", "Segoe UI", sans-serif';
const AMHARIC_FONT = '"Noto Sans Ethiopic", "Nyala", "Segoe UI", sans-serif';

const cardHeaderSx = {
  mb: 0,
  py: 1.25,
  px: 2,
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
  backgroundImage: (theme) =>
    `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 55%)`,
};

const cardSx = {
  overflow: 'hidden',
  borderRadius: 2,
  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.grey[500], 0.08)}`,
  // bgcolor: (theme) => `theme.palette.primary.main`,
};

const sectionTitleSx = {
  fontFamily: AMHARIC_FONT,
  fontWeight: 'bold',
  fontSize: '1rem',
  lineHeight: 1.4,
  letterSpacing: '0.02em',
  color: 'primary.dark',
  m: 0,
  pl: 1.25,
  py: 0,

  // borderColor: 'primary.main',
  borderRadius: 0.5,
};

const fieldLabelSx = {
  fontFamily: AMHARIC_FONT,
  fontWeight: 600,
  fontSize: '0.875rem',
  lineHeight: 1.35,
  letterSpacing: '0.01em',
  color: 'text.primary',
  m: 0,
  mb: 0.25,
  p: 0,
};

const fieldCaptionSx = {
  fontFamily: AMHARIC_FONT,
  fontWeight: 500,
  fontSize: '0.86rem',
  lineHeight: 1.3,
  color: 'text.secondary',
  m: 0,
  mb: 0.25,
  p: 0,
};

const radioOptionLabelSx = {
  ...fieldCaptionSx,
  mb: 0,
};

function getIncidentTimeFromAccident(accident) {
  if (!accident) {
    return getCurrentTimeForPicker();
  }

  if (accident.incident_time) {
    return formatTimeForPicker(accident.incident_time) || getCurrentTimeForPicker();
  }

  const dateSource = accident.incident_date ?? accident.date_of_report;

  if (dateSource) {
    return formatTimeForPicker(dateSource) || getCurrentTimeForPicker();
  }

  return getCurrentTimeForPicker();
}

const SectionTitle = ({ number, title }) => (
  <Typography variant="subtitle1" sx={sectionTitleSx}>
    {number}. {title}
  </Typography>
);

const printValue = (value) => {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
};

const printDate = (value) => {
  if (!value) return '-';
  return fDate(value) ?? printValue(value);
};

const printTime = (accident) => {
  const raw = accident.incident_time ?? accident.incident_date ?? accident.date_of_report;
  if (!raw) return '-';
  return formatTimeForPicker(raw) || printValue(raw);
};

const buildPrintSections = (accident) => [
  {
    title: '1. ድርጊቱ ያጋጠመበት ቀንና ሰዓት',
    rows: [
      ['ቀን', printDate(accident.incident_date)],
      ['ከቀኑ (ሰዓት)', printTime(accident)],
    ],
  },
  {
    title: '2. የድርጅቱ ስም',
    rows: [['የድርጅቱ ስም', printValue(accident.organization_name ?? accident.company?.Name)]],
  },
  {
    title: '3. ድርጊቱ የተከሰተበት ቦታ / አድራሻ',
    rows: [
      ['ክልል', printValue(accident.region)],
      ['ዞን / ክፍለ ከተማ', printValue(accident.zone)],
      ['ከተማ', printValue(accident.city)],
      ['ወረዳ', printValue(accident.woreda)],
      ['ልዩ ቦታ', printValue(accident.specific_location)],
    ],
  },
  {
    title: '4. ጉዳቱ የደረሰው በወንጀል ከሆነ',
    rows: [
      ['በሰው ላይ የደረሰ ጉዳት', printValue(accident.human_injury_on_person)],
      ['ተጠቂ ብዛት', printValue(accident.incident_victim_count)],
      ['በንብረት ላይ ጉዳት አይነት', printValue(accident.property_damage_type)],
      ['በጥሬ ገንዘብ ጉዳት', printValue(accident.cash_damage_type)],
      ['የንብረት አይነት', printValue(accident.damaged_property_type)],
      ['መጠን/ብዛት', printValue(accident.damaged_property_quantity)],
      ['በገንዘብ ሲተመን', printValue(accident.damaged_property_estimated_value)],
      ['ሚስጥራዊ ሰነድና ፈጠራ', printValue(accident.ip_damageToOrganizationBrand)],
      ['ሰነድ/ቴክኖሎጂ ማበላሸት', printValue(accident.ip_damageToOrganizationDocumentsAndTechnologies)],
      ['ያለፍቃድ አሳልፎ መስጠት', printValue(accident.ip_handingOverOrganizationalPatents)],
      ['ከፍቃድ ውጭ ማዋል', printValue(accident.ip_unauthorizedUsage)],
      ['ጉዳት መጠን/ብዛት', printValue(accident.ip_AmountofDamage)],
      ['በገንዘብ ሲተመን', printValue(accident.ip_damage_estimated_value)],
    ],
  },
  {
    title: '5. ያጋጠመው ክስተት አደጋ ከሆነ',
    rows: [
      ['የአደጋው መነሻ', printValue(accident.accident_cause)],
      ['የጉዳቱ ሰለባ/ተጠቂ', printValue(accident.accident_victim_injury)],
      ['የተጎዳ ሰው ብዛት', printValue(accident.accident_injured_person_count)],
      ['ንብረት ጉዳት መጠን', printValue(accident.accident_property_damage_quantity)],
      ['በገንዘብ ሲተመን', printValue(accident.accident_property_damage_estimated_value)],
      ['በብራንድ፣ ፈጠራ፣ ቴክኖሎጂ ላይ የደረሰ አደጋ', printValue(accident.accident_ip_damage_type)],
      ['በገንዘብ ሲተመን', printValue(accident.accident_ip_damage_estimated_value)],
    ],
  },
  {
    title: '6. የአፈፃፀም ሁኔታ ዝርዝር',
    rows: [['የአፈፃፀም ሁኔታ', printValue(accident.incident_summary)]],
  },
  {
    title: '7. የድርጊቱ ፈፃሚዎች ሁኔታ',
    rows: [['የፈፃሚው ሁኔታ', printValue(accident.perpetrator_type)]],
  },
  {
    title: '8. ለመቆጣጠር የተወሰደ እርምጃ',
    rows: [
      ['ህጋዊ እርምጃ', printValue(accident.legal_action_taken)],
      ['አስተዳደራዊ እርምጃ', printValue(accident.administrative_action_taken)],
      ['ምክንያት (እርምጃ ካልተወሰደ)', printValue(accident.no_action_reason)],
    ],
  },
  {
    title: '9. ተጠርጣሪዎች',
    rows: [
      ['በቁጥጥር ስር ተጠርጣሪ', printValue(accident.suspects_in_custody_count)],
      ['ያመለጡ ተጠርጣሪ', printValue(accident.suspects_escaped_count)],
      ['ተጠርጣሪው የማይታወቅ', printValue(accident.suspect_unidentified)],
    ],
  },
  {
    title: '10. በቀጣይ ክትትል',
    rows: [['የሚያሠፈልግ ጉዳይ', printValue(accident.follow_up_monitoring_case)]],
  },
  {
    title: '11. ተጨማሪ አስተያየት',
    rows: [['አስተያየት', printValue(accident.additional_comments)]],
  },
  {
    title: '12. ሪፖርት አድራጊ',
    rows: [
      ['ስም', printValue(accident.reporter_name)],
      ['ፊርማ', printValue('')],
      ['ሪፖርት የተደረገበት ቀን', printDate(accident.report_date)],
    ],
  },
];

const printSectionHeaderStyle = {
  border: '1px solid #bbb',
  padding: '8px 6px',
  fontWeight: 'bold',
  background: '#e8eef5',
  fontSize: '13px',
};

const printLabelStyle = {
  border: '1px solid #bbb',
  padding: '6px',
  fontWeight: 'bold',
  width: '38%',
  background: '#f2f2f2',
  verticalAlign: 'top',
};

const printValueStyle = {
  border: '1px solid #bbb',
  padding: '6px',
  wordBreak: 'break-word',
  verticalAlign: 'top',
};

const PrintableAccident = ({ currentAccident }) => {
  if (!currentAccident) return null;

  const sections = buildPrintSections(currentAccident);

  return (
    <div
      id="print-accident"
      style={{
        display: 'none',
        fontFamily: AMHARIC_FONT,
        padding: '20px',
        width: '100%',
        fontSize: '12px',
        color: '#222',
        position: 'absolute',
        left: '0',
        top: '0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #000',
          marginBottom: '15px',
          paddingBottom: '6px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>የወንጀል/አደጋ ሪፖርት</h2>
          <div style={{ fontSize: '12px', color: '#555' }}>
            ድርጅት: {currentAccident.company?.Name}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {/* <div style={{ fontWeight: 'bold' }}>ሁኔታ: {printValue(currentAccident.state?.Name)}</div> */}
          <div style={{ fontSize: '11px', color: '#555' }}>
            ቀን:{' '}
            {currentAccident.stateHistory?.length > 0
              ? fDate(currentAccident.stateHistory[currentAccident.stateHistory.length - 1]?.date)
              : new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr>
                <td colSpan={2} style={printSectionHeaderStyle}>
                  {section.title}
                </td>
              </tr>
              {section.rows.map(([label, value]) => (
                <tr key={`${section.title}-${label}`}>
                  <td style={printLabelStyle}>{label}</td>
                  <td style={printValueStyle}>{value}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '12px',
          fontSize: '10px',
          color: '#666',
          textAlign: 'right',
        }}
      >
        የወንጀል/አደጋ ሪፖርት ስርዓት
      </div>
    </div>
  );
};

export function AccidentNewEditForm({ currentAccident, loading, loaderror, onAccidentUpdate }) {
  const router = useRouter();
  // const URL = CONFIG.site.serverUrl;
  const ACCIDENT_MODULE_ID = CONFIG.module.accidentModule;
  const { workflows, workflowsLoading } = useWorkflowContext();
  const { buttons, buttonsLoading } = useButtonContext();
  const { user } = useAuthContext();

  const [docWorkFlow, setDocWorkFlow] = useState(null);
  const [actions, setActions] = useState([]);
  const [canEdit, setCanEdit] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [incidentType, setIncidentType] = useState(currentAccident?.incident_type || 'ወንጀል');
  console.log('**********');
  console.log(JSON.stringify(currentAccident?.incident_type) || 'ወንጀል');

  console.log(currentAccident?.incident_type);
  console.log(currentAccident);

  const defaultValues = useMemo(
    () => ({
      incident_date: currentAccident?.incident_date
        ? new Date(currentAccident.incident_date)
        : new Date(),
      incident_time: getIncidentTimeFromAccident(currentAccident),
      organization_name: currentAccident?.organization_name || currentAccident?.company?.Name || '',
      // region: currentAccident?.region || region[0],
      // zone: currentAccident?.zone || '',
      // city: currentAccident?.city || '',
      // woreda: currentAccident?.woreda || '',
      specific_location: currentAccident?.specific_location || '',
      human_injury_on_person: currentAccident?.human_injury_on_person || human_injury_on_person[6],
      incident_victim_count: currentAccident?.incident_victim_count ?? '',
      property_damage_type: currentAccident?.property_damage_type || property_damage_type[3],
      cash_damage_type: currentAccident?.cash_damage_type || cash_damage_type[4],
      damaged_property_type: currentAccident?.damaged_property_type || '',
      damaged_property_quantity: currentAccident?.damaged_property_quantity || '',
      damaged_property_estimated_value: currentAccident?.damaged_property_estimated_value ?? '',
      ip_damageToOrganizationBrand:
        currentAccident?.ip_damageToOrganizationBrand || ip_crime_options[1],
      ip_damageToOrganizationDocumentsAndTechnologies:
        currentAccident?.ip_damageToOrganizationDocumentsAndTechnologies || ip_crime_options[1],
      ip_handingOverOrganizationalPatents:
        currentAccident?.ip_handingOverOrganizationalPatents || ip_crime_options[1],
      ip_unauthorizedUsage: currentAccident?.ip_unauthorizedUsage || ip_crime_options[1],
      ip_AmountofDamage: currentAccident?.ip_AmountofDamage || '',
      ip_damage_estimated_value: currentAccident?.ip_damage_estimated_value ?? '',
      accident_cause: currentAccident?.accident_cause || accident_cause_options[6],
      accident_victim_injury:
        currentAccident?.accident_victim_injury || accident_victim_injury_options[3],
      accident_injured_person_count: currentAccident?.accident_injured_person_count ?? '',
      accident_property_damage_quantity: currentAccident?.accident_property_damage_quantity || '',
      accident_property_damage_estimated_value:
        currentAccident?.accident_property_damage_estimated_value ?? '',
      accident_ip_damage_type: currentAccident?.accident_ip_damage_type || '',
      accident_ip_damage_estimated_value: currentAccident?.accident_ip_damage_estimated_value ?? '',
      incident_summary: currentAccident?.incident_summary || '',
      perpetrator_type: currentAccident?.perpetrator_type || perpetrator_type_options[0],
      legal_action_taken: currentAccident?.legal_action_taken || '',
      administrative_action_taken: currentAccident?.administrative_action_taken || '',
      no_action_reason: currentAccident?.no_action_reason || '',
      suspects_in_custody_count: currentAccident?.suspects_in_custody_count ?? '',
      suspects_escaped_count: currentAccident?.suspects_escaped_count ?? '',
      suspect_unidentified: currentAccident?.suspect_unidentified || '',
      follow_up_monitoring_case: currentAccident?.follow_up_monitoring_case || '',
      additional_comments: currentAccident?.additional_comments || '',
      reporter_name: currentAccident?.reporter_name || '',
      reporter_signature: currentAccident?.reporter_signature || '',
      report_date: currentAccident?.report_date
        ? new Date(currentAccident.report_date)
        : new Date(),
      incident_type: currentAccident?.incident_type || 'ወንጀል',
    }),
    [currentAccident]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AccidentSchema),
    defaultValues,
  });
  // console.log("**********");
  // console.log(methods);

  useEffect(() => {
    if (incidentType === 'ወንጀል') {
      methods.setValue('accident_cause', accident_cause_options[6]);
      methods.setValue('accident_victim_injury', accident_victim_injury_options[3]);
      methods.setValue('accident_injured_person_count', '');
      methods.setValue('accident_property_damage_quantity', '');
      methods.setValue('accident_property_damage_estimated_value', '');
      methods.setValue('accident_ip_damage_type', '');
      methods.setValue('accident_ip_damage_estimated_value', '');
      methods.setValue('ip_damageToOrganizationDocumentsAndTechnologies', ip_crime_options[1]);
      methods.setValue('ip_handingOverOrganizationalPatents', ip_crime_options[1]);
      methods.setValue('ip_unauthorizedUsage', ip_crime_options[1]);
      methods.setValue('ip_AmountofDamage', '');
      methods.setValue('ip_damage_estimated_value', '');
    }

    if (incidentType === 'አደጋ') {
      methods.setValue('human_injury_on_person', human_injury_on_person[6]);
      methods.setValue('incident_victim_count', '');
      methods.setValue('property_damage_type', property_damage_type[3]);
      methods.setValue('cash_damage_type', cash_damage_type[4]);
      methods.setValue('damaged_property_type', '');
      methods.setValue('damaged_property_quantity', '');
      methods.setValue('damaged_property_estimated_value', '');
    }
  }, [incidentType, methods]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAccident && !workflowsLoading && !buttonsLoading && docWorkFlow !== null) {
      const found_actions = getAvailableWorkflowActions({
        workflow: docWorkFlow,
        currentStateId: currentAccident.state._id,
        userRoles: user.Roles,
        actions: buttons,
      });

      const found_can_edit = canEditDocument({
        workflow: docWorkFlow,
        stateId: currentAccident.state._id,
        userRoles: user.Roles,
      });

      setActions(found_actions);
      setCanEdit(found_can_edit);
    }
  }, [
    currentAccident,
    ACCIDENT_MODULE_ID,
    buttons,
    docWorkFlow,
    user.Roles,
    workflowsLoading,
    buttonsLoading,
  ]);

  useEffect(() => {
    const found = workflows.find((row) => row.Module._id);
    setDocWorkFlow(found);
  }, [workflows]);

  useEffect(() => {
    if (currentAccident && !workflowsLoading && !buttonsLoading) {
      reset(defaultValues);
      // setIncidentType('ወንጀል');
    }
  }, [currentAccident, defaultValues, reset, workflowsLoading, buttonsLoading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form values:', methods.getValues());
      if (!currentAccident) {
        const response = await axios.post(`/accident/register`, data);
        console.log('Data');
        console.log(data);
        console.log('Data');
        reset();

        toast.success('ሪፖርቱ በተሳካ ሁኔታ ተመዝግቧል!');
        router.push(paths.dashboard.accident.details(response.data.accident._id));
      } else {
        const response = await axios.put(`/accident/edit/${currentAccident._id}`, data);
        toast.success('ሪፖርቱ ተስተካክሏል!');

        if (typeof onAccidentUpdate === 'function') {
          const accidentId = currentAccident._id;
          const accidentDetails = await axios.get(`/accident/details/:accidentId`, {
            params: { accidentId },
          });
          onAccidentUpdate(accidentDetails.data.accident);
        }
      }
    } catch (error) {
      toast.error(error.message || 'በመላክ ላይ ስህተት ተፈጥሯል።');
    }
  });

  const handleWorkflowAction = async (action) => {
    setActionLoading((prev) => ({ ...prev, [action.actionId._id]: true }));
    try {
      const payload = {
        _id: action._id,
        documentId: currentAccident._id,
        action: action.actionId,
        next_state: action.nextStateId,
        currentState: action.currentState,
      };

      await axios.put(`/accident/workflow/${currentAccident._id}`, payload);
      toast.success('ሁኔታው ተዘምኗል!');

      if (typeof onAccidentUpdate === 'function') {
        const accidentId = currentAccident._id;
        const accidentDetails = await axios.get(`/accident/details/:accidentId`, {
          params: { accidentId },
        });
        onAccidentUpdate(accidentDetails.data.accident);
      }
    } catch (error) {
      toast.error(error.message || 'ሁኔታ በማዘመን ላይ ስህተት ተፈጥሯል።');
    } finally {
      setActionLoading((prev) => ({ ...prev, [action.actionId._id]: false }));
    }
  };

  const gridProps = {
    columnGap: 2,
    rowGap: 1.5,
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
  };

  const renderSection1 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={1} title="ድርጊቱ ያጋጠመበት ቀንና ሰዓት" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ቀን
            </Typography>
            <Field.DatePicker name="incident_date" disabled={!canEdit} />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ከቀኑ (ሰዓት)
            </Typography>
            <Field.TimePicker
              name="incident_time"
              disabled={!canEdit}
              key={
                currentAccident
                  ? `time-${currentAccident._id}-${getIncidentTimeFromAccident(currentAccident)}`
                  : 'time-new'
              }
            />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );

  const renderSection2 = (
    <Card sx={cardSx}>
      <CardHeader title={<SectionTitle number={2} title="የድርጅቱ ስም" />} sx={cardHeaderSx} />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Field.Text
          name="organization_name"
          placeholder="ምሳሌ: ኤ ሀ/የተወ/የግ/ማህበር ዘርፉ ግብርና"
          disabled={!canEdit}
        />
      </Stack>
    </Card>
  );

  const renderSection3 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={3} title="ድርጊቱ የተከሰተበት ቦታ / አድራሻ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box {...gridProps}>
          {/* <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ክልል
            </Typography>
            <Field.Autocomplete
              name="region"
              autoHighlight
              options={region}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              disabled={!canEdit}
            />
          </Stack> */}
          {/* <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ዞን / ክፍለ ከተማ
            </Typography>
            <Field.Text name="zone" placeholder="ምሳሌ: ልደታ" disabled={!canEdit} />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ከተማ
            </Typography>
            <Field.Text name="city" placeholder="ምሳሌ: አዲስ አበባ" disabled={!canEdit} />
          </Stack> */}
          {/* <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ወረዳ
            </Typography>
            <Field.Text name="woreda" placeholder="ምሳሌ: 04" disabled={!canEdit} />
          </Stack> */}
          <Stack spacing={0.75} sx={{ gridColumn: { md: '1 / -1' } }}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ትክክለኛ ቦታ
            </Typography>
            <Field.Text name="specific_location" placeholder="ምሳሌ: ሳር ቤት" disabled={!canEdit} />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );

  const renderSection4 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={4} title="ጉዳቱ የደረሰው በወንጀል ከሆነ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={fieldLabelSx}>
          በሰው ላይ የደረሰ ጉዳት
        </Typography>
        {/* <Field.RadioGroup
          name="human_injury_on_person"
          options={toOptions(human_injury_on_person)}
          disabled={!canEdit}
        /> */}
        <Field.Autocomplete
          name="human_injury_on_person"
          // autoHighlight
          options={human_injury_on_person}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          disabled={!canEdit}
        />

        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            በጉዳቱ ተጠቂ የሆነ ሰው ብዛት
          </Typography>
          <Field.Text
            name="incident_victim_count"
            placeholder="0"
            disabled={!canEdit}
            type="number"
            inputProps={{ inputMode: 'numeric', min: 0 }}
          />
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            በንብረት ላይ የደረሰ ጉዳት አይነት
          </Typography>
          {/* <Field.RadioGroup
            name="property_damage_type"
            options={toOptions(property_damage_type)}
            disabled={!canEdit}
          /> */}
          <Field.Autocomplete
            name="property_damage_type"
            autoHighlight
            options={property_damage_type}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            disabled={!canEdit}
          />
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            በጥሬ ገንዘብ ላይ የደረሰ ጉዳት
          </Typography>
          {/* <Field.RadioGroup
            name="cash_damage_type"
            options={toOptions(cash_damage_type)}
            disabled={!canEdit}
          /> */}
          <Field.Autocomplete
            name="cash_damage_type"
            autoHighlight
            options={cash_damage_type}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            disabled={!canEdit}
          />
        </Stack>

        {/* <Typography variant="subtitle2" sx={fieldLabelSx}>
          ጉዳት የደረሰበት ንብረት
        </Typography> */}
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ጉዳት የደረሰበት ንብረት/ንብረት አይነት
            </Typography>
            <Field.Text
              name="damaged_property_type"
              placeholder="ምሳሌ: የስንዴ ዱቄት"
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              መጠን/ብዛት
            </Typography>
            <Field.Text
              name="damaged_property_quantity"
              placeholder="ምሳሌ: 5 ኩንታል"
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በገንዘብ ሲተመን
            </Typography>

            <Field.Text
              name="damaged_property_estimated_value"
              placeholder="0 ብር"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
        </Box>
        <Accordion sx={{ borderWidth: 1 }}>
          <AccordionSummary
            expandIcon={<GridExpandMoreIcon />}
            aria-controls="1-panel1-header"
            id="1-panel1-header"
          >
            <Typography component="span">
              በድርጅቶች ብራንድ፣ ፈጠራ፣ ቴክኖሎጂ፣ ሰነድና መረጃዎች ላይ የተፈጸመ ወንጀል
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box {...gridProps}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  ሚስጥራዊ ሰነድና ፈጠራ መስረቅና ማጥፋት
                </Typography>
                <Field.Autocomplete
                  name="ip_damageToOrganizationBrand"
                  options={ip_crime_options}
                  getOptionLabel={(option) => option}
                  disabled={!canEdit}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  ሰነድ ወይም ቴክኖሎጂ ውጤት ማበላሸት/ማቀጠል
                </Typography>
                <Field.Autocomplete
                  name="ip_damageToOrganizationDocumentsAndTechnologies"
                  options={ip_crime_options}
                  getOptionLabel={(option) => option}
                  disabled={!canEdit}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  ያለፍቃድ አሳልፎ መስጠት
                </Typography>
                <Field.Autocomplete
                  name="ip_handingOverOrganizationalPatents"
                  options={ip_crime_options}
                  getOptionLabel={(option) => option}
                  disabled={!canEdit}
                />
              </Stack>
              <Stack spacing={1}>
                {/* <Typography variant="caption" sx={fieldCaptionSx}>  */}
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  ከፍቃድ ውጭ ለሌላ አላማ ማዋል
                </Typography>
                <Field.Autocomplete
                  name="ip_unauthorizedUsage"
                  options={ip_crime_options}
                  getOptionLabel={(option) => option}
                  disabled={!canEdit}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  የደረሰው ጉዳት መጠን
                </Typography>
                <Field.Text name="ip_AmountofDamage" placeholder="መጠን/ብዛት" disabled={!canEdit} />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={fieldLabelSx}>
                  በገንዘብ ሲተመን
                </Typography>
                <Field.Text
                  name="ip_damage_estimated_value"
                  placeholder="0 ብር"
                  disabled={!canEdit}
                  type="number"
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* <Typography variant="subtitle2" sx={[fieldLabelSx, { pt: '1.5rem', fontSize: '1rem' }]}>
          በድርጅቶች ብራንድ፣ ፈጠራ፣ ቴክኖሎጂ፣ ሰነድና መረጃዎች ላይ የተፈጸመ ወንጀል
        </Typography> */}
        {/* <Box {...gridProps}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ሚስጥራዊ ሰነድና ፈጠራ መስረቅና ማጥፋት
            </Typography>
            <Field.Autocomplete
              name="ip_damageToOrganizationBrand"
              options={ip_crime_options}
              getOptionLabel={(option) => option}
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ሰነድ ወይም ቴክኖሎጂ ውጤት ማበላሸት/ማቀጠል
            </Typography>
            <Field.Autocomplete
              name="ip_damageToOrganizationDocumentsAndTechnologies"
              options={ip_crime_options}
              getOptionLabel={(option) => option}
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ያለፍቃድ አሳልፎ መስጠት
            </Typography>
            <Field.Autocomplete
              name="ip_handingOverOrganizationalPatents"
              options={ip_crime_options}
              getOptionLabel={(option) => option}
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={1}>
            {/* <Typography variant="caption" sx={fieldCaptionSx}>  */}
        {/* <Typography variant="subtitle2" sx={fieldLabelSx}>
              ከፍቃድ ውጭ ለሌላ አላማ ማዋል
            </Typography>
            <Field.Autocomplete
              name="ip_unauthorizedUsage"
              options={ip_crime_options}
              getOptionLabel={(option) => option}
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              የደረሰው ጉዳት መጠን
            </Typography>
            <Field.Text name="ip_AmountofDamage" placeholder="መጠን/ብዛት" disabled={!canEdit} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በገንዘብ ሲተመን
            </Typography>
            <Field.Text
              name="ip_damage_estimated_value"
              placeholder="0 ብር"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
        </Box> */}
      </Stack>
    </Card>
  );

  const renderSection5 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={5} title="ያጋጠመው ክስተት አደጋ ከሆነ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={fieldLabelSx}>
          የአደጋው መነሻ
        </Typography>
        {/* <Field.RadioGroup
          name="accident_cause"
          options={toOptions(accident_cause_options)}
          disabled={!canEdit}
        /> */}
        <Field.Autocomplete
          name="accident_cause"
          autoHighlight
          options={accident_cause_options}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          disabled={!canEdit}
        />

        <Typography variant="subtitle2" sx={fieldLabelSx}>
          የጉዳቱ ሰለባ/ተጠቂ
        </Typography>
        {/* <Field.RadioGroup
          name="accident_victim_injury"
          options={toOptions(accident_victim_injury_options)}
          disabled={!canEdit}
        /> */}
        <Field.Autocomplete
          name="accident_victim_injury"
          autoHighlight
          options={accident_victim_injury_options}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          disabled={!canEdit}
        />
        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            በአደጋው የተጎዳ ሰው ብዛት
          </Typography>
          <Field.Text
            name="accident_injured_person_count"
            placeholder="0"
            disabled={!canEdit}
            type="number"
            inputProps={{ inputMode: 'numeric', min: 0 }}
          />
        </Stack>

        {/* <Typography variant="subtitle2" sx={fieldLabelSx}>
          አደጋው በንብረት ላይ ያደረሰ ጉዳት
        </Typography> */}
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              አደጋው በንብረት ላይ ያደረሰ ጉዳት መጠን/ብዛት
            </Typography>
            <Field.Text
              name="accident_property_damage_quantity"
              placeholder="መጠን/ብዛት"
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በገንዘብ ሲተመን
            </Typography>
            <Field.Text
              name="accident_property_damage_estimated_value"
              placeholder="0 ብር"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
        </Box>

        {/* <Typography variant="subtitle2" sx={fieldLabelSx}>
          በብራንድ፣ ፈጠራ፣ ቴክኖሎጂ ላይ የደረሰ አደጋ
        </Typography> */}
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በብራንድ፣ ፈጠራ፣ ቴክኖሎጂ ላይ የደረሰ አደጋ አይነት
            </Typography>
            <Field.Text
              name="accident_ip_damage_type"
              placeholder="የጉዳት አይነት"
              disabled={!canEdit}
            />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በገንዘብ ሲተመን
            </Typography>
            <Field.Text
              name="accident_ip_damage_estimated_value"
              placeholder="0 ብር"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );

  const renderSection6 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={6} title="ያጋጠመው ወንጀል / አደጋ አጠቃላይ ዝርዝር የአፈፃፀም ሁኔታ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Field.Text
          name="incident_summary"
          placeholder="የክስተቱን ዝርዝር በሙሉ ይጻፉ..."
          disabled={!canEdit}
          multiline
          rows={5}
        />
      </Stack>
    </Card>
  );

  const renderSection7 = (
    <Card sx={cardSx}>
      <CardHeader title={<SectionTitle number={7} title="የድርጊቱ ፈፃሚዎች ሁኔታ" />} sx={cardHeaderSx} />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        {/* <Field.RadioGroup
          name="perpetrator_type"
          options={toOptions(perpetrator_type_options)}
          disabled={!canEdit}
        /> */}
        <Field.Autocomplete
          name="perpetrator_type"
          autoHighlight
          options={perpetrator_type_options}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          disabled={!canEdit}
        />
      </Stack>
    </Card>
  );

  const renderSection8 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={8} title="ሁኔታውን ለመቆጣጠር የተወሰደ ህጋዊ እርምጃ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            ህጋዊ እርምጃ
          </Typography>
          <Field.Text
            name="legal_action_taken"
            placeholder="ምሳሌ: ለፖሊስ አስረክብን"
            disabled={!canEdit}
            multiline
            rows={2}
          />
        </Stack>
        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            አስተዳደራዊ እርምጃ
          </Typography>
          <Field.Text
            name="administrative_action_taken"
            // placeholder="አስተዳደራዊ እርምጃ"
            disabled={!canEdit}
            multiline
            rows={2}
          />
        </Stack>
        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            የተወሰደ ነገር የለም ከሆነ ከነምክንያቱ መግለጽ
          </Typography>
          <Field.Text
            name="no_action_reason"
            // placeholder="የተወሰደ ነገር የለም ከሆነ ከነምክንያቱ መግለጽ"
            disabled={!canEdit}
            multiline
            rows={2}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderSection9 = (
    <Card sx={cardSx}>
      <CardHeader title={<SectionTitle number={9} title="ተጠርጣሪዎች" />} sx={cardHeaderSx} />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              በቁጥጥር ስር ያለ ተጠርጣሪ ብዛት
            </Typography>
            <Field.Text
              name="suspects_in_custody_count"
              placeholder="0"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ያመለጡ ተጠርጣሪ ብዛት
            </Typography>
            <Field.Text
              name="suspects_escaped_count"
              placeholder="0"
              disabled={!canEdit}
              type="number"
              inputProps={{ inputMode: 'numeric', min: 0 }}
            />
          </Stack>
        </Box>
        {/* <Field.Autocomplete
          name="suspect_unidentified"
          options={['ተጠርጣሪው የማይታወቅ', NONE]}
          getOptionLabel={(option) => option}
          disabled={!canEdit}
        /> */}
        <Stack spacing={0.75}>
          <Typography variant="subtitle2" sx={fieldLabelSx}>
            ተጠርጣሪው የማይታወቅ
          </Typography>
          <Field.Text name="suspect_unidentified" disabled={!canEdit} />
        </Stack>
      </Stack>
    </Card>
  );

  const renderSection10 = (
    <Card sx={cardSx}>
      <CardHeader
        title={<SectionTitle number={10} title="በቀጣይ የተለየ ክትትል የሚያሠፈልገው ጉዳይ" />}
        sx={cardHeaderSx}
      />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Field.Text
          name="follow_up_monitoring_case"
          placeholder="ምሳሌ: ቆጠራ ማድረግ"
          disabled={!canEdit}
          multiline
          rows={2}
        />
      </Stack>
    </Card>
  );

  const renderSection11 = (
    <Card sx={cardSx}>
      <CardHeader title={<SectionTitle number={11} title="ተጨማሪ አስተያየት" />} sx={cardHeaderSx} />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Field.Text
          name="additional_comments"
          placeholder={NONE}
          disabled={!canEdit}
          multiline
          rows={2}
        />
      </Stack>
    </Card>
  );

  const renderSection12 = (
    <Card sx={cardSx}>
      <CardHeader title={<SectionTitle number={12} title="ሪፖርት አድራጊ" />} sx={cardHeaderSx} />
      <Divider />
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box {...gridProps}>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              የሪፖርት አድራጊ ስም
            </Typography>
            <Field.Text name="reporter_name" placeholder="ስም" disabled={!canEdit} />
            {/* <Field.Text name="reporter_signature" placeholder="ፊርማ" disabled={!canEdit} /> */}
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" sx={fieldLabelSx}>
              ሪፖርት የተደረገበት ቀን
            </Typography>
            <Field.DatePicker name="report_date" disabled={!canEdit} />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );

  const handlePrint = () => {
    const printContents = document.getElementById('print-accident').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
        disabled={!canEdit}
      >
        {!currentAccident ? 'ሪፖርት መዝግብ' : 'ለውጦችን አስቀምጥ'}
      </LoadingButton>

      {currentAccident && (
        <Button
          id="print"
          color="inherit"
          variant="outlined"
          sx={{ ml: 2 }}
          size="large"
          startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          onClick={handlePrint}
        >
          አትም
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <PrintableAccident currentAccident={currentAccident} />
      <Form methods={methods} onSubmit={onSubmit}>
        {currentAccident && (
          <AccidentDetailsToolbar
            backLink={paths.dashboard.accident.root}
            orderNumber={currentAccident?._id}
            createdAt={currentAccident?.AddedDate}
            correctStatus={currentAccident?.state}
            actions={actions}
            handleWorkflowAction={handleWorkflowAction}
            actionLoading={actionLoading}
          />
        )}
        <Stack
          spacing={{ xs: 3, md: 5 }}
          sx={{
            mx: 'auto',
            // backgroundColor: 'red',

            margin: '0 auto',
            maxWidth: { xs: 1020, xl: 880 },
            '& .MuiFormControlLabel-root': { mx: 0, my: 0.25 },
            '& .MuiFormControlLabel-label': {
              ...radioOptionLabelSx,
              py: 0,
            },
            '& .MuiFormControlLabel-root.Mui-checked .MuiFormControlLabel-label': {
              color: 'text.secondary',
            },
            '& .MuiRadioGroup-root': { gap: 0.25 },
            '& .MuiAutocomplete-option': { fontFamily: AMHARIC_FONT },
            '& .MuiInputBase-input': { fontFamily: AMHARIC_FONT },
            '& .MuiPickersSectionList-sectionContent': { fontFamily: AMHARIC_FONT },
          }}
        >
          {renderSection1}
          {/* {renderSection2} */}
          {renderSection3}
          <Card sx={cardSx}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={sectionTitleSx}>
                የክስተት አይነት
              </Typography>

              <Tabs
                value={currentAccident?.incident_type || incidentType}
                onChange={(event, newValue) => {
                  setIncidentType(newValue);
                  methods.setValue('incident_type', newValue);
                }}
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                <Tab
                  label="ወንጀል"
                  value="ወንጀል"
                  // disabled={currentAccident?.incident_type}
                  sx={{
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      p: '7px',
                    },
                  }}
                />
                <Tab
                  label="አደጋ"
                  value="አደጋ"
                  // disabled={currentAccident?.incident_type}
                  sx={{
                    fontSize: '1.2rem',
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      px: '6px',
                      py: '2px',
                    },
                  }}
                />
              </Tabs>
            </Stack>
          </Card>
          {incidentType === 'ወንጀል' && renderSection4}

          {incidentType === 'አደጋ' && renderSection5}
          {/* {renderSection4}
          {renderSection5} */}
          {renderSection6}
          {incidentType === 'ወንጀል' && renderSection7}
          {/* {renderSection7} */}
          {/* {renderSection8} */}
          {incidentType === 'ወንጀል' && renderSection8}
          {incidentType === 'ወንጀል' && renderSection9}
          {/* {renderSection9} */}
          {/* {renderSection10} */}
          {incidentType === 'ወንጀል' && renderSection10}
          {renderSection11}
          {renderSection12}
          {renderActions}
        </Stack>
      </Form>
    </>
  );
}
