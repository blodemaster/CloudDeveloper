export interface MomentMeta {
  id: string;
  userId: string;
  content: string;
  postedAt: string;
}
export interface ImageType {
  imageId: string;
  imageUrl: string;
  momentId: string;
  userId: string;
}

export interface Moment extends MomentMeta {
  images: ImageType[];
}
