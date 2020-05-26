import { Image } from "./image";

export interface MomentMeta {
    id: string
    userId: string,
    content: string,
    postedAt: string,
}

export interface Moment extends MomentMeta {
    images: Image[]
}