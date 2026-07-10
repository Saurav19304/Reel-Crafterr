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

interface BookingItem {
  id: number;
  name: string;
  contact: string;
  plan: string;
  date: string;
  brief: string;
  createdAt: string;
}

const isVideoFile = (url: string) => {
  if (!url) return false;
  return url.includes('/video/upload/') || !/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
};

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'catalog' | 'bookings'>('catalog');

  // Portfolio management states
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [uploadMode, setUploadMode] = useState<'asset' | 'cover'>('asset');
  const [customCovers, setCustomCovers] = useState<any[]>([]);
  const [coversFolderOpen, setCoversFolderOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Automotive');
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Client Bookings states
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);

  // Cloudinary credentials states
  const [cloudName, setCloudName] = useState<string>('');
  const [uploadPreset, setUploadPreset] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Check auth session and load credentials on mount
  useEffect(() => {
    const isAuth = localStorage.getItem('reel_crafterr_admin');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
    const savedCloud = localStorage.getItem('reel_crafterr_cloud_name') || '';
    const savedPreset = localStorage.getItem('reel_crafterr_upload_preset') || '';
    setCloudName(savedCloud);
    setUploadPreset(savedPreset);
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('reel_crafterr_cloud_name', cloudName);
    localStorage.setItem('reel_crafterr_upload_preset', uploadPreset);
    alert('Cloudinary Credentials Saved Locally!');
  };

  // Fetch portfolio list or bookings once authenticated and when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'catalog') {
        fetchItems();
        fetchCovers();
      } else {
        fetchBookings();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: 'no-store' });
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

  const fetchCovers = async () => {
    try {
      const res = await fetch(`/api/portfolio?covers=true&t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCustomCovers(data);
      }
    } catch (err) {
      console.error('Failed to fetch covers:', err);
    }
  };

  const handleDeleteCover = async (id: any) => {
    if (!confirm('Are you sure you want to reset this cover page to its default image?')) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      if (res.ok) {
        setCustomCovers((prev) => prev.filter((item) => String(item.id) !== String(id)));
        fetchCovers();
      } else {
        const data = await res.json();
        alert(data.error || 'Reset failed.');
      }
    } catch (err) {
      alert('Failed to connect to server.');
    }
  };

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch(`/api/bookings?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to archive/delete this booking inquiry?')) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
        fetchBookings();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to archive booking.');
      }
    } catch (err) {
      alert('Failed to connect to server.');
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

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const uploadFileToCloudinary = async (
    file: File,
    cloudName: string,
    uploadPreset: string,
    onProgress: (percent: number) => void
  ): Promise<{ secure_url: string; resource_type: string }> => {
    // If the file is smaller than 20MB, do a standard single-shot upload
    const threshold = 20 * 1024 * 1024;
    if (file.size <= threshold) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const errData = JSON.parse(xhr.responseText || '{}');
            reject(new Error(errData.error?.message || 'Cloudinary upload failed.'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during Cloudinary upload.'));

        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);
        xhr.send(fd);
      });
    }

    // Otherwise, perform a chunked upload
    // Cloudinary chunked upload recommends 5MB or larger chunks. Let's use 10MB chunks.
    const chunkSize = 10 * 1024 * 1024;
    const totalSize = file.size;
    const uniqueUploadId = 'cloudinary_chunked_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    let start = 0;
    let lastResult: any = null;

    while (start < totalSize) {
      const end = Math.min(start + chunkSize, totalSize);
      const chunk = file.slice(start, end);

      const chunkResult = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, true);

        xhr.setRequestHeader('X-Unique-Upload-Id', uniqueUploadId);
        xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${totalSize}`);

        const currentStart = start;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const chunkProgress = event.loaded;
            const percent = Math.min(Math.round(((currentStart + chunkProgress) / totalSize) * 100), 99);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const errData = JSON.parse(xhr.responseText || '{}');
            reject(new Error(errData.error?.message || 'Cloudinary chunked upload failed.'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during Cloudinary chunked upload.'));

        const fd = new FormData();
        fd.append('file', chunk);
        fd.append('upload_preset', uploadPreset);
        xhr.send(fd);
      });

      lastResult = chunkResult;
      start = end;
    }

    if (!lastResult || !lastResult.secure_url) {
      throw new Error('Upload completed, but no secure_url returned.');
    }

    return lastResult;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setUploadProgress(null);

    if (!title) {
      setSubmitError('Title is required.');
      return;
    }

    if (!file && !instagramUrl) {
      setSubmitError('You must upload a high-quality video/image file or provide an Instagram/YouTube URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalMediaUrl = '';
      let finalType: 'image' | 'video' = 'image';
      let finalEmbedUrl = instagramUrl || '';

      if (file) {
        if (!cloudName || !uploadPreset) {
          setSubmitError('Please enter and save your Cloudinary Cloud Name and Upload Preset in the credentials section first.');
          setIsSubmitting(false);
          return;
        }

        // Upload directly from browser to Cloudinary and track progress
        const cloudResult = await uploadFileToCloudinary(file, cloudName, uploadPreset, setUploadProgress);

        finalMediaUrl = cloudResult.secure_url;
        finalType = cloudResult.resource_type === 'video' ? 'video' : 'image';
        finalEmbedUrl = ''; // direct uploads don't use Instagram/YouTube embeds
      } else if (instagramUrl) {
        const ytId = getYoutubeId(instagramUrl);
        if (ytId) {
          finalType = 'video';
          // Use YouTube high quality preview thumbnail as preview card
          finalMediaUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
          // Form embed link
          finalEmbedUrl = `https://www.youtube.com/embed/${ytId}`;
        } else {
          // Instagram link: we can determine video/image type and use category thumbnail placeholder
          const isReel = instagramUrl.includes('/reel/') || instagramUrl.includes('/p/');
          finalType = isReel ? 'video' : 'image';
          
          if (category.toLowerCase().includes('automotive')) {
            finalMediaUrl = '/assets/images/car.png';
          } else if (category.toLowerCase().includes('decor') || category.toLowerCase().includes('estate')) {
            finalMediaUrl = '/assets/images/decor.png';
          } else if (category.toLowerCase().includes('wedding')) {
            finalMediaUrl = '/assets/images/wedding.png';
          } else {
            finalMediaUrl = '/assets/images/haldi.png';
          }
          finalEmbedUrl = instagramUrl;
        }
      }

      // POST parameters directly as JSON
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          mediaUrl: finalMediaUrl,
          type: finalType,
          instagramUrl: finalEmbedUrl
        }),
      });

      if (res.ok) {
        setSubmitSuccess('Cinematic item uploaded successfully!');
        setTitle('');
        setInstagramUrl('');
        setFile(null);
        // Reset file input element
        const fileInput = document.getElementById('portfolio-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchItems();
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Upload failed.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to complete media upload.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleUpdateCover = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setUploadProgress(null);

    if (!file && !instagramUrl) {
      setSubmitError('Please upload an image file or provide a direct image URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalMediaUrl = instagramUrl || '';

      if (file) {
        if (!cloudName || !uploadPreset) {
          setSubmitError('Please enter and save your Cloudinary Cloud Name and Upload Preset first.');
          setIsSubmitting(false);
          return;
        }

        // Upload directly from browser to Cloudinary and track progress
        const cloudResult = await uploadFileToCloudinary(file, cloudName, uploadPreset, setUploadProgress);

        finalMediaUrl = cloudResult.secure_url;
      }

      // POST cover parameter to API
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isCover: true,
          category: category.toLowerCase(),
          mediaUrl: finalMediaUrl
        }),
      });

      if (res.ok) {
        setSubmitSuccess(`Cover for "${category}" updated successfully!`);
        setInstagramUrl('');
        setFile(null);
        // Reset file input element
        const fileInput = document.getElementById('portfolio-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchCovers();
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Cover update failed.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to complete cover upload.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
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

  // Grouping items by category for the accordion view
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, PortfolioItem[]>);

  // Render Main Dashboard
  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>
            REEL <span className="glow-text-gold">CRAFTERR</span> ADMIN
          </h1>
          <p style={{ fontSize: '13px', color: '#9da3ae' }}>Manage your high-definition video reels, commercial uploads, and client bookings.</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Exit Panel
        </button>
      </header>

      {/* Tab Selection */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'catalog' ? '2px solid #e5b842' : '2px solid transparent',
            color: activeTab === 'catalog' ? '#e5b842' : '#9da3ae',
            fontWeight: activeTab === 'catalog' ? '700' : '500',
          }}
        >
          Manage Catalog
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            ...styles.tabBtn,
            borderBottom: activeTab === 'bookings' ? '2px solid #e5b842' : '2px solid transparent',
            color: activeTab === 'bookings' ? '#e5b842' : '#9da3ae',
            fontWeight: activeTab === 'bookings' ? '700' : '500',
          }}
        >
          Client Bookings ({bookings.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div style={styles.dashboardGrid}>
          {/* Upload Form Section */}
          <div style={styles.formSection} className="glass-panel">
            <div style={styles.subTabContainer}>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('asset');
                  setSubmitError('');
                  setSubmitSuccess('');
                }}
                style={{
                  ...styles.subTabBtn,
                  borderBottom: uploadMode === 'asset' ? '2px solid #e5b842' : '2px solid transparent',
                  color: uploadMode === 'asset' ? '#e5b842' : '#9da3ae',
                }}
              >
                Upload Work
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('cover');
                  setSubmitError('');
                  setSubmitSuccess('');
                }}
                style={{
                  ...styles.subTabBtn,
                  borderBottom: uploadMode === 'cover' ? '2px solid #e5b842' : '2px solid transparent',
                  color: uploadMode === 'cover' ? '#e5b842' : '#9da3ae',
                }}
              >
                Edit Covers
              </button>
            </div>

            {uploadMode === 'asset' ? (
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                  Upload New Cinematic Work
                </h2>

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
                  <label style={styles.label}>Instagram Reel / YouTube URL (Optional)</label>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="e.g. https://www.instagram.com/reel/... or YouTube URL"
                    style={styles.textInput}
                  />
                  <span style={{ fontSize: '11px', color: '#9da3ae', marginTop: '4px' }}>
                    Providing an Instagram/YouTube link dynamically renders the post or loop video widget in the lightbox.
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
                    Upload high-res raw files from your device. Direct cloud hosting bypasses size limits.
                  </span>
                </div>

                {file && (
                  <div style={styles.credentialsBox}>
                    <h4 style={styles.credentialsHeading}>Cloudinary Integration (Required for Files)</h4>
                    <p style={{ fontSize: '11px', color: '#9da3ae', marginBottom: '12px', lineHeight: '1.4' }}>
                      To host raw files (up to 100MB+) directly on your site, enter your Cloudinary credentials. Once saved, they persist in your local browser!
                    </p>
                    <div style={styles.inputField}>
                      <label style={{ ...styles.label, color: '#e5b842', fontSize: '11px' }}>Cloud Name</label>
                      <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. dkhz7z8z"
                        required
                        style={styles.textInput}
                      />
                    </div>
                    <div style={{ ...styles.inputField, marginTop: '10px' }}>
                      <label style={{ ...styles.label, color: '#e5b842', fontSize: '11px' }}>Upload Preset (Unsigned)</label>
                      <input
                        type="text"
                        value={uploadPreset}
                        onChange={(e) => setUploadPreset(e.target.value)}
                        placeholder="e.g. reel_crafterr_preset"
                        required
                        style={styles.textInput}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleSaveCredentials} 
                      style={styles.saveCredsBtn}
                    >
                      Save Credentials to Browser
                    </button>
                  </div>
                )}

                {uploadProgress !== null && (
                  <div style={styles.progressBox}>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
                    </div>
                    <span style={styles.progressLabel}>Uploading raw file to Cloud... {uploadProgress}%</span>
                  </div>
                )}

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
            ) : (
              <form onSubmit={handleUpdateCover} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                  Update Folder Cover Image
                </h2>

                <div style={styles.inputField}>
                  <label style={styles.label}>Select Category Folder</label>
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
                  <label style={styles.label}>Cover Image URL (Direct image link)</label>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="e.g. https://example.com/cover.jpg"
                    style={styles.textInput}
                  />
                </div>

                <div style={styles.inputField}>
                  <label style={styles.label}>Or Upload Cover Image File</label>
                  <input
                    type="file"
                    id="portfolio-file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={styles.fileInput}
                  />
                  <span style={{ fontSize: '11px', color: '#9da3ae', marginTop: '4px' }}>
                    Upload a custom JPEG/PNG to represent this category folder.
                  </span>
                </div>

                {file && (
                  <div style={styles.credentialsBox}>
                    <h4 style={styles.credentialsHeading}>Cloudinary Integration (Required for Files)</h4>
                    <p style={{ fontSize: '11px', color: '#9da3ae', marginBottom: '12px', lineHeight: '1.4' }}>
                      To upload custom cover images directly, save your Cloudinary settings below.
                    </p>
                    <div style={styles.inputField}>
                      <label style={{ ...styles.label, color: '#e5b842', fontSize: '11px' }}>Cloud Name</label>
                      <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. dkhz7z8z"
                        required
                        style={styles.textInput}
                      />
                    </div>
                    <div style={{ ...styles.inputField, marginTop: '10px' }}>
                      <label style={{ ...styles.label, color: '#e5b842', fontSize: '11px' }}>Upload Preset (Unsigned)</label>
                      <input
                        type="text"
                        value={uploadPreset}
                        onChange={(e) => setUploadPreset(e.target.value)}
                        placeholder="e.g. reel_crafterr_preset"
                        required
                        style={styles.textInput}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleSaveCredentials} 
                      style={styles.saveCredsBtn}
                    >
                      Save Credentials to Browser
                    </button>
                  </div>
                )}

                {uploadProgress !== null && (
                  <div style={styles.progressBox}>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
                    </div>
                    <span style={styles.progressLabel}>Uploading cover to Cloud... {uploadProgress}%</span>
                  </div>
                )}

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
                  {isSubmitting ? 'Uploading Cover...' : 'Update Folder Cover'}
                </button>
              </form>
            )}
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
                {/* Folder Covers Accordion */}
                <div style={styles.folderContainer}>
                  <div
                    onClick={() => setCoversFolderOpen(!coversFolderOpen)}
                    className="folder-header"
                    style={styles.folderHeader}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Photo / Gallery Icon */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#e5b842"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span style={styles.folderTitle}>Folder Cover Pages</span>
                      <span style={styles.folderBadge}>
                        {customCovers.length} custom
                      </span>
                    </div>
                    
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9da3ae"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: coversFolderOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>

                  {coversFolderOpen && (
                    <div style={styles.folderContent}>
                      {['automotive', 'luxury-decor', 'brands', 'weddings', 'parties'].map((catId) => {
                        const customCover = customCovers.find(c => c.category === catId);
                        const defaultCovers: Record<string, string> = {
                          automotive: '/assets/images/car.png',
                          'luxury-decor': '/assets/images/decor.png',
                          brands: '/assets/images/haldi.png',
                          weddings: '/assets/images/wedding.png',
                          parties: '/assets/images/gimbal-hero.png'
                        };
                        const catTitles: Record<string, string> = {
                          automotive: 'Automotive Showcases',
                          'luxury-decor': 'Luxury Decor & Real Estate',
                          brands: 'Brand & Commercial Reels',
                          weddings: 'Premium Weddings',
                          parties: 'Parties (Birthday & Baby Shower)'
                        };
                        const currentCoverUrl = customCover ? customCover.mediaUrl : defaultCovers[catId];

                        return (
                          <div key={catId} style={styles.itemRow}>
                            <div style={styles.itemThumbWrapper}>
                               {isVideoFile(currentCoverUrl) ? (
                                 <video
                                   src={currentCoverUrl}
                                   muted
                                   playsInline
                                   autoPlay
                                   loop
                                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 />
                               ) : (
                                 <img
                                   src={currentCoverUrl}
                                   alt={catTitles[catId]}
                                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                 />
                               )}
                            </div>

                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                                {catTitles[catId]}
                              </h4>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: customCover ? '#e5b842' : '#9da3ae', fontWeight: '600' }}>
                                  {customCover ? 'Custom Cover Image' : 'Default Cover Image'}
                                </span>
                              </div>
                            </div>

                            {customCover && (
                              <button onClick={() => handleDeleteCover(customCover.id)} style={styles.deleteBtn}>
                                Reset
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {Object.keys(groupedItems).map((catName) => {
                  const catItems = groupedItems[catName];
                  const isOpen = !!expandedCategories[catName];
                  return (
                    <div key={catName} style={styles.folderContainer}>
                      <div
                        onClick={() => toggleCategory(catName)}
                        className="folder-header"
                        style={styles.folderHeader}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Folder SVG Icon */}
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#e5b842"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                          </svg>
                          <span style={styles.folderTitle}>{catName}</span>
                          <span style={styles.folderBadge}>
                            {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        
                        {/* Chevron Icon */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9da3ae"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>

                      {isOpen && (
                        <div style={styles.folderContent}>
                          {catItems.map((item) => (
                            <div key={item.id} style={styles.itemRow}>
                              <div style={styles.itemThumbWrapper}>
                                {isVideoFile(item.mediaUrl) ? (
                                  <video
                                    src={item.mediaUrl}
                                    muted
                                    playsInline
                                    autoPlay
                                    loop
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <img
                                    src={item.mediaUrl}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                )}
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
                        </div>
                      )}
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#646a73' }}>
                    No items inside database yet. Upload above!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Render Client Bookings Tab Panel */
        <div style={styles.bookingsContainer} className="glass-panel">
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
            Submitted Client Inquiries
          </h2>
          
          {isLoadingBookings ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9da3ae' }}>Loading bookings...</div>
          ) : (
            <div style={styles.bookingList}>
              {bookings.map((booking) => (
                <div key={booking.id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{booking.name}</h3>
                      <a
                        href={booking.contact.startsWith('@') ? `https://instagram.com/${booking.contact.substring(1)}` : `tel:${booking.contact}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.bookingContactLink}
                      >
                        📞 Contact: {booking.contact}
                      </a>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      style={styles.archiveBtn}
                    >
                      Archive & Resolve
                    </button>
                  </div>

                  <div style={styles.bookingDetailsGrid}>
                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>Plan Selected</span>
                      <span style={styles.detailValue}>{booking.plan}</span>
                    </div>
                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>Target Date</span>
                      <span style={styles.detailValue}>{booking.date}</span>
                    </div>
                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>Submitted At</span>
                      <span style={{ ...styles.detailValue, fontSize: '11px', color: '#9da3ae' }}>{booking.createdAt}</span>
                    </div>
                  </div>

                  <div style={styles.briefBox}>
                    <span style={styles.detailLabel}>Project Brief / Requirements</span>
                    <p style={styles.briefText}>{booking.brief}</p>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#646a73' }}>
                  No active client bookings or inquiries found.
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
  tabContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '8px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bookingsContainer: {
    padding: '32px',
    borderRadius: '24px',
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  bookingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  bookingCard: {
    padding: '24px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '12px',
  },
  bookingContactLink: {
    fontSize: '13px',
    color: '#00f2fe',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  archiveBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(229, 184, 66, 0.1)',
    border: '1px solid rgba(229, 184, 66, 0.2)',
    color: '#e5b842',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  bookingDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#646a73',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: '600',
  },
  briefBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  briefText: {
    fontSize: '13px',
    color: '#e2e8f0',
    lineHeight: '1.6',
    margin: 0,
  },
  credentialsBox: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(229, 184, 66, 0.03)',
    border: '1px dashed rgba(229, 184, 66, 0.2)',
    marginTop: '12px',
  },
  credentialsHeading: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '6px',
  },
  saveCredsBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.2s',
  },
  progressBox: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e5b842',
    transition: 'width 0.1s ease-out',
  },
  progressLabel: {
    fontSize: '11px',
    color: '#e5b842',
    fontWeight: '600',
  },
  folderContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: '16px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  folderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    cursor: 'pointer',
    userSelect: 'none' as const,
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  folderTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
  },
  folderBadge: {
    fontSize: '10px',
    color: '#e5b842',
    backgroundColor: 'rgba(229, 184, 66, 0.08)',
    border: '1px solid rgba(229, 184, 66, 0.15)',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '600' as const,
  },
  folderContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '8px 4px 4px 4px',
  },
  subTabContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '8px',
  },
  subTabBtn: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '600' as const,
  },
};
