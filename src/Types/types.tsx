export interface PersonInterface {
    dbId: number;
    user_id: string;
    email: string;
    name: string;
    role: string;
    access: string;
}

export interface ItemInterface {
    dbId: number;
    id: number | string;
    type: "bug" | "request";
    title: string;
    description: string;
    addedBy: PersonInterface | undefined;
    status: "New" | "Viewed by PM" | "Submitted by PM" | "In Progress" | "Done";
    priority: "Minor" | "Low" | "Medium" | "High" | "Blocker";
    product?: "ProTools" | "Core" | "SecureTrade" | "Verticals" | undefined;
    platform?: "Admin" | "Application" | "Web" | undefined;
    platformVersion?: string;
    dateAdded: any;
    dateDone?: EpochTimeStamp | string;
    doneTimeEstimate?: EpochTimeStamp;
    assignedTo?: PersonInterface[];
    images?: string;
}

export type ViewMode = "table" | "card";

export interface EditFormInitialValues {
    type: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    product: string;
    platform: string;
    platformVersion: string;
    dateAdded: number | null;
    dateDone: number | null;
    id: string;
    addedBy: PersonInterface | undefined;
}

export type InitialStateType = {
    items: ItemInterface[] | null;
    isLoading: boolean;
    fetchCount: number;
    loggedIn: boolean;
    successMessage: boolean;
    failMessage: boolean
}