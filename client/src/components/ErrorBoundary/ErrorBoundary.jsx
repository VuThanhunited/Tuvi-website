import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to error tracking service (e.g., Sentry)
    if (window.errorTracker) {
      window.errorTracker.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" style={styles.container}>
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>

            <h1 style={styles.title}>Có lỗi xảy ra</h1>

            <p style={styles.message}>
              Xin lỗi, ứng dụng gặp sự cố. Vui lòng thử lại.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details style={styles.details}>
                <summary style={styles.summary}>Chi tiết lỗi (Development)</summary>
                <pre style={styles.pre}>
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button
                onClick={this.resetError}
                style={styles.buttonPrimary}
              >
                Thử lại
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={styles.buttonSecondary}
              >
                Về trang chủ
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p style={styles.warning}>
                Ứng dụng gặp lỗi nhiều lần. Vui lòng làm mới trang hoặc liên hệ hỗ trợ.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  content: {
    maxWidth: '500px',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '48px',
    display: 'block',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  message: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  details: {
    marginBottom: '20px',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '4px',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '10px',
  },
  pre: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '12px',
    color: '#d9534f',
    maxHeight: '200px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  buttonPrimary: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  warning: {
    fontSize: '12px',
    color: '#d9534f',
    backgroundColor: '#f2dede',
    padding: '10px',
    borderRadius: '4px',
  },
};

export default ErrorBoundary;
