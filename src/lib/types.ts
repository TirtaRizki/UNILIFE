

export type Event = {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    status: "Upcoming" | "Completed" | "Cancelled";
    imageUrl?: string;
};

export type About = {
    id: string;
    title: string;
    description: string;
};

export type Banner = {
    id: string;
    title: string;
    status: "Active" | "Inactive";
    imageUrl?: string;
};

export type Committee = {
    id:string;
    userId: string;
    position: string;
    user?: User;
};

export type Lineup = {
    id: string;
    artistName: string;
    day: string;
    date: string;
};

export type Recap = {
    id: string;
    title: string;
    description?: string;
    status: "Published" | "Draft";
    imageUrl?: string;
};

export type Ticket = {
    id: string;
    type: string;
    price: number;
    status: "Available" | "Sold Out";
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Member" | "Panitia";
    password?: string;
    phoneNumber?: string;
};

export type BrandingSettings = {
    logoUrl?: string;
};
