import ICommonProps from './ICommonProps';

export interface VerificationRequirementProps extends ICommonProps {
    header: string;
    backButtonText: string;
    nextButtonText: string;
    instructions: string;
}

export interface VerificationRequirementState {
    verificationRequired: number;
    proofOptions: any[];
    proofsLoading: boolean;
    proofOptionsError: string;
}

export interface ProofRequestProfile {
    comment: string;
    proof_request: any;
    schema_id: string;
}
