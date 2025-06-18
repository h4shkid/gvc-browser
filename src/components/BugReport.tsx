import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { BugReport as BugReportIcon, Close as CloseIcon } from '@mui/icons-material';

interface BugReportProps {
  open: boolean;
  onClose: () => void;
}

const BugReport: React.FC<BugReportProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const botToken = '8186132799:AAGWe7CGfu2Ae-7Vwucj-kRokkusMit9PnE';
      const chatId = '1110540849'; // Your actual Telegram chat ID
      
      // Format the message
      const message = `🐛 New Bug Report from Vibes Collector

📝 Title: ${title}

📋 Description:
${description}

${email ? `📧 Contact: ${email}` : '📧 Contact: Anonymous'}

🌐 From: vibescollector.com
⏰ Time: ${new Date().toLocaleString()}`;

      // Send to Telegram
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTitle('');
        setDescription('');
        setEmail('');
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending bug report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus(null);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--card-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BugReportIcon sx={{ color: '#ff6b6b' }} />
          <Typography variant="h6" component="span">
            Report a Bug
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose} 
          disabled={isSubmitting}
          sx={{ color: 'var(--text-secondary)' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
            Found an issue? Help us improve Vibes Collector by reporting bugs directly to our team.
          </Typography>

          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Bug report sent successfully! We'll look into it soon.
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fill in both title and description fields.
            </Alert>
          )}

          <TextField
            label="Bug Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the issue"
            disabled={isSubmitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'var(--border-color)' },
                '&:hover fieldset': { borderColor: '#f74d71' },
                '&.Mui-focused fieldset': { borderColor: '#f74d71' }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': { color: '#f74d71' }
              }
            }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the bug in detail. Include steps to reproduce, expected behavior, and what actually happened."
            multiline
            rows={4}
            disabled={isSubmitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'var(--border-color)' },
                '&:hover fieldset': { borderColor: '#f74d71' },
                '&.Mui-focused fieldset': { borderColor: '#f74d71' }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': { color: '#f74d71' }
              }
            }}
          />

          <TextField
            label="Email (Optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            disabled={isSubmitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--text-primary)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'var(--border-color)' },
                '&:hover fieldset': { borderColor: '#f74d71' },
                '&.Mui-focused fieldset': { borderColor: '#f74d71' }
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
                '&.Mui-focused': { color: '#f74d71' }
              }
            }}
          />

          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', mt: 1 }}>
            📱 Your report will be sent directly to our development team via Telegram.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid var(--border-color)' }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ color: 'var(--text-secondary)' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <BugReportIcon />}
          sx={{
            bgcolor: '#ff6b6b',
            color: 'white',
            '&:hover': { bgcolor: '#ff5252' },
            '&:disabled': { bgcolor: 'rgba(255, 107, 107, 0.3)' }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BugReport;