"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCoins, IconCreditCard, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

interface ConnectBalanceProps {
    balance: number;
    onBuyConnects: (amount: number) => void;
}

export function ConnectBalance({ balance, onBuyConnects }: ConnectBalanceProps) {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const connectPackages = [
        { amount: 100, price: 5.99, bonus: 0 },
        { amount: 250, price: 12.99, bonus: 25 },
        { amount: 500, price: 19.99, bonus: 100 },
        { amount: 1000, price: 34.99, bonus: 300 },
    ];

    const handleBuyClick = () => {
        setIsPaymentOpen(true);
    };

    const handlePackageSelect = (packageInfo: typeof connectPackages[0]) => {
        setSelectedAmount(packageInfo.amount);
    };

    const handleConfirmPurchase = async () => {
        if (selectedAmount) {
            try {
                await onBuyConnects(selectedAmount);
                toast.success(`Payment initiated for ${selectedAmount} connects!`);
                setIsPaymentOpen(false);
                setSelectedAmount(null);
            } catch (error) {
                toast.error("Failed to initiate payment. Please try again.");
            }
        }
    };

    const handleCancelPurchase = () => {
        setIsPaymentOpen(false);
        setSelectedAmount(null);
    };

    if (isPaymentOpen) {
        return (
            <Card className="w-full shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                        <IconCreditCard className="w-6 h-6 text-primary" />
                        Buy Credits
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Select a package to top up your Connects
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-4">
                        {connectPackages.map((pkg) => (
                            <div
                                key={pkg.amount}
                                className={`p-5 border rounded-xl cursor-pointer transition-all hover:shadow hover:border-primary ${selectedAmount === pkg.amount
                                        ? "border-primary bg-primary/10 shadow-md"
                                        : "border-border"
                                    }`}
                                onClick={() => handlePackageSelect(pkg)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-foreground text-lg">
                                                {pkg.amount} Connects
                                            </span>
                                            {pkg.bonus > 0 && (
                                                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                                    +{pkg.bonus} Bonus
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ${pkg.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <IconCoins className="w-7 h-7 text-yellow-500" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-5">
                        <Button
                            onClick={handleCancelPurchase}
                            variant="outline"
                            className="flex-1 py-3 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmPurchase}
                            disabled={!selectedAmount}
                            className="flex-1 py-3 font-medium"
                        >
                            Buy Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <IconCoins className="w-6 h-6 text-yellow-500" />
                    Connect Balance
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Use your Connects to access premium features and services
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">
                                {balance.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">connects</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Available balance
                        </p>
                    </div>
                    <Button
                        onClick={handleBuyClick}
                        className="flex items-center gap-2 py-2 px-4 font-medium shadow hover:shadow-md transition-all rounded-lg"
                    >
                        <IconPlus className="w-4 h-4" />
                        Buy Connects
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

}
