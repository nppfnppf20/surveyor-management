import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Badge,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
} from '@mui/material';
import { DatePicker, PickersDay, PickersDayProps, StaticDatePicker } from '@mui/x-date-pickers';
import { Surveyor, Quote, Project, TimelineEvent } from './types';
import { isSameDay, addMonths } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const initialSurveyors: Surveyor[] = [
  { id: '1', name: 'John Doe', company: 'Survey Co', email: 'john@surveyco.com' },
  { id: '2', name: 'Jane Smith', company: 'Map Masters', email: 'jane@mapmasters.com' },
];

const disciplines = [
  'Building Survey',
  'Measured Survey',
  'Topographical Survey',
  'MEP Survey'
];

const surveyTypes = {
  'Building Survey': ['Level 1', 'Level 2', 'Level 3'],
  'Measured Survey': ['Floor Plans', 'Elevations', 'Sections'],
  'Topographical Survey': ['Standard', 'Detailed'],
  'MEP Survey': ['Basic', 'Comprehensive']
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [surveyors, setSurveyors] = useState<Surveyor[]>(initialSurveyors);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Dialog states
  const [newSurveyor, setNewSurveyor] = useState<Partial<Surveyor>>({});
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({});
  const [dialogType] = useState<'surveyor' | 'quote' | 'project'>('surveyor');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddSurveyor = () => {
    if (newSurveyor.name && newSurveyor.company && newSurveyor.email) {
      const surveyor: Surveyor = {
        id: Date.now().toString(),
        ...newSurveyor as Omit<Surveyor, 'id'>
      };
      setSurveyors([...surveyors, surveyor]);
      setNewSurveyor({});
      setOpenDialog(false);
    }
  };

  const handleAddQuote = () => {
    if (newQuote.surveyorId && newQuote.discipline && newQuote.surveyType && newQuote.quoteAmount && newQuote.turnaroundDays) {
      const quote: Quote = {
        id: Date.now().toString(),
        isInstructed: false,
        ...newQuote as Omit<Quote, 'id' | 'isInstructed'>
      };
      setQuotes([...quotes, quote]);
      setNewQuote({});
      setOpenDialog(false);
    }
  };

  const handleInstructQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    // Update quote status
    setQuotes(quotes.map(q => 
      q.id === quoteId ? { ...q, isInstructed: true } : q
    ));

    // Create new project
    const newProject: Project = {
      id: Date.now().toString(),
      quoteId,
      surveyorId: quote.surveyorId,
      siteVisitDate: null,
      firstDraftDate: null,
      finalReportDate: null,
      discipline: quote.discipline,
      surveyType: quote.surveyType
    };
    setProjects([...projects, newProject]);
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  // Generate timeline events from projects
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    projects.forEach(project => {
      if (project.siteVisitDate) {
        events.push({
          projectId: project.id,
          surveyorId: project.surveyorId,
          date: project.siteVisitDate,
          type: 'SITE_VISIT',
          description: `Site Visit - ${project.discipline} (${project.surveyType})`
        });
      }
      if (project.firstDraftDate) {
        events.push({
          projectId: project.id,
          surveyorId: project.surveyorId,
          date: project.firstDraftDate,
          type: 'FIRST_DRAFT',
          description: `First Draft Due - ${project.discipline} (${project.surveyType})`
        });
      }
      if (project.finalReportDate) {
        events.push({
          projectId: project.id,
          surveyorId: project.surveyorId,
          date: project.finalReportDate,
          type: 'FINAL_REPORT',
          description: `Final Report Due - ${project.discipline} (${project.surveyType})`
        });
      }
    });
    return events;
  }, [projects]);

  // Group quotes by discipline and survey type
  const groupedQuotes = useMemo(() => {
    const grouped: Record<string, Record<string, Quote[]>> = {};
    disciplines.forEach(discipline => {
      grouped[discipline] = {};
      surveyTypes[discipline as keyof typeof surveyTypes].forEach(type => {
        grouped[discipline][type] = quotes.filter(q => 
          q.discipline === discipline && q.surveyType === type
        );
      });
    });
    return grouped;
  }, [quotes]);

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'SITE_VISIT':
        return '#f44336'; // Red for site visits
      case 'FIRST_DRAFT':
        return '#2196f3'; // Blue for first drafts
      case 'FINAL_REPORT':
        return '#4caf50'; // Green for final reports
      default:
        return '#757575';
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'SITE_VISIT':
        return <LocationOnIcon />;
      case 'FIRST_DRAFT':
        return <DescriptionIcon />;
      case 'FINAL_REPORT':
        return <DoneAllIcon />;
      default:
        return null;
    }
  };

  const ServerDay = (props: PickersDayProps<Date>) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const eventsForDay = timelineEvents.filter(t => isSameDay(t.date, day));
    const hasEvents = eventsForDay.length > 0;
    const theme = useTheme();

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={
          hasEvents ? (
            <Box
              sx={{
                bgcolor: getEventColor(eventsForDay[0].type),
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.background.paper}`
              }}
            />
          ) : undefined
        }
      >
        <PickersDay 
          {...other} 
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{
            ...(hasEvents && {
              backgroundColor: 'rgba(0,0,0,0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.08)'
              }
            })
          }}
        />
      </Badge>
    );
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return timelineEvents.filter(t => isSameDay(t.date, selectedDate));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Quotes" />
          <Tab label="Active Projects" />
          <Tab label="Calendar" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Discipline & Type</TableCell>
                <TableCell>Surveyor</TableCell>
                <TableCell align="right">Quote Amount</TableCell>
                <TableCell align="right">Turnaround (Days)</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedQuotes).map(([discipline, typeGroups]) => (
                Object.entries(typeGroups).map(([type, quotes]) => (
                  <React.Fragment key={`${discipline}-${type}`}>
                    <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                      <TableCell colSpan={6}>
                        <Typography variant="subtitle1">
                          {discipline} - {type}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {quotes.map((quote) => {
                      const surveyor = surveyors.find(s => s.id === quote.surveyorId);
                      return (
                        <TableRow key={quote.id}>
                          <TableCell></TableCell>
                          <TableCell>{surveyor?.name}</TableCell>
                          <TableCell align="right">£{quote.quoteAmount}</TableCell>
                          <TableCell align="right">{quote.turnaroundDays}</TableCell>
                          <TableCell align="center">
                            {quote.isInstructed ? (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Instructed"
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Chip
                                icon={<PendingIcon />}
                                label="Pending"
                                color="warning"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {!quote.isInstructed && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleInstructQuote(quote.id)}
                              >
                                Instruct
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Active Projects</Typography>
              <List>
                {projects.map((project) => {
                  const surveyor = surveyors.find(s => s.id === project.surveyorId);
                  return (
                    <ListItem key={project.id}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1">
                            {surveyor?.name} - {project.discipline} ({project.surveyType})
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <DatePicker
                            label="Site Visit Date"
                            value={project.siteVisitDate}
                            onChange={(date) => handleUpdateProject(project.id, { siteVisitDate: date })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <DatePicker
                            label="First Draft Date"
                            value={project.firstDraftDate}
                            onChange={(date) => handleUpdateProject(project.id, { firstDraftDate: date })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <DatePicker
                            label="Final Report Date"
                            value={project.finalReportDate}
                            onChange={(date) => handleUpdateProject(project.id, { finalReportDate: date })}
                          />
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Event Types:</Typography>
          <Box display="flex" gap={2}>
            <Chip
              icon={<LocationOnIcon />}
              label="Site Visit"
              sx={{ bgcolor: getEventColor('SITE_VISIT'), color: 'white' }}
            />
            <Chip
              icon={<DescriptionIcon />}
              label="First Draft"
              sx={{ bgcolor: getEventColor('FIRST_DRAFT'), color: 'white' }}
            />
            <Chip
              icon={<DoneAllIcon />}
              label="Final Report"
              sx={{ bgcolor: getEventColor('FINAL_REPORT'), color: 'white' }}
            />
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" gap={2} sx={{ height: 'calc(100vh - 300px)' }}>
                {[0, 1, 2].map((monthOffset) => (
                  <Box key={monthOffset} flex={1}>
                    <StaticDatePicker
                      defaultValue={addMonths(new Date(), monthOffset)}
                      slots={{
                        day: ServerDay
                      }}
                      slotProps={{
                        actionBar: { actions: [] }
                      }}
                      onChange={(date) => setSelectedDate(date)}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Events for {selectedDate?.toLocaleDateString()}
              </Typography>
              {getEventsForSelectedDate().length === 0 ? (
                <Typography color="text.secondary">
                  No events for this date
                </Typography>
              ) : (
                <List>
                  {getEventsForSelectedDate().map((event) => {
                    const surveyor = surveyors.find(s => s.id === event.surveyorId);
                    return (
                      <ListItem key={`${event.projectId}-${event.type}`}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              {getEventIcon(event.type)}
                              {event.description}
                            </Box>
                          }
                          secondary={surveyor?.name}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'surveyor' ? 'Add New Surveyor' : 
           dialogType === 'quote' ? 'Add New Quote' : 'Add Project Dates'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'surveyor' ? (
            <>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={newSurveyor.name || ''}
                onChange={(e) => setNewSurveyor({ ...newSurveyor, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Company"
                margin="normal"
                value={newSurveyor.company || ''}
                onChange={(e) => setNewSurveyor({ ...newSurveyor, company: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={newSurveyor.email || ''}
                onChange={(e) => setNewSurveyor({ ...newSurveyor, email: e.target.value })}
              />
            </>
          ) : dialogType === 'quote' ? (
            <>
              <TextField
                select
                fullWidth
                label="Surveyor"
                margin="normal"
                value={newQuote.surveyorId || ''}
                onChange={(e) => setNewQuote({ ...newQuote, surveyorId: e.target.value })}
              >
                {surveyors.map((surveyor) => (
                  <MenuItem key={surveyor.id} value={surveyor.id}>
                    {surveyor.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Discipline"
                margin="normal"
                value={newQuote.discipline || ''}
                onChange={(e) => setNewQuote({ ...newQuote, discipline: e.target.value })}
              >
                {disciplines.map((discipline) => (
                  <MenuItem key={discipline} value={discipline}>
                    {discipline}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Survey Type"
                margin="normal"
                value={newQuote.surveyType || ''}
                onChange={(e) => setNewQuote({ ...newQuote, surveyType: e.target.value })}
                disabled={!newQuote.discipline}
              >
                {newQuote.discipline && surveyTypes[newQuote.discipline as keyof typeof surveyTypes].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Quote Amount (£)"
                margin="normal"
                type="number"
                value={newQuote.quoteAmount || ''}
                onChange={(e) => setNewQuote({ ...newQuote, quoteAmount: parseFloat(e.target.value) })}
              />
              <TextField
                fullWidth
                label="Turnaround Time (days)"
                margin="normal"
                type="number"
                value={newQuote.turnaroundDays || ''}
                onChange={(e) => setNewQuote({ ...newQuote, turnaroundDays: parseInt(e.target.value) })}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={dialogType === 'surveyor' ? handleAddSurveyor : handleAddQuote}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App; 