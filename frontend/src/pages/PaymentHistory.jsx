import { useCallback, useEffect, useMemo, useState } from "react";
import { Crown, FileText, Receipt, RefreshCcw } from "lucide-react";
import PageSkeleton from "../components/PageSkeleton";
import { getPaymentHistory } from "../services/paymentService";

function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            setPayments(await getPaymentHistory());
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPayments();
    }, [fetchPayments]);

    const totalPaid = useMemo(
        () =>
            payments
                .filter((payment) => payment.status === "SUCCESS")
                .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
        [payments]
    );

    if (loading) {
        return <PageSkeleton variant="dashboard" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="kid-panel-soft p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1.5 text-sm font-black text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                            <Receipt className="h-4 w-4" />
                            Payment History
                        </div>
                        <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">
                            Your Premium payments
                        </h1>
                        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
                            Track mock subscription transactions created from the Premium page.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchPayments}
                        className="kid-button kid-button-blue"
                    >
                        <RefreshCcw className="h-5 w-5" />
                        Refresh
                    </button>
                </div>
            </section>

            {errorMessage && (
                <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-500 dark:bg-red-950/40">
                    {errorMessage}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-3">
                <PaymentStat
                    icon={<Receipt className="h-7 w-7" />}
                    label="Transactions"
                    value={payments.length}
                    color="bg-sky-100 text-[#1CB0F6]"
                />
                <PaymentStat
                    icon={<Crown className="h-7 w-7" />}
                    label="Successful Payments"
                    value={payments.filter((payment) => payment.status === "SUCCESS").length}
                    color="bg-yellow-100 text-yellow-600"
                />
                <PaymentStat
                    icon={<FileText className="h-7 w-7" />}
                    label="Total Paid"
                    value={`$${totalPaid}`}
                    color="bg-green-100 text-[#58CC02]"
                />
            </section>

            <section className="kid-panel overflow-hidden">
                <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                        Transactions
                    </h2>
                    <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">
                        Latest payments are shown first.
                    </p>
                </div>

                {payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <Receipt className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                        <p className="font-bold text-slate-500 dark:text-slate-400">
                            No payment history yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px]">
                            <thead className="bg-sky-50 dark:bg-slate-950">
                                <tr>
                                    <TableHeader>ID</TableHeader>
                                    <TableHeader>Plan</TableHeader>
                                    <TableHeader>Amount</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Provider</TableHeader>
                                    <TableHeader>Paid At</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-t border-slate-100 dark:border-slate-800"
                                    >
                                        <td className="p-4 font-bold text-slate-500">
                                            #{payment.id}
                                        </td>
                                        <td className="p-4 font-bold text-slate-950 dark:text-white">
                                            {payment.planType}
                                        </td>
                                        <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                                            ${payment.amount}
                                        </td>
                                        <td className="p-4">
                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#58CC02] dark:bg-green-950">
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-500">
                                            {payment.provider}
                                        </td>
                                        <td className="p-4 font-bold text-slate-500">
                                            {formatDateTime(payment.paidAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function PaymentStat({ icon, label, value, color }) {
    return (
        <article className="kid-card p-5">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                {icon}
            </div>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-1 text-4xl font-bold text-slate-950 dark:text-white">{value}</p>
        </article>
    );
}

function TableHeader({ children }) {
    return (
        <th className="p-4 text-left text-sm font-bold text-slate-500 dark:text-slate-400">
            {children}
        </th>
    );
}

function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString();
}

export default PaymentHistory;
