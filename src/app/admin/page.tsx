'use client';

import React, { useState, useEffect } from 'react';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  instagramUrl: string;
  mediaUrl: string;
  type: string;
}

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Portfolio management states
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Automotive');
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);

  // Check auth session on load
  useEffect(() => {
    const isAuth = localStorage.getItem('reel_crafterr_admin');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch portfolio list once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated]);

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        localStorage.setItem('reel_crafterr_admin', 'true');
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError('Connection failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('reel_crafterr_admin');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!title) {
      setSubmitError('Title is required.');
      return;
    }

    if (!file && !instagramUrl) {
      setSubmitError('You must upload a high-quality video/image file or provide an Instagram URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('instagramUrl', instagramUrl);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSubmitSuccess('Portfolio item uploaded successfully!');
        setTitle('');
        setInstagramUrl('');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('portfolio-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        // Reload items list
        fetchItems();
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setSubmitError('Failed to communicate with upload server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed.');
      }
    } catch (err) {
      alert('Failed to connect to server.');
    }
  };

  // Render Login Gate
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard} className="glass-panel">
          <h2 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
            CINEMA <span className="glow-text-gold">VAULT</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#9da3ae', textAlign: 'center', marginBottom: '24px' }}>
            Admin gate for Reel Crafterr portfolio.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.inputField}>
              <label style={styles.label}>Admin ID / Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@reelcrafterr.com"
                required
                style={styles.textInput}
              />
            </div>

            <div style={styles.inputField}>
              <label style={styles.label}>Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.textInput}
              />
            </div>

            {authError && (
              <div style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginTop: '4px' }}>
                ⚠️ {authError}
              </div>
            )}

            <button type="submit" disabled={isLoggingIn} style={styles.loginButton}>
              {isLoggingIn ? 'Decrypting...' : 'Enter Vault'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Main Dashboard
  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
            REEL <span className="glow-text-gold">CRAFTERR</span> ADMIN
          </h1>
          <p style={{ fontSize: '13px', color: '#9da3ae' }}>Manage your high-definition video reels and commercial uploads.</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Exit Panel
        </button>
      </header>

      <div style={styles.dashboardGrid}>
        {/* Upload Form Section */}
        <div style={styles.formSection} className="glass-panel">
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>
            Upload New Cinematic Work
          </h2>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.inputField}>
              <label style={styles.label}>Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mercedes AMG Rolling Shots"
                required
                style={styles.textInput}
              />
            </div>

            <div style={styles.inputField}>
              <label style={styles.label}>Pillar Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.selectInput}
              >
                <option value="Automotive">Automotive</option>
                <option value="Luxury Decor">Luxury Decor</option>
                <option value="Brands">Brands</option>
                <option value="Weddings">Weddings</option>
                <option value="Parties">Parties</option>
              </select>
            </div>

            <div style={styles.inputField}>
              <label style={styles.label}>Instagram Post / Reel URL (Optional)</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="e.g. https://www.instagram.com/reel/DaezrX4hU1I/"
                style={styles.textInput}
              />
              <span style={{ fontSize: '11px', color: '#9da3ae', marginTop: '4px' }}>
                Providing an Instagram link dynamically renders the post widget in the lightbox.
              </span>
            </div>

            <div style={styles.inputField}>
              <label style={styles.label}>Upload High Quality Video/Image File (Optional)</label>
              <input
                type="file"
                id="portfolio-file"
                onChange={handleFileChange}
                accept="video/*,image/*"
                style={styles.fileInput}
              />
              <span style={{ fontSize: '11px', color: '#9da3ae', marginTop: '4px' }}>
                Upload high-res files for direct local HTML5 hosting inside the gallery lightbox.
              </span>
            </div>

            {submitError && (
              <div style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: '600' }}>
                ⚠️ {submitError}
              </div>
            )}

            {submitSuccess && (
              <div style={{ color: '#00e676', fontSize: '13px', fontWeight: '600' }}>
                ✅ {submitSuccess}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
              {isSubmitting ? 'Uploading Cinema...' : 'Upload Asset'}
            </button>
          </form>
        </div>

        {/* Existing Content Management Section */}
        <div style={styles.listSection} className="glass-panel">
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>
            Current Portfolio Catalog ({items.length})
          </h2>

          {isLoadingItems ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9da3ae' }}>Loading catalog...</div>
          ) : (
            <div style={styles.catalogList}>
              {items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.itemThumbWrapper}>
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>{item.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#e5b842', fontWeight: '600' }}>{item.category}</span>
                      <span style={{ color: '#9da3ae', fontSize: '10px' }}>•</span>
                      <span style={{ fontSize: '11px', color: '#9da3ae' }}>
                        {item.instagramUrl ? 'Instagram Embed' : 'Local Host'}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              ))}

              {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#646a73' }}>
                  No items inside database yet. Upload above!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#060608',
    padding: '24px',
    fontFamily: '"Poppins", Arial, sans-serif',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '36px 32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  textInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  selectInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
  },
  fileInput: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '13px',
  },
  loginButton: {
    padding: '14px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    marginTop: '12px',
    boxShadow: '0 8px 20px rgba(229, 184, 66, 0.2)',
  },

  /* Dashboard Styles */
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#060608',
    color: '#ffffff',
    padding: '40px 24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '"Poppins", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '24px',
  },
  logoutBtn: {
    padding: '10px 20px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr',
    gap: '32px',
  },
  formSection: {
    padding: '32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    height: 'fit-content',
  },
  submitButton: {
    padding: '14px',
    borderRadius: '30px',
    backgroundColor: '#e5b842',
    color: '#060608',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 8px 20px rgba(229, 184, 66, 0.2)',
  },
  listSection: {
    padding: '32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  catalogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '650px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  itemThumbWrapper: {
    width: '48px',
    height: '64px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  deleteBtn: {
    padding: '6px 12px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 77, 77, 0.08)',
    border: '1px solid rgba(255, 77, 77, 0.2)',
    color: '#ff4d4d',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
