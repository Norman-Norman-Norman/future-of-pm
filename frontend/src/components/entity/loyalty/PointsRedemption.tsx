import { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface LoyaltyAccount {
    accountId: number;
    totalPoints: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface Props {
    onRedemptionChange: (discountAmount: number) => void;
}

const fetchLoyaltyAccount = async (): Promise<LoyaltyAccount> => {
    const { data } = await axios.get(`${api.baseURL}${api.endpoints.loyalty}/branch/1`);
    return data;
};

export default function PointsRedemption({ onRedemptionChange }: Props) {
    const { darkMode } = useTheme();
    const queryClient = useQueryClient();
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemed, setRedeemed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: account, isLoading } = useQuery('loyaltyRedemption', fetchLoyaltyAccount, {
        retry: false
    });

    if (isLoading || !account) return null;

    const discountAmount = pointsToRedeem / 100;
    const maxRedeemable = account.totalPoints;

    const handleApply = async () => {
        if (pointsToRedeem <= 0 || pointsToRedeem > maxRedeemable) return;
        setError(null);
        try {
            await axios.post(`${api.baseURL}${api.endpoints.loyalty}/${account.accountId}/redeem`, {
                points: pointsToRedeem,
                description: `Points redeemed at checkout for $${discountAmount.toFixed(2)} discount`
            });
            setRedeemed(true);
            onRedemptionChange(discountAmount);
            queryClient.invalidateQueries('loyaltyBadge');
            queryClient.invalidateQueries('loyaltyAccount');
        } catch {
            setError('Failed to apply points. Please try again.');
        }
    };

    const handleRemove = () => {
        setRedeemed(false);
        setPointsToRedeem(0);
        onRedemptionChange(0);
        queryClient.invalidateQueries('loyaltyRedemption');
        queryClient.invalidateQueries('loyaltyBadge');
        queryClient.invalidateQueries('loyaltyAccount');
    };

    if (redeemed) {
        return (
            <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden mb-6`}>
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🐾</span>
                        <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            {pointsToRedeem} Paw Points applied
                        </span>
                        <span className="text-primary font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleRemove}
                        className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden mb-6`}>
            <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    <span>🐾</span> Redeem Paw Points
                </h2>
            </div>
            <div className="px-6 py-4">
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    You have <span className="font-bold text-primary">{maxRedeemable.toLocaleString()} pts</span> available.
                    100 pts = $1.00 discount.
                </p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={0}
                        max={maxRedeemable}
                        step={100}
                        value={pointsToRedeem || ''}
                        onChange={e => {
                            const val = Math.min(Number(e.target.value), maxRedeemable);
                            setPointsToRedeem(val < 0 ? 0 : val);
                        }}
                        placeholder="Enter points"
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 text-light border-gray-700 focus:border-primary' : 'bg-white text-gray-800 border-gray-300 focus:border-primary'} focus:outline-none focus:ring-1 focus:ring-primary`}
                    />
                    <button
                        onClick={() => setPointsToRedeem(maxRedeemable)}
                        className={`text-sm px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors`}
                    >
                        Use All
                    </button>
                </div>
                {pointsToRedeem > 0 && (
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Discount: <span className="font-bold text-primary">-${discountAmount.toFixed(2)}</span>
                    </p>
                )}
                {error && (
                    <p className="text-sm mt-2 text-red-500">{error}</p>
                )}
                <button
                    onClick={handleApply}
                    disabled={pointsToRedeem <= 0 || pointsToRedeem > maxRedeemable}
                    className={`mt-3 w-full py-2 rounded-lg font-semibold transition-colors ${
                        pointsToRedeem > 0 && pointsToRedeem <= maxRedeemable
                            ? 'bg-primary hover:bg-accent text-white'
                            : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                    }`}
                >
                    Apply Points
                </button>
            </div>
        </div>
    );
}
