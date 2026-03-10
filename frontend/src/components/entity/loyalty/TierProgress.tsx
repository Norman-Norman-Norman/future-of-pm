import { useTheme } from '../../../context/ThemeContext';

interface LoyaltyAccount {
    totalPoints: number;
    lifetimePoints: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const TIER_CONFIG = {
    bronze: { next: 'silver' as const, nextThreshold: 1000, color: '#CD7F32' },
    silver: { next: 'gold' as const, nextThreshold: 5000, color: '#C0C0C0' },
    gold: { next: 'platinum' as const, nextThreshold: 10000, color: '#FFD700' },
    platinum: { next: null, nextThreshold: null, color: '#E5E4E2' }
};

const TIER_THRESHOLDS = { bronze: 0, silver: 1000, gold: 5000, platinum: 10000 };

interface Props {
    account: LoyaltyAccount;
}

export default function TierProgress({ account }: Props) {
    const { darkMode } = useTheme();
    const config = TIER_CONFIG[account.tier];

    if (!config.next || !config.nextThreshold) {
        return (
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-primary/40' : 'border-primary/30'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tier Status</span>
                    <span className="text-sm font-bold" style={{ color: config.color }}>MAX TIER 🏆</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    You've reached Platinum — the highest tier!
                </p>
            </div>
        );
    }

    const currentThreshold = TIER_THRESHOLDS[account.tier];
    const range = config.nextThreshold - currentThreshold;
    const progress = account.lifetimePoints - currentThreshold;
    const percentage = Math.min(100, Math.round((progress / range) * 100));
    const pointsNeeded = config.nextThreshold - account.lifetimePoints;

    return (
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-primary/40' : 'border-primary/30'}`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Progress to <span className="font-bold capitalize" style={{ color: TIER_CONFIG[config.next].color }}>{config.next}</span>
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {pointsNeeded.toLocaleString()} pts needed
                </span>
            </div>
            <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: config.color }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} capitalize`}>{account.tier}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} capitalize`}>{config.next}</span>
            </div>
        </div>
    );
}
