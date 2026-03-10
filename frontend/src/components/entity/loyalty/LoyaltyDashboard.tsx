import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import TierProgress from './TierProgress';

interface LoyaltyTransaction {
    transactionId: number;
    type: 'earn' | 'redeem' | 'expire' | 'bonus';
    points: number;
    orderId?: number;
    description: string;
    createdAt: string;
}

interface LoyaltyAccount {
    accountId: number;
    branchId: number;
    totalPoints: number;
    lifetimePoints: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    history: LoyaltyTransaction[];
}

const TIER_ICONS: Record<string, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎'
};

const TIER_COLORS: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2'
};

const TIER_BENEFITS: Record<string, string[]> = {
    bronze: ['1 pt per $1 spent'],
    silver: ['1.5 pts per $1 spent', 'Free shipping on orders >$50'],
    gold: ['2 pts per $1 spent', 'Free shipping on all orders', 'Early access to new products'],
    platinum: ['3 pts per $1 spent', 'Free shipping on all orders', 'Early access to new products', 'Dedicated account manager']
};

const fetchLoyaltyAccount = async (): Promise<LoyaltyAccount> => {
    const { data } = await axios.get(`${api.baseURL}${api.endpoints.loyalty}/branch/1`);
    return data;
};

const TYPE_LABEL: Record<LoyaltyTransaction['type'], string> = {
    earn: 'Earned',
    redeem: 'Redeemed',
    expire: 'Expired',
    bonus: 'Bonus'
};

const TYPE_COLOR: Record<LoyaltyTransaction['type'], string> = {
    earn: 'text-primary',
    redeem: 'text-red-400',
    expire: 'text-gray-400',
    bonus: 'text-yellow-400'
};

export default function LoyaltyDashboard() {
    const { darkMode } = useTheme();
    const { data: account, isLoading, error } = useQuery('loyaltyAccount', fetchLoyaltyAccount);

    if (isLoading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
                <div className="max-w-3xl mx-auto flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" />
                </div>
            </div>
        );
    }

    if (error || !account) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
                <div className="max-w-3xl mx-auto text-center py-20">
                    <p className="text-red-500">Failed to load loyalty account.</p>
                </div>
            </div>
        );
    }

    const sortedHistory = [...account.history].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    🐾 Paw Points
                </h1>

                {/* Points Balance Card */}
                <div className={`rounded-xl p-6 border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Points Balance</p>
                            <p className={`text-5xl font-extrabold text-primary`}>
                                {account.totalPoints.toLocaleString()}
                            </p>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Lifetime: {account.lifetimePoints.toLocaleString()} pts
                            </p>
                        </div>
                        <div className="text-center">
                            <span className="text-6xl">{TIER_ICONS[account.tier]}</span>
                            <p
                                className="text-lg font-bold capitalize mt-1"
                                style={{ color: TIER_COLORS[account.tier] }}
                            >
                                {account.tier}
                            </p>
                        </div>
                    </div>

                    <TierProgress account={account} />
                </div>

                {/* Tier Benefits */}
                <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'}`}>
                    <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-t-xl`}>
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            Your Benefits
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <ul className="space-y-2">
                            {TIER_BENEFITS[account.tier].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="text-primary">✓</span>
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            100 Paw Points = $1.00 discount redeemable at checkout
                        </p>
                    </div>
                </div>

                {/* Transaction History */}
                <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'}`}>
                    <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-t-xl`}>
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            Transaction History
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200/20">
                        {sortedHistory.length === 0 ? (
                            <p className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No transactions yet.
                            </p>
                        ) : (
                            sortedHistory.map(tx => (
                                <div key={tx.transactionId} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                                            {tx.description}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${TYPE_COLOR[tx.type]}`}>
                                            {tx.type === 'redeem' || tx.type === 'expire' ? '-' : '+'}
                                            {tx.points.toLocaleString()} pts
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {TYPE_LABEL[tx.type]}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
