export interface Flow {
    [index: string]: PermittedNavigation | undefined,
    confirmation: PermittedNavigation,
    verificationRequirement: PermittedNavigation,
    menu?: PermittedNavigation
}

export interface PermittedNavigation {
    // TODO: Don't allow additional indices
    [index: string]: string | undefined,
    BACK?: string,
    NEXT: string
}
