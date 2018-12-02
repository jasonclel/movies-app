export class Movie {
    _id?: string;
    id: string;
    title: string;
    description: string;
    type: string;
    publishedDate: Date;
    availableDate: Date;
    metadata: {
        value: string;
        name: string;
    }
    contents: {
        url: string;
        format: string;
        width: number;
        height: number;
        language: string;
        duration: number;
        geoLock: boolean;
        id: string;
    }
    credits: {
        role: string;
        name: string;
    }
    parentalRatings: {
        scheme: string;
        rating: string;
    }
    images: {
        type: string;
        url: string;
        width: number;
        height: number;
        id: string;
    }
    categories: {
        title: string;
        description: string;
        id: string;
    }
}
