import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Phone, CreditCard, Calendar, Edit2, Save, X, ShieldAlert } from 'lucide-react';

interface ProfileData {
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  nic: string;
  birthDate: string;
  preferredBank?: string;
  preferredFiatCurrency?: string;
  preferredDigitalCurrency?: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name,
          contactNumber: data.contactNumber,
          nic: data.nic,
          birthDate: data.birthDate,
          preferredBank: data.preferredBank,
          preferredFiatCurrency: data.preferredFiatCurrency,
          preferredDigitalCurrency: data.preferredDigitalCurrency
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      // 1. Update Profile info
      const response = await fetch('http://localhost:8080/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          contactNumber: formData.contactNumber,
          nic: formData.nic,
          birthDate: formData.birthDate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // 2. Update Preferences
      const prefResponse = await fetch('http://localhost:8080/api/v1/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          preferredBank: formData.preferredBank,
          preferredFiatCurrency: formData.preferredFiatCurrency,
          preferredDigitalCurrency: formData.preferredDigitalCurrency
        })
      });

      if (!prefResponse.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedProfile = await prefResponse.json();
      setProfile(updatedProfile);
      updateUser({ name: updatedProfile.name }); // Update context
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 text-center text-white min-h-screen flex flex-col items-center">
        <ShieldAlert className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Please log in to view your profile</h2>
      </div>
    );
  }

  if (loading) {
    return <div className="pt-32 text-center text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 relative">
          <div className="absolute -bottom-12 left-4 sm:left-8">
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-background border-4 border-surface rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md transition-colors text-sm">
                  <Edit2 className="h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 px-4 py-2 rounded-lg backdrop-blur-md transition-colors text-sm">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-background font-semibold px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all text-sm">
                    <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-4 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{profile?.name}</h2>
              <p className="text-primary">@{profile?.username}</p>
            </div>
            
            {/* Mobile Actions Container (visible only on small screens) */}
            <div className="flex sm:hidden gap-2 mt-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg backdrop-blur-md transition-colors text-sm">
                  <Edit2 className="h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-2.5 rounded-lg backdrop-blur-md transition-colors text-sm">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-primary text-background font-semibold px-3 py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all text-sm">
                    <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg mb-6">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Read-only fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Account Information</h3>
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-lg"><Mail className="h-5 w-5 text-slate-300" /></div>
                <div>
                  <p className="text-sm text-slate-400">Email Address</p>
                  <p className="text-white font-medium">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-lg"><UserIcon className="h-5 w-5 text-slate-300" /></div>
                <div>
                  <p className="text-sm text-slate-400">Username</p>
                  <p className="text-white font-medium">{profile?.username}</p>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Personalized Details</h3>
              
              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg mt-1"><UserIcon className="h-5 w-5 text-slate-300" /></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">Full Name</p>
                  {isEditing ? (
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50" />
                  ) : (
                    <p className="text-white font-medium">{profile?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg mt-1"><Phone className="h-5 w-5 text-slate-300" /></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">Contact Number</p>
                  {isEditing ? (
                    <input type="text" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50" />
                  ) : (
                    <p className="text-white font-medium">{profile?.contactNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg mt-1"><CreditCard className="h-5 w-5 text-slate-300" /></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">NIC</p>
                  {isEditing ? (
                    <input type="text" name="nic" value={formData.nic || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50" />
                  ) : (
                    <p className="text-white font-medium">{profile?.nic}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg mt-1"><Calendar className="h-5 w-5 text-slate-300" /></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-1">Birth Date</p>
                  {isEditing ? (
                    <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50 [color-scheme:dark]" />
                  ) : (
                    <p className="text-white font-medium">{profile?.birthDate}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Trading Preferences */}
            <div className="space-y-6 md:col-span-2 border-t border-white/10 pt-8 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4">Trading Preferences <span className="text-xs text-accent font-normal ml-2">(Used for Smart Alerts)</span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preferred Bank */}
                <div className="glass-card p-4">
                  <p className="text-sm text-slate-400 mb-2">Preferred Bank</p>
                  {isEditing ? (
                    <select name="preferredBank" value={formData.preferredBank || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50">
                      <option value="">Select a Bank...</option>
                      <option value="Commercial Bank">Commercial Bank</option>
                      <option value="Sampath Bank">Sampath Bank</option>
                      <option value="BOC">BOC</option>
                      <option value="HNB">HNB</option>
                      <option value="Seylan Bank">Seylan Bank</option>
                      <option value="Amana Bank">Amana Bank</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium text-lg">{profile?.preferredBank || 'Not Set'}</p>
                  )}
                </div>

                {/* Preferred Fiat Currency */}
                <div className="glass-card p-4">
                  <p className="text-sm text-slate-400 mb-2">Preferred Fiat Currency</p>
                  {isEditing ? (
                    <select name="preferredFiatCurrency" value={formData.preferredFiatCurrency || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50">
                      <option value="">Select Currency...</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium text-lg">{profile?.preferredFiatCurrency || 'Not Set'}</p>
                  )}
                </div>

                {/* Preferred Digital Currency */}
                <div className="glass-card p-4">
                  <p className="text-sm text-slate-400 mb-2">Preferred Digital Asset</p>
                  {isEditing ? (
                    <select name="preferredDigitalCurrency" value={formData.preferredDigitalCurrency || ''} onChange={handleChange} className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary/50">
                      <option value="">Select Asset...</option>
                      <option value="BTC">BTC - Bitcoin</option>
                      <option value="ETH">ETH - Ethereum</option>
                      <option value="SOL">SOL - Solana</option>
                      <option value="BNB">BNB - Binance Coin</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium text-lg">{profile?.preferredDigitalCurrency || 'Not Set'}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
