import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { BugReport as BugReportIcon } from '@mui/icons-material';
import BugReport from './BugReport';

const BugReportButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Report a Bug" placement="left">
        <Fab
          color="error"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#ff6b6b',
            color: 'white',
            zIndex: 1000,
            '&:hover': {
              bgcolor: '#ff5252',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
          }}
        >
          <BugReportIcon />
        </Fab>
      </Tooltip>
      
      <BugReport 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
};

export default BugReportButton;