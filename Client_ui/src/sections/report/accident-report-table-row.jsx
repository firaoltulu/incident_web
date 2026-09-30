import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Individual cell renderers for each field

export function RenderCellId({ params }) {
  return <Box>{params.row.id}</Box>;
}

export function RenderCellCompany({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.company.Name}
    </Label>
  );
}
export function RenderCellIncidentType({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.incident_type}
    </Label>
  );
}

export function RenderCellCurrentState({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.state.Name}
    </Label>
  );
}

export function RenderCellDamageInflicted({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.accident_cause}
       */}
      {params.row.incident_type === 'አደጋ'
        ? params.row.accident_cause
        : params.row.human_injury_on_person}
    </Label>
  );
}

export function RenderCellIsActive({ params }) {
  return (
    <Label variant="soft" color={params.row.IsActive ? 'success' : 'error'}>
      {params.row.IsActive ? 'Active' : 'Inactive'}
    </Label>
  );
}

export function RenderCellActionExecutedByInternalStaff({ params }) {
  return <Box>{params.row.actionExecutedByInternalStaff || '-'}</Box>;
}

export function RenderCellActionExecutedByOutsidePerson({ params }) {
  return <Box>{params.row.actionExecutedByOutsidePerson || '-'}</Box>;
}

export function RenderCellActionTaken({ params }) {
  return <Box>{params.row.actionTaken}</Box>;
}

export function RenderCellAmountOfFinancialLoss({ params }) {
  return (
    <Box>
      {params.row.incident_type === 'አደጋ'
        ? params.row.accident_property_damage_estimated_value
        : params.row.damaged_property_estimated_value}
    </Box>
  );
}

export function RenderCellCategoriesOfIncident({ params }) {
  return <Box>{params.row.categories_of_incident}</Box>;
}

export function RenderCellDamageToOrganizationBrand({ params }) {
  return <Box>{params.row.damageToOrganizationBrand || '-'}</Box>;
}

export function RenderCellDamageOccurredToPerson({ params }) {
  return <Box>{params.row.damage_occurred_to_person}</Box>;
}

export function RenderCellDateOfReport({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.date_of_report)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.date_of_report)}
      </Box>
    </Stack>
  );
}

export function RenderCellDescription({ params }) {
  return <Box>{params.row.description}</Box>;
}

export function RenderCellEstimatedPropertyDamage({ params }) {
  return <Box>{params.row.estimatedPropertyDamage}</Box>;
}

export function RenderCellMainCauseOfIncident({ params }) {
  return <Box>{params.row.mainCauseOfIncident}</Box>;
}

export function RenderCellNumberOfArrestedSuspects({ params }) {
  return <Box>{params.row.numberOfArrestedSuspects}</Box>;
}

export function RenderCellNumberOfDeaths({ params }) {
  return <Box>{params.row.numberOfDeaths}</Box>;
}

export function RenderCellNumberOfEscapedSuspects({ params }) {
  return <Box>{params.row.suspects_escaped_count}</Box>;
}

export function RenderCellNumberOfInjured({ params }) {
  return (
    <Box>
      {/* {params.row.incident_victim_count} */}
      {params.row.incident_type === 'አደጋ'
        ? params.row.accident_injured_person_count
        : params.row.incident_victim_count}
    </Box>
  );
}

export function RenderCellNumberOfNoneVictims({ params }) {
  return <Box>{params.row.numberOfNoneVictims}</Box>;
}

export function RenderCellRegion({ params }) {
  return <Box>{params.row.region}</Box>;
}

export function RenderCellSpecificArea({ params }) {
  return <Box>{params.row.specific_location || '-'}</Box>;
}

export function RenderCellStatusOfCase({ params }) {
  return <Box>{params.row.statusOfCase}</Box>;
}

export function RenderCellTown({ params }) {
  return <Box>{params.row.city}</Box>;
}

export function RenderCellTypeOfSupportExpected({ params }) {
  return <Box>{params.row.typeOfSupportExpected}</Box>;
}

export function RenderCellTypeOfIncident({ params }) {
  return <Box>{params.row.type_of_incident}</Box>;
}

export function RenderCellWorda({ params }) {
  return <Box>{params.row.woreda}</Box>;
}

export function RenderCellZone({ params }) {
  return <Box>{params.row.zone}</Box>;
}

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.AddedDate)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.AddedDate)}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------
