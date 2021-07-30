export interface RejectionReport {
    rejected: boolean;
    reason: string;
}

export interface RejectionProps {
    rejection: RejectionReport;
    handleRestart(): void;
    children: any;
}
