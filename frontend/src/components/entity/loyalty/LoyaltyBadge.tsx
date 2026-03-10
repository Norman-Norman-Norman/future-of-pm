import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';

interface LoyaltyAccount {
    accountId: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    totalPoints: number;
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

const fetchLoyaltyAccount = async (): Promise<LoyaltyAccount> => {
    const { data } = await axios.get(`${api.baseURL}${api.endpoints.loyalty}/branch/1`);
    return data;
};

export default function LoyaltyBadge() {
    const { data: account } = useQuery('loyaltyBadge', fetchLoyaltyAccount, {
        retry: false,
        staleTime: 30000
    });

    if (!account) return null;

    return (
        <Link
            to="/loyalty"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors hover:opacity-80"
            style={{ borderColor: TIER_COLORS[account.tier] + '80' }}
            title={`Paw Points: ${account.totalPoints.toLocaleString()} pts`}
        >
            <span className="text-base leading-none">{TIER_ICONS[account.tier]}</span>
            <span className="text-xs font-semibold capitalize hidden sm:inline" style={{ color: TIER_COLORS[account.tier] }}>
                {account.tier}
            </span>
            <span className="text-xs font-medium text-primary hidden md:inline">
                {account.totalPoints.toLocaleString()} pts
            </span>
        </Link>
    );
}
