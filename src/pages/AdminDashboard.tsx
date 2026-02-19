import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { Search, Shield, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { isAdmin, user: currentUser, loading: authLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
                Loading...
            </div>
        );
    }

    // Redirect if not admin (double check)
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
                <div className="font-bold text-lg">Unauthorized Access</div>
                <div className="text-xs font-mono bg-slate-200 p-4 rounded text-slate-700">
                    <div>User ID: {currentUser?.id}</div>
                    <div>Email: {currentUser?.email}</div>
                    <div>isAdmin: {String(isAdmin)}</div>
                </div>
                <p className="text-sm max-w-md text-center">
                    データベースの `user_profiles` テーブルで、このユーザーの `is_admin` を `TRUE` に設定してください。<br />
                    設定後はページをリロードしてください。
                </p>
            </div>
        );
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setMessage('Error: Supabase is not configured');
            return;
        }
        setLoading(true);
        setMessage('');
        setSearchResult(null);

        try {
            // 1. Find user ID from email in auth.users (Not possible from client usually)
            // Alternative: Search public.user_profiles if email is stored/synced there?
            // Wait, standard setup doesn't expose email in user_profiles easily unless synced.
            // Assumption: user_profiles has email or we search by known ID. 
            // Let's assume user_profiles has email for this MVP or we use an RPC to search by email using service_role.

            // For this phase, let's try to search user_profiles directly.
            // If email is not in user_profiles, we might need a trusted Edge Function to search auth.users.
            // Let's check user_profiles schema later. For now, assuming we can find user.

            // Actually, querying auth.users from client is impossible.
            // We should use an Edge Function for "Admin Search" later.
            // For MVP Phase 2-A: Let's assume we search by EXACT UUID or we rely on user_profiles having email.

            // Let's try to select from user_profiles assuming email might be there (it's often synced).
            // If not, we'll need to ask user to provide UUID.

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('email', email) // Assuming email column exists or added. 
                // If not, we might need to add it or search by ID.
                .single();

            if (error) {
                // Try searching by ID if email format is UUID
                if (email.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                    const { data: dataId, error: errorId } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', email)
                        .single();
                    if (errorId) throw errorId;
                    setSearchResult(dataId);
                    return;
                }
                throw error;
            }
            setSearchResult(data);
        } catch (err: any) {
            setMessage(`User not found: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleProStatus = async () => {
        if (!searchResult || !supabase) return;
        setLoading(true);
        try {
            const newStatus = !searchResult.is_pro;
            const { error } = await supabase.rpc('admin_set_pro_status', {
                target_user_id: searchResult.id,
                new_status: newStatus
            });

            if (error) throw error;

            setSearchResult({ ...searchResult, is_pro: newStatus });
            setMessage(`Success: Changed to ${newStatus ? 'Pro' : 'Free'}`);
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white p-3 rounded-xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-slate-500 text-sm">Welcome, {currentUser?.email}</p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6">
                    {/* Search Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Search size={20} /> User Search
                        </h2>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter User ID (UUID) or Email (if synced)"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Error') || message.includes('not found') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Result Card */}
                    {searchResult && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-bold text-xl flex items-center gap-2">
                                        <User size={24} className="text-slate-400" />
                                        User Details
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">{searchResult.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    {searchResult.is_pro ? (
                                        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold border border-violet-200">PRO</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200">FREE</span>
                                    )}
                                    {searchResult.is_admin && (
                                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200">ADMIN</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Plan Type</label>
                                    <div className="font-medium text-slate-700">{searchResult.plan_type || 'free'}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Updated At</label>
                                    <div className="font-medium text-slate-700">{new Date(searchResult.updated_at).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">Actions</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={toggleProStatus}
                                        disabled={loading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold border-2 transition-colors ${searchResult.is_pro
                                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                            }`}
                                    >
                                        {searchResult.is_pro ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        {searchResult.is_pro ? 'Revoke Pro Status' : 'Grant Pro Status'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    This action bypasses Stripe payments. Use for support only.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
