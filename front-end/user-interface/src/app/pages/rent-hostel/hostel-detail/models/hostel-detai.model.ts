export class HostelModel {
    id: number;
    title: string;
    location: string;
    area: number;
    bathrooms: number;
    bedrooms: number;
    description: string;
    price: number;
    amentities: AmentitiesModel[];
    author: User;
    images: Images[];
    lat: number;
    lng: number;
}

export class AmentitiesModel {
    id: string;
    name: string;
}

class User {
    avatar: string;
    email: string;
    id: string;
    name: string;
    phone: string;
    role: string;
}

class Images {
    id: string;
    imgName: string;
}
