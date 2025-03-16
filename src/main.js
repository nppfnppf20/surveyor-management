// Destructure commonly used components
const { 
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Card,
  CardContent,
  Stack,
  InputAdornment
} = MaterialUI;

// Sample data
const initialQuotes = [
  {
    id: '1',
    discipline: 'Building Survey',
    surveyType: 'Level 2',
    organization: 'Survey Co Ltd',
    contact: 'John Smith',
    email: 'john@surveyco.com',
    lineItems: [
      { description: 'Level 2 Survey', amount: 2000, quantity: 1 },
      { description: 'Additional Floor', amount: 500, quantity: 1 }
    ],
    turnaroundDate: '',
    status: 'pending',
    instruction: 'pending'
  },
  {
    id: '2',
    discipline: 'Measured Survey',
    surveyType: 'Floor Plans',
    organization: 'Map Masters',
    contact: 'Jane Doe',
    email: 'jane@mapmasters.com',
    lineItems: [
      { description: 'Floor Plans', amount: 1500, quantity: 1 },
      { description: 'Elevations', amount: 300, quantity: 1 }
    ],
    turnaroundDate: '',
    status: 'pending',
    instruction: 'pending'
  }
];

// No initial projects - they will be created only when quotes are instructed
const initialProjects = [];

// TabPanel component
function TabPanel({ children, value, index }) {
  return React.createElement(Box, {
    hidden: value !== index,
    role: 'tabpanel'
  }, value === index && children);
}

// Status Chip component
function StatusChip({ status }) {
  const getColor = () => {
    switch (status) {
      case 'instructed': return 'success';
      case 'not_instructed': return 'error';
      default: return 'warning';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'instructed': return 'Instructed';
      case 'not_instructed': return 'Not Instructed';
      default: return 'Pending';
    }
  };

  return React.createElement(Chip, {
    label: getLabel(),
    color: getColor(),
    size: 'small'
  });
}

// Project Status Chip component
function ProjectStatusChip({ status }) {
  const getColor = () => {
    switch (status) {
      case 'works_completed': return 'success';
      case 'in_progress': return 'primary';
      case 'scheduled': return 'info';
      case 'delayed': return 'warning';
      default: return 'default';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'works_completed': return 'Works Completed';
      case 'in_progress': return 'In Progress';
      case 'scheduled': return 'Scheduled';
      case 'delayed': return 'Delayed';
      default: return status;
    }
  };

  return React.createElement(Chip, {
    label: getLabel(),
    color: getColor(),
    size: 'small'
  });
}

// Add Quote Dialog Component
function AddQuoteDialog({ open, onClose, onAdd }) {
  const [formData, setFormData] = React.useState({
    discipline: '',
    surveyType: '',
    organization: '',
    contact: '',
    email: '',
    lineItems: [{ description: '', amount: '' }],
    turnaroundDate: '',
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleLineItemChange = (index, field) => (event) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: field === 'amount' ? Number(event.target.value) : event.target.value
    };
    setFormData({
      ...formData,
      lineItems: newLineItems
    });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', amount: '' }]
    });
  };

  const removeLineItem = (index) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = () => {
    return formData.lineItems.reduce((sum, item) => 
      sum + Number(item.amount), 0
    );
  };

  const handleSubmit = () => {
    const newQuote = {
      id: String(Date.now()),
      ...formData,
      status: 'pending',
      instruction: 'pending'
    };
    onAdd(newQuote);
    onClose();
  };

  return React.createElement(Dialog, {
    open,
    onClose,
    maxWidth: 'md',
    fullWidth: true
  },
    React.createElement(DialogTitle, null, 'Add New Quote'),
    React.createElement(DialogContent, null,
      React.createElement(Grid, {
        container: true,
        spacing: 2,
        sx: { mt: 1 }
      },
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Discipline',
            value: formData.discipline,
            onChange: handleChange('discipline'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Survey Type',
            value: formData.surveyType,
            onChange: handleChange('surveyType'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Organisation',
            value: formData.organization,
            onChange: handleChange('organization'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Name',
            value: formData.contact,
            onChange: handleChange('contact'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Email',
            type: 'email',
            value: formData.email,
            onChange: handleChange('email'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(Box, { sx: { mb: 2 } },
            React.createElement(Typography, { variant: 'subtitle1', sx: { mb: 1 } }, 'Line Items'),
            formData.lineItems.map((item, index) =>
              React.createElement(Box, {
                key: index,
                sx: {
                  display: 'flex',
                  gap: 2,
                  mb: 1,
                  alignItems: 'center'
                }
              },
                React.createElement(TextField, {
                  label: 'Description',
                  value: item.description,
                  onChange: handleLineItemChange(index, 'description'),
                  sx: { flex: 2 }
                }),
                React.createElement(TextField, {
                  label: 'Price (excl. VAT)',
                  type: 'number',
                  value: item.amount,
                  onChange: handleLineItemChange(index, 'amount'),
                  InputProps: { 
                    inputProps: { min: 0 },
                    startAdornment: React.createElement(InputAdornment, {
                      position: 'start'
                    }, '£')
                  },
                  sx: { flex: 1 }
                }),
                React.createElement(IconButton, {
                  onClick: () => removeLineItem(index),
                  disabled: formData.lineItems.length === 1
                }, '×')
              )
            ),
            React.createElement(Button, {
              onClick: addLineItem,
              startIcon: '+',
              sx: { mt: 1 }
            }, 'Add Line Item')
          )
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(Box, {
            sx: {
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2
            }
          },
            React.createElement(Typography, { variant: 'h6' }, 'Total (excl. VAT):'),
            React.createElement(Typography, { variant: 'h6' }, 
              `£${calculateTotal().toLocaleString()}`
            )
          )
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Turnaround Date',
            type: 'date',
            value: formData.turnaroundDate,
            onChange: handleChange('turnaroundDate'),
            required: true,
            InputLabelProps: { shrink: true }
          })
        )
      )
    ),
    React.createElement(DialogActions, null,
      React.createElement(Button, {
        onClick: onClose
      }, 'Cancel'),
      React.createElement(Button, {
        variant: 'contained',
        onClick: handleSubmit
      }, 'Add Quote')
    )
  );
}

// Edit Quote Dialog Component
function EditQuoteDialog({ open, onClose, onEdit, quote }) {
  const [formData, setFormData] = React.useState({
    discipline: '',
    surveyType: '',
    organization: '',
    contact: '',
    email: '',
    lineItems: [{ description: '', amount: '' }],
    turnaroundDate: '',
  });

  React.useEffect(() => {
    if (quote) {
      setFormData({
        discipline: quote.discipline,
        surveyType: quote.surveyType,
        organization: quote.organization,
        contact: quote.contact,
        email: quote.email,
        lineItems: quote.lineItems,
        turnaroundDate: quote.turnaroundDate,
      });
    }
  }, [quote]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleLineItemChange = (index, field) => (event) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: field === 'amount' || field === 'quantity' ? Number(event.target.value) : event.target.value
    };
    setFormData({
      ...formData,
      lineItems: newLineItems
    });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', amount: '', quantity: 1 }]
    });
  };

  const removeLineItem = (index) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = () => {
    return formData.lineItems.reduce((sum, item) => 
      sum + item.amount, 0
    );
  };

  const handleSubmit = () => {
    const updatedQuote = {
      ...quote,
      ...formData,
    };
    onEdit(updatedQuote);
    onClose();
  };

  return React.createElement(Dialog, {
    open,
    onClose,
    maxWidth: 'md',
    fullWidth: true
  },
    React.createElement(DialogTitle, null, 'Edit Quote'),
    React.createElement(DialogContent, null,
      React.createElement(Grid, {
        container: true,
        spacing: 2,
        sx: { mt: 1 }
      },
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Discipline',
            value: formData.discipline,
            onChange: handleChange('discipline'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Survey Type',
            value: formData.surveyType,
            onChange: handleChange('surveyType'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Organisation',
            value: formData.organization,
            onChange: handleChange('organization'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Name',
            value: formData.contact,
            onChange: handleChange('contact'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Email',
            type: 'email',
            value: formData.email,
            onChange: handleChange('email'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(Box, { sx: { mb: 2 } },
            React.createElement(Typography, { variant: 'subtitle1', sx: { mb: 1 } }, 'Line Items'),
            formData.lineItems.map((item, index) =>
              React.createElement(Box, {
                key: index,
                sx: {
                  display: 'flex',
                  gap: 2,
                  mb: 1,
                  alignItems: 'center'
                }
              },
                React.createElement(TextField, {
                  label: 'Description',
                  value: item.description,
                  onChange: handleLineItemChange(index, 'description'),
                  sx: { flex: 2 }
                }),
                React.createElement(TextField, {
                  label: 'Price (excl. VAT)',
                  type: 'number',
                  value: item.amount,
                  onChange: handleLineItemChange(index, 'amount'),
                  InputProps: { 
                    inputProps: { min: 0 },
                    startAdornment: React.createElement(InputAdornment, {
                      position: 'start'
                    }, '£')
                  },
                  sx: { flex: 1 }
                }),
                React.createElement(IconButton, {
                  onClick: () => removeLineItem(index),
                  disabled: formData.lineItems.length === 1
                }, '×')
              )
            ),
            React.createElement(Button, {
              onClick: addLineItem,
              startIcon: '+',
              sx: { mt: 1 }
            }, 'Add Line Item')
          )
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(Box, {
            sx: {
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2
            }
          },
            React.createElement(Typography, { variant: 'h6' }, 'Total (excl. VAT):'),
            React.createElement(Typography, { variant: 'h6' }, 
              `£${calculateTotal().toLocaleString()}`
            )
          )
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Turnaround Date',
            type: 'date',
            value: formData.turnaroundDate,
            onChange: handleChange('turnaroundDate'),
            required: true,
            InputLabelProps: { shrink: true }
          })
        )
      )
    ),
    React.createElement(DialogActions, null,
      React.createElement(Button, {
        onClick: onClose
      }, 'Cancel'),
      React.createElement(Button, {
        variant: 'contained',
        onClick: handleSubmit
      }, 'Save Changes')
    )
  );
}

// Add Project Dialog Component
function AddProjectDialog({ open, onClose, onAdd }) {
  const [formData, setFormData] = React.useState({
    surveyType: '',
    organization: '',
    contact: '',
    email: '',
    siteVisitDate: '',
    firstDraftDate: '',
    finalReportDate: '',
    notes: '',
    multipleDates: false
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    const newProject = {
      id: String(Date.now()),
      ...formData,
      status: 'in_progress'
    };
    onAdd(newProject);
    onClose();
  };

  return React.createElement(Dialog, {
    open,
    onClose,
    maxWidth: 'md',
    fullWidth: true
  },
    React.createElement(DialogTitle, null, 'Add New Instructed Survey'),
    React.createElement(DialogContent, null,
      React.createElement(Grid, {
        container: true,
        spacing: 2,
        sx: { mt: 1 }
      },
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Survey Type',
            value: formData.surveyType,
            onChange: handleChange('surveyType'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Organisation',
            value: formData.organization,
            onChange: handleChange('organization'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Name',
            value: formData.contact,
            onChange: handleChange('contact'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 6 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Contact Email',
            type: 'email',
            value: formData.email,
            onChange: handleChange('email'),
            required: true
          })
        ),
        React.createElement(Grid, { item: true, xs: 4 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Site Visit Date',
            type: 'date',
            value: formData.siteVisitDate,
            onChange: handleChange('siteVisitDate'),
            required: true,
            InputLabelProps: { shrink: true }
          })
        ),
        React.createElement(Grid, { item: true, xs: 4 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'First Draft Expected',
            type: 'date',
            value: formData.firstDraftDate,
            onChange: handleChange('firstDraftDate'),
            required: true,
            InputLabelProps: { shrink: true }
          })
        ),
        React.createElement(Grid, { item: true, xs: 4 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Final Report Expected',
            type: 'date',
            value: formData.finalReportDate,
            onChange: handleChange('finalReportDate'),
            required: true,
            InputLabelProps: { shrink: true }
          })
        ),
        React.createElement(Grid, { item: true, xs: 12 },
          React.createElement(TextField, {
            fullWidth: true,
            label: 'Notes',
            value: formData.notes,
            onChange: handleChange('notes'),
            multiline: true,
            rows: 3
          })
        )
      )
    ),
    React.createElement(DialogActions, null,
      React.createElement(Button, {
        onClick: onClose
      }, 'Cancel'),
      React.createElement(Button, {
        variant: 'contained',
        onClick: handleSubmit
      }, 'Add Survey')
    )
  );
}

// Add Notes Dialog Component before AddProjectDialog
function NotesDialog({ open, onClose, notes, onSave }) {
  const [editedNotes, setEditedNotes] = React.useState(notes);

  React.useEffect(() => {
    setEditedNotes(notes);
  }, [notes]);

  const handleSave = () => {
    onSave(editedNotes);
    onClose();
  };

  return React.createElement(Dialog, {
    open,
    onClose,
    maxWidth: 'sm',
    fullWidth: true
  },
    React.createElement(DialogTitle, null, 'Edit Notes'),
    React.createElement(DialogContent, null,
      React.createElement(TextField, {
        fullWidth: true,
        multiline: true,
        rows: 4,
        value: editedNotes,
        onChange: (e) => setEditedNotes(e.target.value),
        sx: { mt: 1 }
      })
    ),
    React.createElement(DialogActions, null,
      React.createElement(Button, {
        onClick: onClose
      }, 'Cancel'),
      React.createElement(Button, {
        variant: 'contained',
        onClick: handleSave
      }, 'Save')
    )
  );
}

// Basic React component
function App() {
  const [tabValue, setTabValue] = React.useState(0);
  const [quotes, setQuotes] = React.useState(initialQuotes);
  const [projects, setProjects] = React.useState(initialProjects);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedQuote, setSelectedQuote] = React.useState(null);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [calendarNotes, setCalendarNotes] = React.useState({});
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState({});
  const [notesDialogOpen, setNotesDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  
  // Calculate first day of month for calendar
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Update reviews when projects change
  React.useEffect(() => {
    const newReviews = { ...reviews };
    
    // Add new reviews for instructed projects
    projects.forEach(project => {
      if (!newReviews[project.organization]) {
        newReviews[project.organization] = {
          id: project.organization,
          name: project.contact,
          organization: project.organization,
          quality: 0,
          responsiveness: 0,
          deliveredOnTime: 0,
          overallReview: 0,
          notes: '',
          email: project.email
        };
      }
    });

    // Remove reviews for organizations that no longer have instructed projects
    Object.keys(newReviews).forEach(org => {
      if (!projects.some(project => project.organization === org)) {
        delete newReviews[org];
      }
    });

    setReviews(newReviews);
  }, [projects]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInstructionChange = (quoteId, value) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        const updatedQuote = {
          ...quote,
          instruction: value,
          status: value === 'yes' ? 'instructed' : value === 'no' ? 'not_instructed' : 'pending'
        };

        // If the quote is being instructed, automatically create a project
        if (value === 'yes') {
          const newProject = {
            id: String(Date.now()),
            surveyType: `${quote.discipline} - ${quote.surveyType}`,
            organization: quote.organization,
            contact: quote.contact,
            email: quote.email,
            siteVisitDate: '',
            firstDraftDate: '',
            finalReportDate: '',
            status: 'in_progress',
            notes: `Instructed from quote #${quote.id}`,
            quoteId: quote.id
          };
          setProjects(prev => [...prev, newProject]);
        } else if (value === 'no' || value === 'pending') {
          // If a quote is un-instructed, remove its corresponding project
          setProjects(prev => prev.filter(project => project.quoteId !== quoteId));
        }

        return updatedQuote;
      }
      return quote;
    }));
  };

  const handleAddQuote = (newQuote) => {
    setQuotes([...quotes, newQuote]);
  };

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleProjectStatusChange = (projectId, newStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };

  const handleDateChange = (projectId, dateField) => (event) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, [dateField]: event.target.value }
        : project
    ));
  };

  const handleEditQuote = (updatedQuote) => {
    setQuotes(quotes.map(quote => 
      quote.id === updatedQuote.id ? updatedQuote : quote
    ));
  };

  const handleDeleteQuote = (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(quotes.filter(quote => quote.id !== quoteId));
    }
  };

  const handleAddCalendarNote = (date, note, isTargetDate, isReportsIn) => {
    if (!note.trim() && !isTargetDate && !isReportsIn) return;
    
    const dateStr = date.toISOString().split('T')[0];
    setCalendarNotes(prev => ({
      ...prev,
      [dateStr]: [...(prev[dateStr] || []), { 
        text: note, 
        id: Date.now(),
        isTargetDate,
        isReportsIn
      }]
    }));
  };

  const handleDeleteCalendarNote = (date, noteId) => {
    const dateStr = date.toISOString().split('T')[0];
    setCalendarNotes(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter(note => note.id !== noteId)
    }));
  };

  // Add Note Dialog Component
  const AddNoteDialog = ({ open, onClose, date }) => {
    const [note, setNote] = React.useState('');
    const [isTargetDate, setIsTargetDate] = React.useState(false);
    const [isReportsIn, setIsReportsIn] = React.useState(false);

    const handleSubmit = () => {
      handleAddCalendarNote(date, note, isTargetDate, isReportsIn);
      setNote('');
      setIsTargetDate(false);
      setIsReportsIn(false);
      onClose();
    };

    return React.createElement(Dialog, {
      open,
      onClose,
      maxWidth: 'sm',
      fullWidth: true
    },
      React.createElement(DialogTitle, null, 
        `Add Note for ${date ? date.toLocaleDateString() : ''}`
      ),
      React.createElement(DialogContent, null,
        React.createElement(Box, {
          sx: { 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1
          }
        },
          React.createElement(Box, {
            sx: {
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }
          },
            React.createElement(Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            },
              React.createElement('input', {
                type: 'checkbox',
                id: 'targetDate',
                checked: isTargetDate,
                onChange: (e) => setIsTargetDate(e.target.checked)
              }),
              React.createElement('label', {
                htmlFor: 'targetDate'
              }, 'Target Submission Date')
            ),
            React.createElement(Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            },
              React.createElement('input', {
                type: 'checkbox',
                id: 'reportsIn',
                checked: isReportsIn,
                onChange: (e) => setIsReportsIn(e.target.checked)
              }),
              React.createElement('label', {
                htmlFor: 'reportsIn'
              }, 'All Reports In')
            )
          ),
          React.createElement(TextField, {
            fullWidth: true,
            multiline: true,
            rows: 3,
            label: 'Note (optional)',
            value: note,
            onChange: (e) => setNote(e.target.value),
          })
        )
      ),
      React.createElement(DialogActions, null,
        React.createElement(Button, {
          onClick: onClose
        }, 'Cancel'),
        React.createElement(Button, {
          variant: 'contained',
          onClick: handleSubmit,
          disabled: !note.trim() && !isTargetDate && !isReportsIn
        }, 'Add Note')
      )
    );
  };

  const handleRatingChange = (organization, field, value) => {
    setReviews(prev => ({
      ...prev,
      [organization]: {
        ...prev[organization],
        [field]: value
      }
    }));
  };

  const handleNotesChange = (projectId, newNotes) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, notes: newNotes } : project
    ));
  };

  // Star Rating Component
  const StarRating = ({ value, onChange }) => {
    const [hover, setHover] = React.useState(-1);
    
    return React.createElement(Box, {
      sx: {
        display: 'flex',
        justifyContent: 'center',
        gap: 0.5
      }
    },
      Array.from({ length: 5 }, (_, i) =>
        React.createElement(Typography, {
          key: i,
          onClick: () => onChange(i + 1),
          onMouseEnter: () => setHover(i),
          onMouseLeave: () => setHover(-1),
          color: i <= (hover !== -1 ? hover : value - 1) ? 'primary' : 'text.disabled',
          sx: { 
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.2)'
            },
            transition: 'transform 0.2s'
          }
        }, '★')
      )
    );
  };

  return React.createElement(Container, { maxWidth: 'xl' },
    // Tabs
    React.createElement(Box, { 
      sx: { 
        borderBottom: 1, 
        borderColor: 'divider',
        mb: 3
      }
    },
      React.createElement(Tabs, {
        value: tabValue,
        onChange: handleTabChange
      },
        React.createElement(Tab, { label: 'Quotes' }),
        React.createElement(Tab, { label: 'Instructed Surveys' }),
        React.createElement(Tab, { label: 'Calendar' }),
        React.createElement(Tab, { label: 'Project Info' }),
        React.createElement(Tab, { label: 'Surveyor Review' })
      )
    ),

    // Quotes Panel
    React.createElement(TabPanel, { value: tabValue, index: 0 },
      React.createElement(Paper, { sx: { p: 2 } },
        React.createElement(Box, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        },
          React.createElement(Typography, { variant: 'h6' }, 'Surveyor Quotes'),
          React.createElement(Button, {
            variant: 'contained',
            onClick: () => setAddDialogOpen(true)
          }, 'Add Quote')
        ),
        React.createElement(AddQuoteDialog, {
          open: addDialogOpen,
          onClose: () => setAddDialogOpen(false),
          onAdd: handleAddQuote
        }),
        React.createElement(EditQuoteDialog, {
          open: editDialogOpen,
          onClose: () => {
            setEditDialogOpen(false);
            setSelectedQuote(null);
          },
          onEdit: handleEditQuote,
          quote: selectedQuote
        }),
        React.createElement(TableContainer, null,
          React.createElement(Table, { size: 'small' },
            React.createElement(TableHead, null,
              React.createElement(TableRow, null,
                React.createElement(TableCell, null, 'Discipline'),
                React.createElement(TableCell, null, 'Survey Type'),
                React.createElement(TableCell, null, 'Organisation'),
                React.createElement(TableCell, null, 'Contact'),
                React.createElement(TableCell, null, 'Email'),
                React.createElement(TableCell, null, 'Line Items'),
                React.createElement(TableCell, { align: 'right' }, 'Total (excl. VAT)'),
                React.createElement(TableCell, { align: 'center' }, 'Turnaround Date'),
                React.createElement(TableCell, { align: 'center' }, 'Status'),
                React.createElement(TableCell, { align: 'center' }, 'Instruct'),
                React.createElement(TableCell, { align: 'center' }, 'Actions')
              )
            ),
            React.createElement(TableBody, null,
              quotes.map(quote => 
                React.createElement(TableRow, { key: quote.id },
                  React.createElement(TableCell, null, quote.discipline),
                  React.createElement(TableCell, null, quote.surveyType),
                  React.createElement(TableCell, null, quote.organization),
                  React.createElement(TableCell, null, quote.contact),
                  React.createElement(TableCell, null, quote.email),
                  React.createElement(TableCell, null,
                    React.createElement(Box, { 
                      sx: { 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden'
                      } 
                    },
                      React.createElement(Table, {
                        size: 'small',
                        sx: {
                          '& td': {
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            padding: '4px 8px',
                          },
                          '& tr:last-child td': {
                            borderBottom: 'none'
                          }
                        }
                      },
                        React.createElement(TableBody, null,
                          quote.lineItems.map((item, index) =>
                            React.createElement(TableRow, {
                              key: index
                            },
                              React.createElement(TableCell, {
                                sx: {
                                  width: '70%',
                                  borderRight: '1px solid',
                                  borderColor: 'divider'
                                }
                              }, item.description),
                              React.createElement(TableCell, {
                                align: 'right',
                                sx: {
                                  width: '30%',
                                  whiteSpace: 'nowrap'
                                }
                              }, `£${item.amount.toLocaleString()}`)
                            )
                          )
                        )
                      )
                    )
                  ),
                  React.createElement(TableCell, { align: 'right' }, 
                    `£${quote.lineItems.reduce((sum, item) => 
                      sum + item.amount, 0
                    ).toLocaleString()}`
                  ),
                  React.createElement(TableCell, { align: 'center' }, 
                    quote.turnaroundDate ? new Date(quote.turnaroundDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : ''
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(StatusChip, { status: quote.status })
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(Select, {
                      value: quote.instruction,
                      size: 'small',
                      onChange: (e) => handleInstructionChange(quote.id, e.target.value),
                      sx: { minWidth: 100 }
                    },
                      React.createElement(MenuItem, { value: 'pending' }, 'Pending'),
                      React.createElement(MenuItem, { value: 'yes' }, 'Instructed'),
                      React.createElement(MenuItem, { value: 'no' }, 'Not Instructed')
                    )
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(Box, {
                      sx: {
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'center'
                      }
                    },
                      React.createElement(IconButton, {
                        size: 'small',
                        onClick: () => {
                          setSelectedQuote(quote);
                          setEditDialogOpen(true);
                        },
                        title: 'Edit Quote'
                      }, '✎'),
                      React.createElement(IconButton, {
                        size: 'small',
                        onClick: () => handleDeleteQuote(quote.id),
                        color: 'error',
                        title: 'Delete Quote'
                      }, '×')
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Projects Panel
    React.createElement(TabPanel, { value: tabValue, index: 1 },
      React.createElement(Paper, { sx: { p: 2 } },
        React.createElement(Box, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        },
          React.createElement(Typography, { variant: 'h6' }, 'Instructed Surveys'),
          React.createElement(Button, {
            variant: 'contained',
            onClick: () => setAddProjectDialogOpen(true)
          }, 'Add Survey')
        ),
        React.createElement(AddProjectDialog, {
          open: addProjectDialogOpen,
          onClose: () => setAddProjectDialogOpen(false),
          onAdd: handleAddProject
        }),
        React.createElement(NotesDialog, {
          open: notesDialogOpen,
          onClose: () => {
            setNotesDialogOpen(false);
            setSelectedProject(null);
          },
          notes: selectedProject?.notes || '',
          onSave: (newNotes) => handleNotesChange(selectedProject.id, newNotes)
        }),
        React.createElement(TableContainer, null,
          React.createElement(Table, { size: 'small' },
            React.createElement(TableHead, null,
              React.createElement(TableRow, null,
                React.createElement(TableCell, null, 'Survey'),
                React.createElement(TableCell, null, 'Organisation'),
                React.createElement(TableCell, null, 'Contact'),
                React.createElement(TableCell, { align: 'center' }, 'Site Visit Date'),
                React.createElement(TableCell, { align: 'center' }, 'First Draft Expected'),
                React.createElement(TableCell, { align: 'center' }, 'Final Report Expected'),
                React.createElement(TableCell, { align: 'center' }, 'Status'),
                React.createElement(TableCell, null, 'Notes')
              )
            ),
            React.createElement(TableBody, null,
              projects.map(project => 
                React.createElement(TableRow, { key: project.id },
                  React.createElement(TableCell, null, project.surveyType),
                  React.createElement(TableCell, null, project.organization),
                  React.createElement(TableCell, null, 
                    React.createElement(Typography, { variant: 'body2' }, project.contact),
                    React.createElement(Typography, { variant: 'caption', color: 'textSecondary' }, 
                      project.email
                    )
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(Box, {
                      sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'center'
                      }
                    },
                      React.createElement(TextField, {
                        type: 'date',
                        value: project.siteVisitDate,
                        onChange: handleDateChange(project.id, 'siteVisitDate'),
                        size: 'small',
                        InputProps: { sx: { width: '140px' } },
                        InputLabelProps: { shrink: true }
                      }),
                      React.createElement(Box, {
                        sx: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }
                      },
                        React.createElement('input', {
                          type: 'checkbox',
                          id: `multiple-dates-${project.id}`,
                          checked: project.multipleDates || false,
                          onChange: (e) => {
                            setProjects(projects.map(p => 
                              p.id === project.id 
                                ? { ...p, multipleDates: e.target.checked }
                                : p
                            ));
                          }
                        }),
                        React.createElement('label', {
                          htmlFor: `multiple-dates-${project.id}`,
                          style: { fontSize: '0.875rem' }
                        }, 'Multiple Dates')
                      )
                    )
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(TextField, {
                      type: 'date',
                      value: project.firstDraftDate,
                      onChange: handleDateChange(project.id, 'firstDraftDate'),
                      size: 'small',
                      InputProps: { sx: { width: '140px' } },
                      InputLabelProps: { shrink: true }
                    })
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(TextField, {
                      type: 'date',
                      value: project.finalReportDate,
                      onChange: handleDateChange(project.id, 'finalReportDate'),
                      size: 'small',
                      InputProps: { sx: { width: '140px' } },
                      InputLabelProps: { shrink: true }
                    })
                  ),
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(Select, {
                      value: project.status,
                      size: 'small',
                      onChange: (e) => handleProjectStatusChange(project.id, e.target.value),
                      renderValue: (value) => React.createElement(ProjectStatusChip, { status: value }),
                      sx: { minWidth: 120 }
                    },
                      React.createElement(MenuItem, { value: 'in_progress' }, 'In Progress'),
                      React.createElement(MenuItem, { value: 'works_completed' }, 'Works Completed')
                    )
                  ),
                  React.createElement(TableCell, null,
                    React.createElement(Box, {
                      sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        maxWidth: '200px'
                      }
                    },
                      React.createElement(Typography, {
                        sx: {
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxHeight: '20px',
                          lineHeight: '20px'
                        }
                      }, project.notes || ''),
                      React.createElement(IconButton, {
                        size: 'small',
                        onClick: (e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setNotesDialogOpen(true);
                        },
                        title: 'Edit Notes',
                        sx: { ml: 'auto' }
                      }, '✎')
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Calendar Panel
    React.createElement(TabPanel, { value: tabValue, index: 2 },
      React.createElement(Paper, { sx: { p: 2 } },
        React.createElement(Box, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        },
          React.createElement(Typography, { variant: 'h6' }, 'Calendar View'),
          React.createElement(Box, {
            display: 'flex',
            gap: 1
          },
            React.createElement(Button, {
              onClick: () => {
                const today = new Date();
                setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
              },
              variant: 'outlined',
              size: 'small'
            }, 'Today'),
            React.createElement(Button, {
              onClick: () => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
              },
              variant: 'outlined',
              size: 'small'
            }, '←'),
            React.createElement(Typography, {
              variant: 'h6',
              sx: { mx: 2 }
            }, currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })),
            React.createElement(Button, {
              onClick: () => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
              },
              variant: 'outlined',
              size: 'small'
            }, '→')
          )
        ),
        React.createElement(Box, {
          sx: { 
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            mt: 2,
            maxWidth: '1000px',
            margin: '0 auto',
            '& > *': {
              aspectRatio: '1',
            }
          }
        },
          // Days of week header
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day =>
            React.createElement(Box, {
              key: day,
              sx: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 'unset',
                pb: 1
              }
            },
              React.createElement(Typography, {
                variant: 'subtitle2',
                sx: { fontWeight: 'bold' }
              }, day)
            )
          ),
          // Calendar days
          Array.from({ length: 42 }, (_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1 - firstDayOfMonth + i);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const dateStr = date.toISOString().split('T')[0];
            
            // Find events for this date
            const dayEvents = projects.reduce((acc, project) => {
              if (project.siteVisitDate === dateStr) {
                acc.push({ type: 'Site Visit', project });
              }
              if (project.firstDraftDate === dateStr) {
                acc.push({ type: 'First Draft Due', project });
              }
              if (project.finalReportDate === dateStr) {
                acc.push({ type: 'Final Report Due', project });
              }
              return acc;
            }, []);

            // Get manual notes for this date
            const dateNotes = calendarNotes[dateStr] || [];
            const hasTargetDate = dateNotes.some(note => note.isTargetDate);

            return React.createElement(Paper, {
              key: i,
              onClick: () => {
                setSelectedDate(date);
                setAddNoteDialogOpen(true);
              },
              sx: {
                p: 1,
                bgcolor: hasTargetDate ? '#ffebee' :
                        isToday ? '#e3f2fd' : 
                        isCurrentMonth ? 'white' : '#f5f5f5',
                opacity: isCurrentMonth ? 1 : 0.5,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: hasTargetDate ? '#ffcdd2' : '#f5f5f5'
                },
                borderColor: hasTargetDate ? '#ef5350' : 'divider',
                borderWidth: hasTargetDate ? 2 : 1,
                borderStyle: 'solid'
              }
            },
              React.createElement(Typography, {
                variant: 'caption',
                sx: { 
                  fontWeight: isToday ? 'bold' : 'normal',
                  mb: 0.5
                }
              }, date.getDate()),
              React.createElement(Box, {
                sx: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  flex: 1,
                  overflow: 'auto'
                }
              },
                dayEvents.map((event, eventIndex) =>
                  React.createElement(Chip, {
                    key: `event-${eventIndex}`,
                    label: `${event.type} - ${event.project.organization}`,
                    size: 'small',
                    sx: {
                      width: '100%',
                      height: 'auto',
                      padding: '4px 0',
                      backgroundColor: 
                        event.type === 'Site Visit' ? '#e8f5e9' :
                        event.type === 'First Draft Due' ? '#fff3e0' :
                        '#e1f5fe',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        display: 'block',
                        padding: '4px 8px',
                        lineHeight: 1.2
                      }
                    }
                  })
                ),
                dateNotes.map((note) =>
                  React.createElement(Chip, {
                    key: `note-${note.id}`,
                    label: note.text || (note.isTargetDate ? 'Target Submission Date' : 'Reports In'),
                    size: 'small',
                    onDelete: (e) => {
                      e.stopPropagation();
                      handleDeleteCalendarNote(date, note.id);
                    },
                    sx: {
                      width: '100%',
                      height: 'auto',
                      padding: '4px 0',
                      backgroundColor: note.isTargetDate ? '#ffcdd2' : 
                                     note.isReportsIn ? '#c8e6c9' : 
                                     '#f3e5f5',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        display: 'block',
                        padding: '4px 8px',
                        lineHeight: 1.2
                      }
                    }
                  })
                )
              )
            );
          })
        ),
        // Add note dialog
        React.createElement(AddNoteDialog, {
          open: addNoteDialogOpen,
          onClose: () => {
            setAddNoteDialogOpen(false);
            setSelectedDate(null);
          },
          date: selectedDate
        }),
        // Legend (update to include manual notes)
        React.createElement(Box, {
          sx: { mt: 2, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }
        },
          React.createElement(Chip, {
            size: 'small',
            label: 'Site Visit',
            sx: { backgroundColor: '#e8f5e9' }
          }),
          React.createElement(Chip, {
            size: 'small',
            label: 'First Draft Due',
            sx: { backgroundColor: '#fff3e0' }
          }),
          React.createElement(Chip, {
            size: 'small',
            label: 'Final Report Due',
            sx: { backgroundColor: '#e1f5fe' }
          }),
          React.createElement(Chip, {
            size: 'small',
            label: 'Target Submission Date',
            sx: { backgroundColor: '#ffcdd2' }
          }),
          React.createElement(Chip, {
            size: 'small',
            label: 'All Reports In',
            sx: { backgroundColor: '#c8e6c9' }
          }),
          React.createElement(Chip, {
            size: 'small',
            label: 'Manual Note',
            sx: { backgroundColor: '#f3e5f5' }
          })
        )
      )
    ),

    // Project Info Panel
    React.createElement(TabPanel, { value: tabValue, index: 3 },
      React.createElement(Paper, { sx: { p: 2 } },
        React.createElement(Box, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        },
          React.createElement(Typography, { variant: 'h6' }, 'Project Information'),
          React.createElement(Button, {
            variant: 'contained',
            onClick: () => {
              // TODO: Implement file upload
              alert('File upload functionality to be implemented');
            }
          }, 'Upload File')
        ),
        React.createElement(Grid, { container: true, spacing: 3 },
          // Project Specifications Section
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(Paper, { sx: { p: 2 } },
              React.createElement(Typography, { variant: 'h6', sx: { mb: 2 } }, 'Project Specifications'),
              React.createElement(Box, { sx: { mb: 2 } },
                React.createElement(TextField, {
                  fullWidth: true,
                  label: 'Project Title',
                  multiline: true,
                  rows: 1,
                  sx: { mb: 2 }
                }),
                React.createElement(TextField, {
                  fullWidth: true,
                  label: 'Project Description',
                  multiline: true,
                  rows: 4,
                  sx: { mb: 2 }
                }),
                React.createElement(TextField, {
                  fullWidth: true,
                  label: 'Property Details',
                  multiline: true,
                  rows: 4,
                  sx: { mb: 2 }
                }),
                React.createElement(TextField, {
                  fullWidth: true,
                  label: 'Additional Notes',
                  multiline: true,
                  rows: 4
                })
              )
            )
          ),
          // File Management Section
          React.createElement(Grid, { item: true, xs: 12, md: 6 },
            React.createElement(Paper, { sx: { p: 2 } },
              React.createElement(Typography, { variant: 'h6', sx: { mb: 2 } }, 'Project Files'),
              React.createElement(Box, {
                sx: {
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  mb: 2
                }
              },
                React.createElement(Typography, { color: 'textSecondary', sx: { mb: 1 } },
                  'Drag and drop files here or click to browse'
                ),
                React.createElement(Button, {
                  variant: 'outlined',
                  onClick: () => {
                    // TODO: Implement file upload
                    alert('File upload functionality to be implemented');
                  }
                }, 'Browse Files')
              ),
              React.createElement(Typography, { variant: 'subtitle1', sx: { mb: 1 } }, 'Uploaded Files'),
              React.createElement(TableContainer, null,
                React.createElement(Table, { size: 'small' },
                  React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                      React.createElement(TableCell, null, 'File Name'),
                      React.createElement(TableCell, null, 'Type'),
                      React.createElement(TableCell, { align: 'right' }, 'Size'),
                      React.createElement(TableCell, { align: 'right' }, 'Upload Date'),
                      React.createElement(TableCell, { align: 'center' }, 'Actions')
                    )
                  ),
                  React.createElement(TableBody, null,
                    // Sample file entries
                    React.createElement(TableRow, null,
                      React.createElement(TableCell, null, 'Property_Photos.zip'),
                      React.createElement(TableCell, null, 'Archive'),
                      React.createElement(TableCell, { align: 'right' }, '2.5 MB'),
                      React.createElement(TableCell, { align: 'right' }, '2024-03-20'),
                      React.createElement(TableCell, { align: 'center' },
                        React.createElement(Box, {
                          sx: {
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center'
                          }
                        },
                          React.createElement(IconButton, {
                            size: 'small',
                            title: 'Download'
                          }, '⬇️'),
                          React.createElement(IconButton, {
                            size: 'small',
                            title: 'Delete',
                            color: 'error'
                          }, '×')
                        )
                      )
                    ),
                    React.createElement(TableRow, null,
                      React.createElement(TableCell, null, 'Survey_Report.pdf'),
                      React.createElement(TableCell, null, 'PDF'),
                      React.createElement(TableCell, { align: 'right' }, '1.2 MB'),
                      React.createElement(TableCell, { align: 'right' }, '2024-03-19'),
                      React.createElement(TableCell, { align: 'center' },
                        React.createElement(Box, {
                          sx: {
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center'
                          }
                        },
                          React.createElement(IconButton, {
                            size: 'small',
                            title: 'Download'
                          }, '⬇️'),
                          React.createElement(IconButton, {
                            size: 'small',
                            title: 'Delete',
                            color: 'error'
                          }, '×')
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Surveyor Review Panel
    React.createElement(TabPanel, { value: tabValue, index: 4 },
      React.createElement(Paper, { sx: { p: 2 } },
        React.createElement(Box, {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        },
          React.createElement(Typography, { variant: 'h6' }, 'Surveyor Performance Review'),
          React.createElement(Button, {
            variant: 'contained',
            onClick: () => {
              // TODO: Implement add review functionality
              alert('Add review functionality to be implemented');
            }
          }, 'Add Review')
        ),
        React.createElement(TableContainer, null,
          React.createElement(Table, { size: 'small' },
            React.createElement(TableHead, null,
              React.createElement(TableRow, null,
                React.createElement(TableCell, null, 'Surveyor Name'),
                React.createElement(TableCell, null, 'Organization'),
                React.createElement(TableCell, { align: 'center' }, 'Quality'),
                React.createElement(TableCell, { align: 'center' }, 'Responsiveness'),
                React.createElement(TableCell, { align: 'center' }, 'Delivered on Time'),
                React.createElement(TableCell, { align: 'center' }, 'Overall Review'),
                React.createElement(TableCell, null, 'Notes')
              )
            ),
            React.createElement(TableBody, null,
              Object.values(reviews).map(review =>
                React.createElement(TableRow, { key: review.id },
                  React.createElement(TableCell, null, review.name),
                  React.createElement(TableCell, null, review.organization),
                  // Quality Rating
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(StarRating, {
                      value: review.quality,
                      onChange: (value) => handleRatingChange(review.organization, 'quality', value)
                    })
                  ),
                  // Responsiveness Rating
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(StarRating, {
                      value: review.responsiveness,
                      onChange: (value) => handleRatingChange(review.organization, 'responsiveness', value)
                    })
                  ),
                  // Delivered on Time Rating
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(StarRating, {
                      value: review.deliveredOnTime,
                      onChange: (value) => handleRatingChange(review.organization, 'deliveredOnTime', value)
                    })
                  ),
                  // Overall Review
                  React.createElement(TableCell, { align: 'center' },
                    React.createElement(StarRating, {
                      value: review.overallReview,
                      onChange: (value) => handleRatingChange(review.organization, 'overallReview', value)
                    })
                  ),
                  React.createElement(TableCell, null,
                    React.createElement(TextField, {
                      fullWidth: true,
                      multiline: true,
                      rows: 2,
                      value: review.notes,
                      onChange: (e) => handleNotesChange(review.organization, e.target.value),
                      variant: 'outlined',
                      size: 'small'
                    })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App)); 