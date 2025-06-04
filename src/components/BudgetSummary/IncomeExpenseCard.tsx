import React from "react";

interface IncomeExpenseCardProps{
    icon: React.ReactNode;
    title: string;
    amount: number;
    bgColor: 'green' | 'red';
}

const IncomeExpenseCard: React.FC<IncomeExpenseCardProps> = ({icon, title, amount, bgColor}) => {
    const bgClass = bgColor === 'green' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700';
    const textColorClass = bgColor === 'green' ? 'text-green-600' : 'text-red-600';

    return(
        <div>
            <div className={`${bgClass} p-4 rounded-lg border border-red-100`}>
            <div className={`flex items-center mb-2 ${textColorClass}`}>
                {icon}
                <h3 className="font-medium">{title}</h3>
            </div>
            <p className={`text-xl font-semibold ${textColorClass}`}>${amount.toFixed(2)}</p>
            </div>
        </div>
    )
};

export default IncomeExpenseCard;