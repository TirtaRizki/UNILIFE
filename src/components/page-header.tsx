import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    actions?: ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
    );
}
