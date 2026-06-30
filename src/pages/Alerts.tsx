import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

const Alerts = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/notifications', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        setNotifications(await response.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/v1/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 text-center text-white min-h-screen flex flex-col items-center">
        <ShieldAlert className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Please log in to view your Smart Alerts</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" /> Smart Alerts
        </h1>
        <p className="text-slate-400 mt-2">Get notified immediately when your preferred bank offers the best market rates.</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Checking for alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/5">
          <Bell className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-slate-300">No new alerts</h3>
          <p className="text-slate-500 mt-2">Make sure you have set a Preferred Bank in your Profile!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`glass-card p-5 border-l-4 transition-all flex flex-col sm:flex-row items-stretch sm:items-start gap-4 ${notification.read ? 'border-l-slate-600 opacity-70' : 'border-l-primary shadow-[0_0_20px_rgba(0,240,255,0.15)]'}`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`mt-1 p-2 rounded-full shrink-0 ${notification.read ? 'bg-slate-800' : 'bg-primary/20'}`}>
                  {notification.read ? <CheckCircle2 className="h-5 w-5 text-slate-400" /> : <Bell className="h-5 w-5 text-primary animate-bounce" />}
                </div>
                
                <div className="flex-1">
                  <p className={`text-sm md:text-base ${notification.read ? 'text-slate-300' : 'text-white font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/10 shrink-0 w-full sm:w-auto text-center self-end sm:self-center"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
