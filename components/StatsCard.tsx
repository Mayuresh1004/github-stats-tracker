import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function StatsCard({ title, value }: { title: string; value: string }) {
    return (
        <div className='p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md flex flex-col items-start'>
            <p className='text-lg font-semibold text-[var(--text-secondary)]'>{title}</p>
            <p className='text-4xl font-bold text-[var(--text-primary)]'>{value}</p>
        </div>
    );
}