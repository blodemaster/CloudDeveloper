import * as uuid from 'uuid'

import { Moment } from '../models/moment'
import { MomentMetaAccess } from '../dataLayer/momentMetaAccess'
import { ImageAccess } from '../dataLayer/imageAccess'
import { CreateMomentRequest } from '../request/CreateMomentRequest'
import { UpdateMomentRequest } from '../request/UpdateMomentRequest'
import { getImageVisitUrl } from './image'

const momentAccess = new MomentMetaAccess()
const imageAccess = new ImageAccess()

export async function getAllMomemts(userId: string): Promise<Moment[]> {
    const momentsMeta = await momentAccess.getMomentsMeta(userId)
    const result : Moment[] = [];
    for (const meta of momentsMeta) {
        const images = await imageAccess.getImagesOfMoment(userId, meta.id)
        result.push({
            ...meta,
            images,
        })
    }
    return result
}

export async function createMoment(
    createMomentRequest: CreateMomentRequest,
    userId: string
): Promise<Moment> {
    const momentId = uuid.v4()
    const momentMeta = await momentAccess.createMomentMeta({
        id: momentId,
        userId,
        content: createMomentRequest.content,
        postedAt: new Date().toISOString()
    })
    const images = []
    for (const imageId of createMomentRequest.imageIds) {
        const image = await createImage(imageId, momentId, userId)
        images.push(image)
    }
    
    return {...momentMeta, images}
}

export async function updateMoment(momentId: string, userId: string, toUpdateMomentRequest: UpdateMomentRequest) {
    for (const imageId of toUpdateMomentRequest.toAddImageIds) {
        await createImage(imageId, momentId, userId)
    }
    for (const imageId of toUpdateMomentRequest.toDeleteImageIds) {
        await deleteImage(imageId)
    }
    return momentAccess.updateMomentMeta({
        id: momentId,
        userId,
        content: toUpdateMomentRequest.content,
        postedAt: new Date().toISOString()
    })
}

export async function deleteMoment(momentId: string, userId: string, imageIds: string[]) {
    for (const imageId of imageIds) {
        await deleteImage(imageId)
    }
    return momentAccess.deleteMomentMeta(momentId, userId)
}

async function createImage(imageId: string, momentId: string, userId: string) {
    const imageUrl = await getImageVisitUrl(imageId)
    return imageAccess.createImage({imageId, momentId, userId, imageUrl})
}

async function deleteImage(imageId: string) {
    return imageAccess.deleteImage(imageId)
}