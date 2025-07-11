
import {
    TrendingUp,
    ChevronRight,
} from 'lucide-react';

// StatCard Component matching your div styling
const StatCard = ({ title, value, subtitle, icon: Icon = TrendingUp, color, trend, onClick, expandable = false, loading = false }) => (
    <div
        className={`bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-primary)] p-6 shadow-sm transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${loading ? 'opacity-50' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
                <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: color }}
                >
                    {Icon && <Icon className="h-6 w-6 text-[var(--color-text-primary)]" />}
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{title}</p>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {loading ? (
                            <div className="animate-pulse bg-[var(--color-border-primary)] h-8 w-16 rounded"></div>
                        ) : (
                            value
                        )}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
                {trend !== undefined && (
                    <div className={`flex items-center text-sm ${trend > 0 ? 'text-[var(--color-green)]' : trend < 0 ? 'text-[var(--color-red)]' : 'text-[var(--color-text-muted)]'}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>{trend > 0 ? '+' : ''}{trend}%</span>
                    </div>
                )}
                {expandable && (
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                )}
            </div>
        </div>
    </div>
);


export default StatCard;