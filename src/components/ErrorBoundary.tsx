import React, { Component, ErrorInfo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--bg, #1a1a1a)',
            color: 'var(--text-primary, #fff)',
            padding: 4,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              maxWidth: 500,
              padding: 4,
              backgroundColor: 'var(--card-bg, #2a2a2a)',
              borderRadius: 2,
              border: '1px solid var(--border-color, #404040)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #ffa300, #f74d71)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}
            >
              Oops! Something went wrong
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: 'var(--text-secondary, #aaa)',
                lineHeight: 1.6
              }}
            >
              We encountered an unexpected error while loading the GVC Browser. 
              Don't worry, this is usually temporary and can be fixed by refreshing the page.
            </Typography>

            {this.state.error && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#ff6b6b',
                  textAlign: 'left',
                  overflowX: 'auto'
                }}
              >
                {this.state.error.message}
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
              sx={{
                backgroundColor: '#f74d71',
                '&:hover': {
                  backgroundColor: '#f74d71'
                },
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1
              }}
            >
              Refresh Page
            </Button>

            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                mt: 3,
                color: 'var(--text-secondary, #aaa)'
              }}
            >
              If this problem persists, please try clearing your browser cache or contact support.
            </Typography>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;