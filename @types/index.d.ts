declare enum FixedTypeEnum {
  IMAGES = 'images',
  TEXT = 'text',
  VIDEO = 'video',
  RICHTEXT = 'richText'
}

declare type FixedContentItem<T extends FixedTypeEnum> = {
  type: T
  content: {
    data: string
    link?: string
  }[]
}

declare interface Window {
  fbAsyncInit: any
  FB: any
}
