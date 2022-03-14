import { ICommonProps } from "@kiva/ssirius-react";

export interface FingerprintRegistrationProps extends ICommonProps {
    getFingerprint(): Promise<string>;
    register(fingerprints: FingerprintMap, dependencyData: any): Promise<void>;
    dependencies: DependencyConfig;
}

export interface FingerprintKeyMap {
    1: string; 
    2: string; 
    3: string; 
    4: string; 
    5: string; 
    6: string; 
    7: string; 
    8: string; 
    9: string; 
    10: string; 
}

export interface FingerprintMap {
    1: FingerprintCapture; 
    2: FingerprintCapture; 
    3: FingerprintCapture; 
    4: FingerprintCapture; 
    5: FingerprintCapture; 
    6: FingerprintCapture; 
    7: FingerprintCapture; 
    8: FingerprintCapture; 
    9: FingerprintCapture; 
    10: FingerprintCapture; 
}

export interface FingerprintCapture {
    image: string;
    captured: Date;
}

interface DependencyConfig {
    [index: string]: string[]
}

export type fpIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;