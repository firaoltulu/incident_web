import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
// import midrocLogo from './assets/midroc-logo.png';
// ---------------------------------
// ---------------------------------
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies

// import { saveAs } from 'file-saver';
// import {
//   Table,
//   Packer,
//   TextRun,
//   Document,
//   TableRow,
//   ImageRun,
//   Paragraph,
//   TableCell,
//   WidthType,
//   AlignmentType,
// } from 'docx';

import { saveAs } from 'file-saver';
import {
  Table,
  Packer,
  TextRun,
  Document,
  ImageRun,
  TableRow,
  Paragraph,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  VerticalAlign,
} from 'docx';

//
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { useGetAccident } from 'src/actions/accident';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ProductTableFiltersResult } from '../accident-report-table-filters-result';
import {
  RenderCellId,
  RenderCellCompany,
  RenderCellCreatedAt,
  RenderCellSpecificArea,
  RenderCellIncidentType,
  RenderCellDamageInflicted,
  RenderCellNumberOfInjured,
  RenderCellAmountOfFinancialLoss,
} from '../accident-report-table-row';
// ----------------------------------------------------------------------

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
const human_injury_on_person = ['የህይወት ማጣት', 'አካል መጉደል', 'እገታ', 'ቀላል ጉዳት', 'ዛቻና ማስፈራራት'];

const accident_cause_options = [
  'ቃጠሎ',
  'ጎርፍ /ደራሽ ውሀ/',
  'ከፍተኛ ዝናብ',
  'የመሬት ናዳ',
  'የማሽነሪ ጉዳት',
  'የተሸከርካሪ አደጋ',
];

// ----------------------------------------------------------------------

export function AccidentReportListView() {
  const confirmRows = useBoolean();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [incidentType, setIncidentType] = useState('');

  const [incidentCategory, setIncidentCategory] = useState('');

  const { accidents, accidentsLoading } = useGetAccident();

  const filters = useSetState({ publish: [], stock: [] });

  const [tableData, setTableData] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);
  // console.log('***********************');
  // console.log(accidents);
  // console.log('***********************');

  // Show only a few columns by default, others hidden
  const generateSummaryReport = () => {
    let reportRows = dataFiltered;

    if (incidentCategory) {
      reportRows = reportRows.filter((row) => {
        if (incidentType === 'አደጋ') {
          return row.accident_cause === incidentCategory;
        }

        if (incidentType === 'ወንጀል') {
          return row.human_injury_on_person === incidentCategory;
        }

        return false;
      });
    }
    console.log(incidentCategory);

    const totalCount = reportRows.length;

    const totalFinancialLoss = reportRows.reduce((sum, row) => {
      if (incidentType === 'ወንጀል') {
        // Replace with your exact crime property loss database field name
        return sum + Number(row.damaged_property_estimated_value || 0);
      }

      // No 'else' needed! If it's not 'ወንጀል', it naturally falls through to here.
      return sum + Number(row.accident_property_damage_estimated_value || 0);
    }, 0);

    // const totalFinancialLoss = reportRows.reduce(
    //   (sum, row) =>
    //     sum +
    //     Number(
    //       row.incidentType === 'አደጋ'
    //         ? row.accident_property_damage_estimated_value
    //         : row.damaged_property_estimated_value
    //     ),
    //   // (sum, row) => sum + Number(row.accident_property_damage_estimated_value || 0),
    //   0
    // );
    const startDateText = startDate ? new Date(startDate).toLocaleDateString() : '-';

    const endDateText = endDate ? new Date(endDate).toLocaleDateString() : '-';

    const startTimeText = startDate ? new Date(startDate).toLocaleTimeString() : '-';

    const endTimeText = endDate ? new Date(endDate).toLocaleTimeString() : '-';

    return [
      {
        serial: 1,
        incidentType: incidentCategory || incidentType,
        count: totalCount,
        dateFrequency: `${startDateText} - ${endDateText}`,
        timeFrequency: `${startTimeText} - ${endTimeText}`,
        financialLoss: totalFinancialLoss,
      },
    ];
  };

  // const handleExportSummaryReport = async () => {
  //   const reportData = generateSummaryReport();

  //   // Fetch or provide the logo as an ArrayBuffer/Base64
  //   // For this example, we assume you have a function or variable containing the raw logo data
  //   // const logoBuffer = await fetch('URL_TO_YOUR_MIDROC_LOGO_PNG').then((res) => res.arrayBuffer());
  //   const logoBuffer = await fetch('/logo/mig.jpg')
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch local logo image');
  //       }
  //       return res.arrayBuffer();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return null; // Fallback handling
  //     });

  //   // 1. Create Headers for the table
  //   const tableHeaders = new TableRow({
  //     tableHeader: true,
  //     children: [
  //       new TableCell({ children: [new Paragraph({ text: ' ተ/ቁ', bold: true })] }),
  //       new TableCell({ children: [new Paragraph({ text: ' የወንጀሉ / የአደጋው አይነት', bold: true })] }),
  //       new TableCell({ children: [new Paragraph({ text: ' ብዛት', bold: true })] }),
  //       new TableCell({ children: [new Paragraph({ text: ' ቀን  ድግግሞሽ', bold: true })] }),
  //       new TableCell({ children: [new Paragraph({ text: ' ሰዓት  ድግግሞሽ', bold: true })] }),
  //       new TableCell({ children: [new Paragraph({ text: ' የጉዳቱ  መጠን  በገንዘብ', bold: true })] }),
  //     ],
  //   });

  //   // 2. Map data to rows
  //   const dataRows = reportData.map(
  //     (row) =>
  //       new TableRow({
  //         children: [
  //           new TableCell({ children: [new Paragraph(row.serial.toString())] }),
  //           new TableCell({ children: [new Paragraph(row.incidentType)] }),
  //           new TableCell({ children: [new Paragraph(row.count.toString())] }),
  //           new TableCell({ children: [new Paragraph(row.dateFrequency)] }),
  //           new TableCell({ children: [new Paragraph(row.timeFrequency)] }),
  //           new TableCell({ children: [new Paragraph(row.financialLoss.toString())] }),
  //         ],
  //       })
  //   );

  //   // 3. Build Document structure
  //   const doc = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [
  //           // Header Layout: Logo and Title text
  //           new Paragraph({
  //             alignment: AlignmentType.RIGHT,
  //             children: [
  //               new ImageRun({
  //                 data: logoBuffer,
  //                 transformation: { width: 180, height: 60 },
  //               }),
  //               new TextRun({
  //                 text: '\nሚድሮክ ኢንቨስትመንት ግሩፕ\nየክስተት ማጠቃለያ ሪፖርት',
  //                 bold: true,
  //                 size: 28, // 14pt
  //                 color: '1E4620',
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             text: 'ወርሀዊ የወንጀልና የአደጋ ብዛትና አይነት ያለውን ድግግሞሽ ማጠቃለያ ሪፖርት',
  //             italics: true,
  //             size: 22,
  //             spacing: { before: 200, after: 400 },
  //           }),

  //           // Insert Table
  //           new Table({
  //             width: { size: 100, type: WidthType.PERCENTAGE },
  //             rows: [tableHeaders, ...dataRows],
  //           }),
  //         ],
  //       },
  //     ],
  //   });

  //   // 4. Save file
  //   Packer.toBlob(doc).then((blob) => {
  //     saveAs(blob, `${incidentCategory}_summary_report.docx`);
  //   });
  // };

  // 8888888888888888888888888888888888888888888888888
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleExportSummaryReport = async () => {
    // 1. Fetch the corporate logo from your public directory
    // (As structured in image_1c1fea.png under public/logo/)
    const logoBuffer = await fetch('/logo/mig.jpg')
      .then((res) => {
        if (!res.ok) throw new Error('Corporate logo could not be loaded.');
        return res.arrayBuffer();
      })
      .catch((err) => {
        console.error(err);
        return null;
      });

    // 2. Define reusable styles for a clean, formal layout
    const cellPadding = { top: 120, bottom: 120, left: 140, right: 140 }; // Professional padding
    const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
    const noBorder = { style: BorderStyle.NONE };

    // 3. Build a clean, borderless Header Table (Logo Left, Title Right)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: [
            // Left Column: Logo[cite: 1]
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: logoBuffer
                ? [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: logoBuffer,
                          transformation: { width: 170, height: 75 },
                        }),
                      ],
                    }),
                  ]
                : [],
            }),
            // Right Column: Title Texts[cite: 1]
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { line: 360 },
                  children: [
                    new TextRun({
                      text: 'ሚ ድ ሮ ክ  ኢ ን ቨ ስ ት መ ን ት  ግ ሩ ፕ\n',
                      bold: true,
                      size: 28, // 14pt
                      color: '1E4620',
                      // italics: true,
                    }),
                    new TextRun({
                      text: 'የክስተት ማጠቃለያ ሪፖርት',
                      // bold: true,
                      size: 24, // 11pt
                      color: '333333',
                      // font: 'Nyala',
                      // italics: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // 4. Subtitle Paragraph[cite: 1]
    const subtitleParagraph = new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 300, after: 400 },
      children: [
        new TextRun({
          text: 'ወርሀዊ የወንጀል/የአደጋ ብዛትና አይነት ያለውን ማጠቃለያ ሪፖርት',
          italics: true,
          size: 20, // 10pt
          color: '555555',
          font: 'Nyala',
        }),
      ],
    });

    // 5. Formal Data Table Headers[cite: 1]
    const tableHeaders = new TableRow({
      tableHeader: true,
      children: [
        { text: 'ተ/ቁ', width: 8 },
        { text: 'የወንጀሉ / የአደጋው አይነት', width: 32 },
        { text: 'ብዛት', width: 10 },
        { text: 'ቀን ድግግሞሽ', width: 15 },
        { text: 'ሰዓት ድግግሞሽ', width: 15 },
        { text: 'የጉዳቱ መጠን በገንዘብ', width: 20 },
      ].map(
        (header) =>
          new TableCell({
            width: { size: header.width, type: WidthType.PERCENTAGE },
            // shading: { fill: '1E4620' }, // Corporate Green Header
            margins: cellPadding,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: header.text, bold: true, color: '000000', size: 20 }),
                ],
              }),
            ],
          })
      ),
    });

    // 6. Map Data Rows (with alternate row shading for readability)
    const reportData = generateSummaryReport();
    const dataRows = reportData.map((row, index) => {
      const isEven = index % 2 === 0;
      const rowBgColor = isEven ? 'F9F9F9' : 'FFFFFF'; // Zebra striping

      const cellData = [
        { text: row.serial.toString(), align: AlignmentType.CENTER },
        { text: row.incidentType, align: AlignmentType.LEFT },
        { text: row.count.toString(), align: AlignmentType.CENTER },
        { text: row.dateFrequency || '—', align: AlignmentType.CENTER },
        { text: row.timeFrequency || '—', align: AlignmentType.CENTER },
        { text: row.financialLoss.toLocaleString(), align: AlignmentType.RIGHT },
      ];

      return new TableRow({
        children: cellData.map(
          (cell) =>
            new TableCell({
              shading: { fill: rowBgColor },
              margins: cellPadding,
              borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: cell.align,
                  children: [new TextRun({ text: cell.text, size: 20, color: '333333' })],
                }),
              ],
            })
        ),
      });
    });
    // 7. Assemble Document Structure
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margins: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // Formal 1-inch margins
            },
          },
          children: [
            headerTable,
            subtitleParagraph,
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [tableHeaders, ...dataRows],
            }),
          ],
        },
      ],
    });

    // 8. Export and Save
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${incidentCategory}_summary_report.docx`);
    });
  };
  // 8888888888888888888888888888888888888888888888888

  // const handleExportSummaryReport = () => {
  //   const reportData = generateSummaryReport();

  //   const worksheet = XLSX.utils.json_to_sheet(
  //     reportData.map((row) => ({
  //       'ተ/ቁ': row.serial,
  //       'የ ወ ን ጀ ሉ / የ አ ደ ጋ ው አ ይ ነ ት': row.incidentType,
  //       ብዛት: row.count,
  //       'ቀን ድግግሞሽ': row.dateFrequency,
  //       'ሰዓት ድግግሞሽ': row.timeFrequency,
  //       'የጉዳቱ መጠን በገንዘብ': row.financialLoss,
  //     }))
  //   );
  //   worksheet['!cols'] = [
  //     { wch: 8 },
  //     { wch: 20 },
  //     { wch: 17 },
  //     { wch: 35 },
  //     { wch: 25 },
  //     { wch: 22 },
  //   ];

  //   const workbook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary Report');

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   });

  //   saveAs(blob, `${incidentCategory}_summary_report.xlsx`);
  // };
  const DEFAULT_VISIBLE_COLUMNS = {
    id: true,
    accident_cause: true,
    IsActive: false,
    AddedDate: true,
    // All other fields default to false
    company: true,
    state: true,
    // actionExecutedByInternalStaff: false,
    // actionExecutedByOutsidePerson: false,
    // actionTaken: false,
    amountOfFinancialLoss: false,
    categories_of_incident: false,
    damageToOrganizationBrand: false,
    damage_occurred_to_person: false,
    date_of_report: false,
    description: false,
    estimatedPropertyDamage: false,
    mainCauseOfIncident: false,
    numberOfArrestedSuspects: false,
    numberOfDeaths: false,
    numberOfEscapedSuspects: false,
    numberOfInjured: false,
    numberOfNoneVictims: false,
    region: false,
    specificArea: false,
    statusOfCase: false,
    town: false,
    // typeOfSupportExpected: false,
    // type_of_incident: false,
    worda: false,
    zone: false,
    incident_type: true,
  };
  // const DEFAULT_VISIBLE_COLUMNS = {
  //   id: true,
  //   damage_inflicted: true,
  //   IsActive: false,
  //   AddedDate: true,
  //   // All other fields default to false
  //   company: true,
  //   state: true,
  //   actionExecutedByInternalStaff: false,
  //   actionExecutedByOutsidePerson: false,
  //   actionTaken: false,
  //   amountOfFinancialLoss: false,
  //   categories_of_incident: false,
  //   damageToOrganizationBrand: false,
  //   damage_occurred_to_person: false,
  //   date_of_report: false,
  //   description: false,
  //   estimatedPropertyDamage: false,
  //   mainCauseOfIncident: false,
  //   numberOfArrestedSuspects: false,
  //   numberOfDeaths: false,
  //   numberOfEscapedSuspects: false,
  //   numberOfInjured: false,
  //   numberOfNoneVictims: false,
  //   region: false,
  //   specificArea: false,
  //   statusOfCase: false,
  //   town: false,
  //   typeOfSupportExpected: false,
  //   type_of_incident: false,
  //   worda: false,
  //   zone: false,
  // };
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(DEFAULT_VISIBLE_COLUMNS);

  useEffect(() => {
    if (accidents.length) {
      const new_arr = accidents.map((row) => {
        const new_obj = {
          id: row._id,
          ...row,
        };
        return new_obj;
      });
      setTableData(new_arr);
    }
  }, [accidents]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
    startDate,
    endDate,
    incidentType,
    incidentCategory,
  });
  // *************************8
  const reportData = [];

  if (incidentCategory) {
    const summaryMap = {};

    dataFiltered.forEach((item) => {
      const dateObj = new Date(item.AddedDate);

      const dateKey = dateObj.toLocaleDateString();

      const hourKey = `${dateObj.getHours()}:00`;

      if (!summaryMap[dateKey]) {
        summaryMap[dateKey] = {
          count: 0,
          hours: {},
          totalDamage: 0,
        };
      }

      // summaryMap[dateKey].count++;
      summaryMap[dateKey].count += 1;

      summaryMap[dateKey].hours[hourKey] = (summaryMap[dateKey].hours[hourKey] || 0) + 1;

      summaryMap[dateKey].totalDamage += Number(
        item.accident_property_damage_estimated_value || item.damaged_property_estimated_value || 0
      );
    });

    Object.entries(summaryMap).forEach(([date, value], index) => {
      const mostFrequentHour = Object.entries(value.hours).sort((a, b) => b[1] - a[1])[0];

      reportData.push({
        no: index + 1,
        incidentCategory,
        count: value.count,
        dateFrequency: `${date} (${value.count})`,
        timeFrequency: mostFrequentHour ? `${mostFrequentHour[0]} (${mostFrequentHour[1]})` : '-',
        totalDamage: value.totalDamage,
      });
    });
  }
  // *************************8

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        incidentType={incidentType}
        setIncidentType={setIncidentType}
        incidentCategory={incidentCategory}
        setIncidentCategory={setIncidentCategory}
        handleExportSummaryReport={handleExportSummaryReport}
      />
    ),

    [
      // filters.state,
      // selectedRowIds,
      // startDate,
      // endDate,
      // incidentType,
      // incidentCategory,
      //
      filters,
      canReset,
      selectedRowIds,
      dataFiltered.length,
      confirmRows.onTrue,
      startDate,
      endDate,
      incidentType,
      incidentCategory,
      handleExportSummaryReport,
    ]
  );

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellId params={params} />,
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 1,
      minWidth: 360,
      hideable: true,
      valueGetter: (params) => params?.Name || '',
      renderCell: (params) => <RenderCellCompany params={params} />,
    },
    {
      field: 'incident_type',
      headerName: 'Incident Type',
      flex: 1,
      minWidth: 360,
      hideable: true,
      renderCell: (params) => <RenderCellIncidentType params={params} />,
    },
    // {
    //   field: 'state',
    //   headerName: 'State',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   valueGetter: (params) => params?.Name || '',

    //   renderCell: (params) => <RenderCellCurrentState params={params} />,
    // },
    {
      field: 'accident_cause',
      headerName: 'Incident Cause',
      flex: 1,
      minWidth: 360,
      hideable: true,
      renderCell: (params) => <RenderCellDamageInflicted params={params} />,
    },
    // {
    //   field: 'IsActive',
    //   headerName: 'Is Active',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellIsActive params={params} />,
    // },
    // {
    //   field: 'actionExecutedByInternalStaff',
    //   headerName: 'Action Executed By InternalStaff',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellActionExecutedByInternalStaff params={params} />,
    // },
    // {
    //   field: 'actionExecutedByOutsidePerson',
    //   headerName: 'Action Executed By Outside Person',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellActionExecutedByOutsidePerson params={params} />,
    // },
    // {
    //   field: 'actionTaken',
    //   headerName: 'Action Taken',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellActionTaken params={params} />,
    // },
    {
      // field: {tableData.incident_type === 'አደጋ' ?  'accident_property_damage_estimated_value': 'damaged_property_estimated_value'},
      // field: 'accident_property_damage_estimated_value',

      headerName: 'Damage Estimated Value',
      flex: 1,
      minWidth: 360,
      hideable: true,
      renderCell: (params) => <RenderCellAmountOfFinancialLoss params={params} />,
    },
    // {
    //   field: 'categories_of_incident',
    //   headerName: 'Categories of Incident',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellCategoriesOfIncident params={params} />,
    // },
    // {
    //   field: 'damageToOrganizationBrand',
    //   headerName: 'Damage To Organization Brand',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellDamageToOrganizationBrand params={params} />,
    // },
    // {
    //   field: 'damage_occurred_to_person',
    //   headerName: 'Damage Occurred To Person',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellDamageOccurredToPerson params={params} />,
    // },
    // {
    //   field: 'date_of_report',
    //   headerName: 'Date of Report',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellDateOfReport params={params} />,
    // },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellDescription params={params} />,
    // },
    // {
    //   field: 'estimatedPropertyDamage',
    //   headerName: 'Estimated Property Damage',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellEstimatedPropertyDamage params={params} />,
    // },
    // {
    //   field: 'mainCauseOfIncident',
    //   headerName: 'Main Cause Of Incident',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellMainCauseOfIncident params={params} />,
    // },
    // {
    //   field: 'numberOfArrestedSuspects',
    //   headerName: 'Number Of Arrested Suspects',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellNumberOfArrestedSuspects params={params} />,
    // },
    // {
    //   field: 'numberOfDeaths',
    //   headerName: 'Number Of Arrested Suspects',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellNumberOfDeaths params={params} />,
    // },
    // {
    //   field: 'suspects_escaped_count',
    //   headerName: 'Number Of Escaped Suspects',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellNumberOfEscapedSuspects params={params} />,
    // },
    {
      field: 'incident_victim_count',
      headerName: 'Incident Victim Count',
      flex: 1,
      minWidth: 360,
      hideable: true,
      renderCell: (params) => <RenderCellNumberOfInjured params={params} />,
    },
    // {
    //   field: 'numberOfNoneVictims',
    //   headerName: 'Number Of None Victims',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellNumberOfNoneVictims params={params} />,
    // },
    // {
    //   field: 'region',
    //   headerName: 'Region',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellRegion params={params} />,
    // },
    {
      field: 'specific_location',
      headerName: 'Specific Area',
      flex: 1,
      minWidth: 360,
      hideable: true,
      renderCell: (params) => <RenderCellSpecificArea params={params} />,
    },
    // {
    //   field: 'statusOfCase',
    //   headerName: 'Status Of Case',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellStatusOfCase params={params} />,
    // },
    // {
    //   field: 'city',
    //   headerName: 'Town',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellTown params={params} />,
    // },
    // {
    //   field: 'typeOfSupportExpected',
    //   headerName: 'Type Of Support Expected',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellTypeOfSupportExpected params={params} />,
    // },
    // {
    //   field: 'type_of_incident',
    //   headerName: 'Type of Incident',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellTypeOfIncident params={params} />,
    // },
    // {
    //   field: 'woreda',
    //   headerName: 'Worda',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellWorda params={params} />,
    // },
    // {
    //   field: 'zone',
    //   headerName: 'Zone',
    //   flex: 1,
    //   minWidth: 360,
    //   hideable: true,
    //   renderCell: (params) => <RenderCellZone params={params} />,
    // },
    {
      field: 'AddedDate',
      headerName: 'Created at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection={false}
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={accidentsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
          {/*  */}
        </Card>

        {/*  */}
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  incidentType,
  setIncidentType,
  incidentCategory,
  setIncidentCategory,
  handleExportSummaryReport,
}) {
  return (
    <>
      <GridToolbarContainer sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <GridToolbarQuickFilter
            sx={{
              minWidth: 400,
            }}
          />
          {/* <TextField
            type="date"
            size="small"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{
              maxWidth: { xs: 170, md: 140 },

              '& input::-webkit-datetime-edit-month-field, & input::-webkit-datetime-edit-day-field, & input::-webkit-datetime-edit-year-field, & input::-webkit-datetime-edit-text':
                {
                  color: startDate ? 'inherit' : 'transparent',
                },

              '&:focus-within input::-webkit-datetime-edit-month-field, &:focus-within input::-webkit-datetime-edit-day-field, &:focus-within input::-webkit-datetime-edit-year-field, &:focus-within input::-webkit-datetime-edit-text':
                {
                  color: 'inherit',
                },
            }}
          /> */}

          {/* <TextField
            type="datetime-local"
            size="small"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{
              maxWidth: { xs: 170, md: 180 },

              '& input::-webkit-datetime-edit-month-field, & input::-webkit-datetime-edit-day-field, & input::-webkit-datetime-edit-year-field, & input::-webkit-datetime-edit-text':
                {
                  color: endDate ? 'inherit' : 'transparent',
                },

              '&:focus-within input::-webkit-datetime-edit-month-field, &:focus-within input::-webkit-datetime-edit-day-field, &:focus-within input::-webkit-datetime-edit-year-field, &:focus-within input::-webkit-datetime-edit-text':
                {
                  color: 'inherit',
                },
            }}
          /> */}
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            flexWrap="wrap"
          >
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ minWidth: { xs: 170, md: 180 } }}
            />

            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ minWidth: { xs: 170, md: 180 } }}
            />
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          // justifyContent="space-between"
          flexWrap="wrap"
          spacing={2}
        >
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', flexGrow: 1 }}>
            <TextField
              select
              size="small"
              label="Incident Type"
              value={incidentType}
              onChange={(e) => {
                setIncidentType(e.target.value);
                setIncidentCategory('');
              }}
              sx={{ minWidth: 230 }}
            >
              {/* <MenuItem value="">All</MenuItem> */}
              <MenuItem value="አደጋ">አደጋ</MenuItem>
              <MenuItem value="ወንጀል">ወንጀል</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label={
                incidentType === 'ወንጀል'
                  ? 'Specific Crime'
                  : incidentType === 'አደጋ'
                    ? 'Specific Accident'
                    : 'Specific Incident'
              }
              value={incidentCategory}
              onChange={(e) => {
                setIncidentCategory(e.target.value);
                console.log(e.target.value);
              }}
              sx={{ minWidth: 260 }}
              disabled={!incidentType}
            >
              <MenuItem value="">None</MenuItem>

              {(incidentType === 'ወንጀል'
                ? human_injury_on_person
                : incidentType === 'አደጋ'
                  ? accident_cause_options
                  : []
              ).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {/* {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )} */}
          <Box>
            <Button
              variant="contained"
              color="primary"
              disabled={!incidentType}
              onClick={handleExportSummaryReport}
              sx={{ marginRight: 1 }}
            >
              Summary Report
            </Button>
            <GridToolbarColumnsButton />
            {/* <GridToolbarFilterButton ref={setFilterButtonEl} /> */}
            <GridToolbarExport />
          </Box>
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters, startDate, endDate, incidentType, incidentCategory }) {
  const { stock, publish } = filters;

  let filteredData = [...inputData];

  if (stock.length) {
    filteredData = filteredData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    filteredData = filteredData.filter((product) => publish.includes(product.publish));
  }

  // DATE FILTER
  if (startDate || endDate) {
    filteredData = filteredData.filter((item) => {
      const accidentDate = new Date(item.AddedDate).getTime();
      // const accidentDate = new Date(item.AddedDate);

      // const start = startDate ? new Date(startDate) : null;
      // const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;

      if (start && accidentDate < start) {
        return false;
      }

      if (end && accidentDate > end) {
        return false;
      }

      return true;
    });
  }
  // *************
  if (incidentType) {
    filteredData = filteredData.filter((item) => item.incident_type === incidentType);
  }

  if (incidentCategory) {
    filteredData = filteredData.filter((item) => {
      const categoryValue =
        incidentType === 'አደጋ' ? item.accident_cause : item.human_injury_on_person;

      return categoryValue === incidentCategory;
    });
  }
  // *************

  return filteredData;
}
