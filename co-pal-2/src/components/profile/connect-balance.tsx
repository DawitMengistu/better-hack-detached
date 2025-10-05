"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCoins, IconCreditCard, IconPlus } from "@tabler/icons-react";
import { connectPackages } from "@/lib/payment-types";
import { toast } from "sonner";

interface ConnectBalanceProps {
    balance: number;
    onBuyConnects: (amount: number) => void;
}

export function ConnectBalance({ balance, onBuyConnects }: ConnectBalanceProps) {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBuyClick = () => {
        setIsPaymentOpen(true);
    };

    const handlePackageSelect = (packageInfo: typeof connectPackages[0]) => {
        setSelectedAmount(packageInfo.amount);
    };

    const handleConfirmPurchase = async () => {
        if (selectedAmount && !isProcessing) {
            setIsProcessing(true);
            try {
                await onBuyConnects(selectedAmount);
                toast.success(`Payment initiated for ${selectedAmount} connects!`);
                // Don't close modal or reset state since we're redirecting
                // setIsPaymentOpen(false);
                // setSelectedAmount(null);
                // setIsProcessing(false);
            } catch (error) {
                toast.error("Failed to initiate payment. Please try again.");
                setIsProcessing(false);
            }
        }
    };

    const handleCancelPurchase = () => {
        setIsPaymentOpen(false);
        setSelectedAmount(null);
    };

    if (isPaymentOpen) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconCreditCard className="w-5 h-5" />
                        Buy Credits
                    </CardTitle>
                    <CardDescription>
                        Choose a connect package to purchase
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        {connectPackages.map((pkg) => (
                            <div
                                key={pkg.amount}
                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedAmount === pkg.amount
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => !isProcessing && handlePackageSelect(pkg)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-foreground">
                                            {pkg.amount} Connects
                                        </div>
                                        <div className="text-lg font-bold text-primary">
                                            {pkg.price} birr
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8">
                                        <IconCoins className="w-5 h-5 text-foreground" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-3">
                        <Button
                            onClick={handleCancelPurchase}
                            variant="outline"
                            className="flex-1"
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmPurchase}
                            disabled={!selectedAmount || isProcessing}
                            className="flex-1"
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                "Buy Now"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full border-2">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                        <IconCoins className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-foreground">Connect Balance</span>
                        <p className="text-sm text-muted-foreground font-normal mt-0.5">
                            Use connects to access premium features
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-bold text-foreground">
                                {balance.toLocaleString()}
                            </span>
                            <span className="text-lg text-muted-foreground font-medium">connects</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Available for use
                        </p>
                    </div>
                    <Button
                        onClick={handleBuyClick}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 shadow-lg"
                        size="lg"
                    >
                        <IconPlus className="w-4 h-4" />
                        Buy More
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
